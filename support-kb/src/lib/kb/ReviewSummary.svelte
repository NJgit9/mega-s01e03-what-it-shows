<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { reviewProblems } from '#lib/kb/review-problems';
  import filedIssues from '#lib/data/github-issues.json';

  const unique = uniqueById(reports as Report[]);
  const merged = unique.filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const tickets = reviewProblems(merged, tenantOf);
  const issueFor = (key: string) => filedIssues.find((issue) => issue.key === key);
  const flagged = merged.filter((r) => notes.oneDayMove.includes(r.id));
  const mismatches = groups.reduce((n, g) => n + g.reports.filter((r) => r.meta.intakeTag !== g.cause).length, 0);
  const july2 = merged.filter((r) => r.mergedAt?.startsWith('2026-07-02')).length;
  const months = [...new Set(merged.map((r) => r.receivedAt.slice(0, 7)))].sort();
</script>

<p><strong>{reports.length}</strong> export rows − <strong>{reports.length - unique.length}</strong> duplicate rows = <strong>{merged.length}</strong> unique reports merged into #4471.</p>
<p><strong>{filedIssues.length} GitHub issues filed.</strong></p>
<div class="table-scroll">
<table data-testid="problem-tickets">
  <caption>One ticket per distinguishable problem; investigation causes remain unconfirmed</caption>
  <thead><tr><th>Problem / GitHub issue</th><th>Reports</th><th>Basis</th></tr></thead>
  <tbody>
    {#each tickets as t (t.key)}
      <tr data-problem={t.key}><th scope="row"><a href={issueFor(t.key)?.url ?? '/ticket-drafts/' + t.key + '.md'}>#{issueFor(t.key)?.number} · {t.title}</a></th><td>{t.count}</td><td>{t.kind}</td></tr>
    {/each}
  </tbody>
</table>
</div>
<p>The original cause classifier assigns <strong>{groups.find((g) => g.cause === 'parser')?.reports.length}</strong> reports to parser and <strong>{groups.find((g) => g.cause === 'hint')?.reports.length}</strong> to hint; intake tags disagree with it for <strong>{mismatches}</strong> reports. The ticket list above removes the five contradictory symptom reports from the parser ticket and uses the report bodies to define separate investigations.</p>

<h3>Reports received by month</h3>
<table>
  <thead><tr><th>Month</th><th>Reports received</th></tr></thead>
  <tbody>{#each months as month}<tr><th scope="row">{month}{month === '2026-10' ? ' (through October 4)' : ''}</th><td>{merged.filter((r) => r.receivedAt.startsWith(month)).length}</td></tr>{/each}</tbody>
</table>
<p><strong>{july2}</strong> reports were merged on July 2. The merge spike records desk activity; it does not show when all those failures occurred. The timeline below distinguishes receipt from merge.</p>

<h3>Separate investigations</h3>
<p>The desk notes flag <strong>{flagged.length}</strong> reports, including an invite allegedly sent before booking creation. Each has its own investigation ticket. The export's note name and tenant-based classification do not establish that these reports share a cause. Merge investigations only after evidence links them.</p>
<dl>
  {#each flagged as r (r.id)}
    <dt><a href={issueFor(tickets.find((t) => t.reports.some((item) => item.id === r.id))?.key ?? '')?.url}><code>{r.id}</code></a> · {r.tenant} · {r.channel}</dt>
    <dd>{r.body}</dd>
  {/each}
</dl>

<style>
  .table-scroll { overflow-x: auto; }
  .table-scroll table { min-width: 480px; }
  caption { text-align: left; font-weight: 600; }
  dt { margin-top: 0.8rem; font-weight: 600; }
  dd { margin: 0.15rem 0 0 1rem; }
</style>
