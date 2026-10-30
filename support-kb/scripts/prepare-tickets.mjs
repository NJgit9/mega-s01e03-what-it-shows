import { mkdir, writeFile } from 'node:fs/promises';
import { analyze } from './analyze.mjs';

const result = await analyze();
const locations = [new URL('../../issue-drafts/', import.meta.url), new URL('../static/ticket-drafts/', import.meta.url)];
for (const location of locations) await mkdir(location, { recursive: true });
for (const p of result.problemTickets) {
  const ids = p.reportIds;
  const list = Array.from({ length: Math.ceil(ids.length / 8) }, (_, i) => ids.slice(i * 8, i * 8 + 8).join(' ')).join('\n');
  const body = `# [4471/${p.key}] ${p.title} — ${p.count} report${p.count === 1 ? '' : 's'}

## Scope

**Report count: ${p.count} unique report${p.count === 1 ? '' : 's'}.** ${p.tenants} tenant${p.tenants === 1 ? '' : 's'}. Received ${p.firstSeen} through ${p.lastSeen}.

Triage basis: **${p.kind}**. This is a ${p.kind === 'Investigation' ? 'reported problem requiring investigation, not a confirmed root cause' : 'cause described by the supplied KB model, pending production reproduction'}.

Source: the course-supplied October 4, 2026 KB export, archive SHA-256 \`267efc5ea61aca6efaaca842160ac4d0377d56bcbf5123e61c604d6ae99597f2\`. #4471 is a source-desk identifier, not this GitHub issue number. Deduplicate the 427 rows by report ID, then select the 412 merged into #4471.

## Evidence

${p.evidence}

## Action and verification

${p.next}

## Triage boundaries

The supplied classifier produces 379 parser and 33 hint reports. Review moved five contradictory symptom reports out of the parser ticket into five separate investigations. The ticket counts now partition the 412 unique report IDs exactly once: 374 parser candidates, 33 hint reports, and five single-report investigations. These investigations may later merge if evidence establishes the same cause; distinct symptoms alone do not prove distinct root causes.

Matching subjects, browser locales and intake tags do not establish a cause. Receipt timestamps and merge timestamps describe different events. The export has no product field, product source or booking logs: do not infer affected-user totals, shipped fixes, or confirmed production causes.

## Included report IDs

\`\`\`text
${list}
\`\`\`
`;
  for (const location of locations) await writeFile(new URL(`${p.key}.md`, location), body);
}
console.log(`Prepared ${result.problemTickets.length} draft tickets covering ${result.problemTickets.reduce((n, p) => n + p.count, 0)} reports once each.`);
