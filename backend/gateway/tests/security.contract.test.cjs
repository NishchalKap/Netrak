const assert = require('node:assert/strict');
const test = require('node:test');
const jwt = require('jsonwebtoken');

const { loginSchema, refreshTokenSchema, updateProfileSchema } = require('../dist/dto/auth.dto');
const { updateCaseSchema } = require('../dist/dto/case.dto');
const { authenticate, authorize } = require('../dist/middleware/auth.middleware');
const { env } = require('../dist/config/env');

test('authentication input is normalized and bounded', () => {
  const result = loginSchema.parse({ email: '  Citizen@Example.com ', password: 'secure-pass' });
  assert.equal(result.email, 'citizen@example.com');
  assert.throws(() => loginSchema.parse({ email: 'invalid', password: 'short' }));
  assert.throws(() => refreshTokenSchema.parse({ token: 'short' }));
});

test('empty mutations and malformed profile data are rejected', () => {
  assert.throws(() => updateCaseSchema.parse({}));
  assert.throws(() => updateProfileSchema.parse({ phone: 'not-a-phone' }));
});

test('JWT middleware accepts only expected issuer, audience and algorithm', () => {
  const validToken = jwt.sign({ id: 'user-1', role: 'CITIZEN' }, env.JWT_SECRET, {
    algorithm: 'HS256', issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, expiresIn: '5m',
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
