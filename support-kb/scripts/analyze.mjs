import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { causeOf, dayFirst, groupByCause, uniqueById } from '../src/lib/kb/causes.ts';
import { reviewProblems } from '../src/lib/kb/review-problems.ts';

const root = new URL('../', import.meta.url);
const load = async (name) => JSON.parse(await readFile(new URL(name, root), 'utf8'));
export async function analyze() {
  const reports = await load('src/lib/data/reports-4471.json');
  const names = await readdir(new URL('src/lib/data/tenants/', root));
  const tenants = await Promise.all(names.filter((n) => n.endsWith('.json')).map((n) => load(`src/lib/data/tenants/${n}`)));
  const byTenant = new Map(tenants.map((t) => [t.handle, t]));
  const unique = uniqueById(reports);
  const merged = unique.filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(merged, (r) => byTenant.get(r.tenant));
  const notes = await load('src/lib/data/desk-notes.json');
  const duplicates = reports.filter((r, i) => reports.findIndex((other) => other.id === r.id) !== i);
  const conflictingIds = [...new Set(reports.filter((r) => reports.some((other) => other.id === r.id && JSON.stringify(other) !== JSON.stringify(r))).map((r) => r.id))];
  const sourceBytes = await readFile(new URL('src/lib/data/reports-4471.json', root));
  return {
    grain: 'one report per distinct id; mergedInto === 4471',
    sourceSha256: createHash('sha256').update(sourceBytes).digest('hex'),
    exportRows: reports.length,
    uniqueReports: unique.length,
    mergedReports: merged.length,
    duplicateRows: duplicates.length,
    duplicateIds: duplicates.map((r) => r.id),
    conflictingIds,
    missingTenants: merged.filter((r) => !byTenant.has(r.tenant)).map((r) => r.id),
    tenantDefinitions: tenants.map((t) => ({ ...t, dayFirst: dayFirst(t.locale) })).sort((a, b) => a.handle.localeCompare(b.handle)),
    groups: groups.map((g) => ({
      cause: g.cause, count: g.reports.length, tenants: g.tenants,
      firstSeen: g.firstSeen, lastSeen: g.lastSeen, intakeTags: g.taggedAs,
      reportIds: g.reports.map((r) => r.id)
    })),
    problemTickets: reviewProblems(merged, (r) => byTenant.get(r.tenant)).map(({ reports, ...p }) => ({ ...p, reportIds: reports.map((r) => r.id) })),
    intakeDisagreements: merged.filter((r) => causeOf(r, byTenant.get(r.tenant)) !== r.meta.intakeTag).map((r) => r.id),
    notedSymptoms: merged.filter((r) => notes.oneDayMove.includes(r.id)).map((r) => ({
      id: r.id, tenant: r.tenant, channel: r.channel, body: r.body,
      classifiedAs: causeOf(r, byTenant.get(r.tenant))
    })),
    receivedByMonth: Object.fromEntries([...new Set(merged.map((r) => r.receivedAt.slice(0, 7)))].sort().map((m) => [m, merged.filter((r) => r.receivedAt.startsWith(m)).length])),
    mergedOnJuly2: merged.filter((r) => r.mergedAt?.startsWith('2026-07-02')).length,
    receivedBeforeJuly2: merged.filter((r) => r.receivedAt.slice(0, 10) < '2026-07-02').length,
    latestReceived: merged.map((r) => r.receivedAt).sort().at(-1)
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await analyze();
  const destination = new URL('../evidence/', root);
  await mkdir(destination, { recursive: true });
  await writeFile(new URL('analysis.json', destination), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ ...result, tenantDefinitions: undefined, duplicateIds: undefined, intakeDisagreements: result.intakeDisagreements.length, notedSymptoms: result.notedSymptoms.map((r) => r.id), groups: result.groups.map(({ reportIds, ...g }) => g), problemTickets: result.problemTickets.map((p) => ({ key: p.key, count: p.count, kind: p.kind })) }, null, 2));
}
