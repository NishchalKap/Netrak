const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const test = require('node:test');

const enabled = process.env.RUN_DATABASE_TESTS === 'true';

test('PostgreSQL release workflow preserves ownership, evidence, and timeline contracts', { skip: !enabled }, async () => {
  const { prisma } = require('../dist/database/prisma');
  const { AuthService } = require('../dist/services/auth.service');
  const { CaseService } = require('../dist/services/case.service');
  const { EvidenceService } = require('../dist/services/evidence.service');
  const { NotificationService } = require('../dist/services/notification.service');
  const suffix = crypto.randomUUID();
  const citizenEmail = `citizen-${suffix}@example.test`;
  const officerEmail = `officer-${suffix}@example.test`;

  try {
    const auth = new AuthService();
    const citizenAuth = await auth.register({ email: citizenEmail, password: 'release candidate citizen passphrase', role: 'CITIZEN' });
    const officerAuth = await auth.register({ email: officerEmail, password: 'release candidate officer passphrase', role: 'OFFICER' });
    assert.equal((await auth.login({ email: citizenEmail, password: 'release candidate citizen passphrase' })).user.id, citizenAuth.user.id);

    const cases = new CaseService();
    const created = await cases.createCase({
      title: 'Integration test report',
      description: 'Synthetic release-gate report with no production data.',
      category: 'other',
      riskLevel: 'low',
      location: 'Test environment',
    }, citizenAuth.user.id);
    assert.equal(created.timeline.length, 1);
    assert.equal(created.timeline[0].title, 'Case created');

    await assert.rejects(
      () => cases.getCaseById(created.id, { id: crypto.randomUUID(), role: 'CITIZEN' }),
      (error) => error.statusCode === 404
    );
    await assert.rejects(
      () => cases.updateCase(created.id, { status: 'CLOSED' }, { id: citizenAuth.user.id, role: 'CITIZEN' }),
      (error) => error.statusCode === 403
    );

    const evidence = await new EvidenceService().addEvidence(created.id, {
      type: 'note',
      label: 'Synthetic test reference',
      reference: 'integration-test-reference',
      notes: 'No personal or production information.',
    }, { id: citizenAuth.user.id, role: 'CITIZEN' });
    assert.equal(evidence.caseId, created.id);

    const updated = await cases.updateCase(created.id, { status: 'IN_PROGRESS' }, { id: officerAuth.user.id, role: 'OFFICER' });
    assert.equal(updated.status, 'IN_PROGRESS');
    assert.equal(updated.timeline.some((entry) => entry.title === 'Case status changed'), true);

    const notification = await new NotificationService().createNotification({
      userId: citizenAuth.user.id,
      message: 'Synthetic integration notification',
    });
    assert.equal(notification.userId, citizenAuth.user.id);
  } finally {
    await prisma.notification.deleteMany({ where: { user: { email: { in: [citizenEmail, officerEmail] } } } });
    await prisma.case.deleteMany({ where: { user: { email: { in: [citizenEmail, officerEmail] } } } });
    await prisma.user.deleteMany({ where: { email: { in: [citizenEmail, officerEmail] } } });
    await prisma.$disconnect();
  }
});
