import { causeOf, type Report, type Tenant } from './causes.ts';

// Human-requested triage review, separate from the unmodified export classifier.
// These are investigation boundaries, not claims of five proven additional root causes.
export const PROBLEMS = [
  {
    key: 'parser', title: 'Day-first input is interpreted month-first',
    kind: 'Supplied cause model', ids: [],
    evidence: 'R-41200: 7 April became 4 July; R-41201 describes the reverse direction.',
    next: 'Reproduce the shared-parser path; preserve the tenant-intended day, month and year through invite generation. Check ambiguous dates both ways, unambiguous dates and month-first controls. The five contradictory symptom reports have separate investigation tickets.'
  },
  {
    key: 'hint', title: 'booking-v3 date hint disagrees with date interpretation',
    kind: 'Supplied cause model', ids: [],
    evidence: 'R-41230: a Copper Studio form booking for 6 January became 1 June. Alder Physio, Copper Studio and Pale Harbour use booking-v3 in day-first locales.',
    next: 'Generate the form hint and input interpretation from the same tenant locale. Verify all three affected tenants; include v2, app/email and month-first controls. A shared-parser fix alone does not resolve the hint mismatch.'
  },
  {
    key: 'invite-calendar-date', title: 'Invite date and calendar date differ by one day',
    kind: 'Investigation', ids: ['R-41202'],
    evidence: 'Invite says Tuesday 12 May. Calendar says Monday 11 May. My client turned up on the Monday. We had coffee.',
    next: 'Compare the booking record, invite payload and calendar import for the same event. Establish which date was intended and where a one-day change occurs. Do not count this as a confirmed month/day transposition.'
  },
  {
    key: 'june-one-day', title: 'Bookings in June are reported one day off',
    kind: 'Investigation', ids: ['R-41209'],
    evidence: 'Every booking in June is one day off. Only June. Why only June.',
    next: 'Collect representative June bookings and adjacent-month controls, with year, local timezone, stored timestamp and displayed date. Investigate the month-specific boundary; do not infer a parser or daylight-saving cause without reproduction.'
  },
  {
    key: 'invite-before-booking', title: 'Invite reportedly arrives before its booking is created',
    kind: 'Investigation', ids: ['R-41236'],
    evidence: 'The invite arrived before I made the booking. I would like to know how.',
    next: 'Correlate booking creation, queue enqueue/send and delivery timestamps with event IDs and clock offsets. Check whether the invite belongs to another event or a replay. Preserve the reported ordering anomaly without claiming its cause.'
  },
  {
    key: 'cross-timezone-date', title: 'The same meeting shows different days in Lisbon and Toronto',
    kind: 'Investigation', ids: ['R-41344'],
    evidence: 'Client in Lisbon got Tuesday. Client in Toronto got Monday. Same meeting. We held it twice.',
    next: 'Compare both invites, UTC instant, local timezones and any all-day/date-only fields. Determine whether both local dates correctly represent one instant or whether scheduling semantics are wrong. Different local dates alone do not prove a software defect.'
  },
  {
    key: 'weekday-display', title: 'Tuesday 6 October is displayed as Monday',
    kind: 'Investigation', ids: ['R-41620'],
    evidence: 'Tuesday 6 October showed as Monday. I moved it myself. I have stopped reporting these but my colleague says it helps you.',
    next: 'Retrieve the original booking and rendered invite, including date, year, timezone and weekday label. Distinguish a wrong weekday label from a shifted stored date. Keep this separate until evidence links it to another investigation.'
  }
] as const;

export function reviewProblems(reports: Report[], tenantOf: (r: Report) => Tenant | undefined) {
  const flagged = new Map(PROBLEMS.flatMap((p) => [...p.ids].map((id) => [id, p.key] as const)));
  const assigned = new Map<string, Report[]>();
  for (const r of reports) {
    const key = flagged.get(r.id) ?? causeOf(r, tenantOf(r)) ?? 'unplaced';
    const rows = assigned.get(key) ?? [];
    rows.push(r);
    assigned.set(key, rows);
  }
  const definitions = [...PROBLEMS, { key: 'unplaced', title: 'Reports requiring tenant/cause lookup', kind: 'Investigation', ids: [], evidence: 'No cause established by the supplied lookup.', next: 'Resolve missing evidence before merging.' }];
  return definitions.flatMap((p) => {
    const rows = assigned.get(p.key) ?? [];
    if (!rows.length) return [];
    const dates = rows.map((r) => r.receivedAt.slice(0, 10)).sort();
    return [{ ...p, reports: rows, count: rows.length, tenants: new Set(rows.map((r) => r.tenant)).size, firstSeen: dates[0], lastSeen: dates.at(-1)! }];
  });
}
