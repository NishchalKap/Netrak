const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const test = require('node:test');
const jwt = require('jsonwebtoken');

const { loginSchema, refreshTokenSchema, registerSchema, updateProfileSchema } = require('../dist/dto/auth.dto');
const { createCaseSchema, updateCaseSchema } = require('../dist/dto/case.dto');
const { idParamSchema } = require('../dist/dto/common.dto');
const { authenticate, authorize } = require('../dist/middleware/auth.middleware');
const { createRateLimiter } = require('../dist/middleware/rate-limit.middleware');
const { isMalformedJsonError } = require('../dist/middleware/error.middleware');
const { AuthService } = require('../dist/services/auth.service');
const { CaseService } = require('../dist/services/case.service');
const { NotificationService } = require('../dist/services/notification.service');
const { env } = require('../dist/config/env');

test('authentication input is normalized and bounded', () => {
  const result = loginSchema.parse({ email: '  Citizen@Example.com ', password: 'secure-pass' });
  assert.equal(result.email, 'citizen@example.com');
  assert.throws(() => loginSchema.parse({ email: 'invalid', password: 'short' }));
  assert.throws(() => registerSchema.parse({ email: 'citizen@example.com', password: 'too-short' }));
  assert.equal(registerSchema.parse({ email: 'citizen@example.com', password: 'a long passphrase' }).password, 'a long passphrase');
  assert.throws(() => refreshTokenSchema.parse({ token: 'short' }));
});

test('request schemas reject mass assignment and malformed identifiers', () => {
  assert.throws(() => createCaseSchema.parse({ title: 'Valid title', description: 'A sufficiently detailed report.', userId: crypto.randomUUID() }));
  assert.throws(() => idParamSchema.parse({ id: 'not-a-uuid' }));
  assert.equal(idParamSchema.parse({ id: crypto.randomUUID() }).id.length, 36);
});

test('malformed JSON is classified as a client error', () => {
  const error = Object.assign(new SyntaxError('Unexpected end of JSON input'), { status: 400, type: 'entity.parse.failed' });
  assert.equal(isMalformedJsonError(error), true);
  assert.equal(isMalformedJsonError(new SyntaxError('Unrelated syntax error')), false);
});

test('empty mutations and malformed profile data are rejected', () => {
  assert.throws(() => updateCaseSchema.parse({}));
  assert.throws(() => updateProfileSchema.parse({}));
  assert.throws(() => updateProfileSchema.parse({ phone: 'not-a-phone' }));
  assert.deepEqual(updateProfileSchema.parse({ phone: null }), { phone: null });
});

test('expired access tokens refresh only inside the configured grace period', async () => {
  const service = new AuthService();
  const recentlyExpired = jwt.sign({ id: 'user-1', role: 'CITIZEN' }, env.JWT_SECRET, {
    algorithm: 'HS256', issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, subject: 'user-1', jwtid: crypto.randomUUID(), expiresIn: -5,
  });
  const refreshed = await service.refresh(recentlyExpired);
  assert.equal(typeof refreshed.token, 'string');
  await assert.rejects(() => service.refresh(recentlyExpired), (error) => error.statusCode === 401);

  const stale = jwt.sign({ id: 'user-1', role: 'CITIZEN' }, env.JWT_SECRET, {
    algorithm: 'HS256', issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, subject: 'user-1', jwtid: crypto.randomUUID(), expiresIn: -(env.JWT_REFRESH_GRACE_SECONDS + 5),
  });
  await assert.rejects(() => service.refresh(stale), (error) => error.statusCode === 401);
});

test('JWT middleware accepts only expected issuer, audience and algorithm', () => {
  const validToken = jwt.sign({ id: 'user-1', role: 'CITIZEN' }, env.JWT_SECRET, {
    algorithm: 'HS256', issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, subject: 'user-1', jwtid: crypto.randomUUID(), expiresIn: '5m',
  });
  const request = { headers: { authorization: `Bearer ${validToken}` } };
  let captured;
  authenticate(request, {}, (error) => { captured = error; });
  assert.equal(captured, undefined);
  assert.deepEqual(request.user, { id: 'user-1', role: 'CITIZEN' });

  const invalidToken = jwt.sign({ id: 'user-1', role: 'CITIZEN' }, env.JWT_SECRET, { issuer: 'wrong', audience: env.JWT_AUDIENCE });
  authenticate({ headers: { authorization: `Bearer ${invalidToken}` } }, {}, (error) => { captured = error; });
  assert.equal(captured.statusCode, 401);
});

test('role authorization denies citizens access to staff operations', () => {
  let captured;
  authorize(['OFFICER', 'ADMIN'])({ user: { id: 'user-1', role: 'CITIZEN' } }, {}, (error) => { captured = error; });
  assert.equal(captured.statusCode, 403);
});

test('rate limiting emits bounded standard headers and blocks excess requests', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 2 });
  const request = { ip: '127.0.0.1', socket: {} };
  const headers = new Map();
  const response = {
    locals: { requestId: 'request-123' },
    setHeader: (name, value) => headers.set(name, value),
    getHeader: (name) => headers.get(name),
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
  let passed = 0;
  limiter(request, response, () => { passed += 1; });
  limiter(request, response, () => { passed += 1; });
  limiter(request, response, () => { passed += 1; });
  assert.equal(passed, 2);
  assert.equal(response.statusCode, 429);
  assert.equal(headers.get('RateLimit-Limit'), 2);
  assert.equal(typeof headers.get('Retry-After'), 'number');
});

test('citizens cannot mutate staff workflow or another citizen case', async () => {
  const service = new CaseService();
  service.caseRepository = {
    findById: async (id) => ({ id, userId: 'owner-1', status: 'OPEN' }),
    update: async () => { throw new Error('should not update'); },
  };
  await assert.rejects(
    () => service.updateCase(crypto.randomUUID(), { status: 'CLOSED' }, { id: 'owner-1', role: 'CITIZEN' }),
    (error) => error.statusCode === 403
  );
  await assert.rejects(
    () => service.getCaseById(crypto.randomUUID(), { id: 'owner-2', role: 'CITIZEN' }),
    (error) => error.statusCode === 404
  );
});

test('notification creation rejects an unknown recipient', async () => {
  const service = new NotificationService();
  service.userRepository = { findById: async () => null };
  service.notificationRepository = { create: async () => { throw new Error('should not create'); } };
  await assert.rejects(
    () => service.createNotification({ userId: crypto.randomUUID(), message: 'Test alert' }),
    (error) => error.statusCode === 404
  );
});
