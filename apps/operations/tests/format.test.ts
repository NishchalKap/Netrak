import assert from 'node:assert/strict';
import test from 'node:test';
import { inferRisk, safeReference, toGeoJson } from '../src/lib/format.ts';
import type { CaseRecord } from '../src/types/index.ts';

const baseCase: CaseRecord = {
  id: 'case-1',
  title: 'Routine report',
  description: 'A sufficiently detailed incident report.',
  status: 'OPEN',
  userId: 'user-1',
  createdAt: '2026-07-16T00:00:00.000Z',
  updatedAt: '2026-07-16T00:00:00.000Z',
};

test('external references allow HTTPS only', () => {
  assert.equal(safeReference('https://evidence.example.gov.in/item/1'), 'https://evidence.example.gov.in/item/1');
  assert.equal(safeReference('http://evidence.example.gov.in/item/1'), null);
  assert.equal(safeReference('javascript:alert(1)'), null);
  assert.equal(safeReference('not a URL'), null);
});

test('risk inference prefers reported metadata and remains deterministic', () => {
  assert.equal(inferRisk({ ...baseCase, riskLevel: 'low', title: 'Emergency transfer' }), 'low');
  assert.equal(inferRisk({ ...baseCase, title: 'Emergency transfer' }), 'critical');
  assert.equal(inferRisk(baseCase), 'medium');
});

test('GeoJSON conversion rejects absent and invalid coordinates', () => {
  assert.equal(toGeoJson([baseCase]).features.length, 0);
  assert.equal(toGeoJson([{ ...baseCase, coordinates: [181, 20] } as CaseRecord]).features.length, 0);
  const valid = toGeoJson([{ ...baseCase, coordinates: [72.8777, 19.076] } as CaseRecord]);
  assert.deepEqual(valid.features[0].geometry.coordinates, [72.8777, 19.076]);
});
