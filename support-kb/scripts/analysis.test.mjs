import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze } from './analyze.mjs';
import { causeOf, dayFirst, sameCause, uniqueById } from '../src/lib/kb/causes.ts';

test('the export reconciles at report-ID grain, with a complete non-overlapping partition', async () => {
  const a = await analyze();
  assert.equal(a.exportRows, 427);
  assert.equal(a.duplicateRows, 15);
  assert.equal(a.uniqueReports, 412);
  assert.equal(a.mergedReports, 412);
  assert.deepEqual(a.conflictingIds, []);
  assert.deepEqual(a.missingTenants, []);
  assert.deepEqual(a.groups.map((g) => [g.cause, g.count]), [['parser', 379], ['hint', 33]]);
  const ids = a.groups.flatMap((g) => g.reportIds);
  assert.equal(ids.length, 412);
  assert.equal(new Set(ids).size, 412);
  assert.equal(a.intakeDisagreements.length, 38);
  assert.equal(a.notedSymptoms.length, 5);
  assert.ok(a.notedSymptoms.every((r) => r.classifiedAs === 'parser'));
  assert.deepEqual(a.problemTickets.map((p) => p.count), [374, 33, 1, 1, 1, 1, 1]);
  const reviewedIds = a.problemTickets.flatMap((p) => p.reportIds);
  assert.equal(reviewedIds.length, 412);
  assert.equal(new Set(reviewedIds).size, 412);
  assert.deepEqual([...reviewedIds].sort(), [...ids].sort());
  const investigations = a.problemTickets.filter((p) => p.kind === 'Investigation');
  assert.equal(investigations.length, 5);
  assert.deepEqual(investigations.flatMap((p) => p.reportIds).sort(), a.notedSymptoms.map((r) => r.id).sort());
  assert.ok(a.notedSymptoms.every((r) => !a.problemTickets.find((p) => p.key === 'parser').reportIds.includes(r.id)));
  // Independent reconciliation from tenant attributes, not the intake label or group helper.
  assert.ok(a.tenantDefinitions.every((t) => t.dayFirst));
});

test('cause follows tenant locale, channel and form; subjects and intake labels cannot decide it', () => {
  const v3 = { handle: 'alder.physio', name: 'Alder Physio', locale: 'de-DE', form: 'booking-v3' };
  const v2 = { ...v3, form: 'booking-v2' };
  const form = { channel: 'form', subject: 'Date is wrong' };
  const app = { channel: 'app', subject: 'Date is wrong' };
  assert.equal(causeOf(form, v3), 'hint');
  assert.equal(causeOf(app, v3), 'parser');
  assert.equal(causeOf(form, v2), 'parser');
  assert.equal(sameCause(form, v3, app, v3), false);
  assert.equal(sameCause(app, v3, { channel: 'email', subject: 'Different words' }, v3), true);
  assert.equal(causeOf(form, undefined), null);
  assert.equal(sameCause(form, undefined, form, undefined), false);
  assert.equal(causeOf(form, { ...v3, locale: 'en-US' }), null);
  assert.equal(dayFirst('en-GB'), true);
  assert.equal(dayFirst('en-US'), false);
});

test('overlapping export pages retain one record per ID, with last occurrence winning', () => {
  const first = { id: 'r1', body: 'first' };
  const last = { id: 'r1', body: 'last' };
  assert.deepEqual(uniqueById([first, { id: 'r2' }, last]), [last, { id: 'r2' }]);
});
