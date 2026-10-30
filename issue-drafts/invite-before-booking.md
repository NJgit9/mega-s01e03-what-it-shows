# [4471/invite-before-booking] Invite reportedly arrives before its booking is created — 1 report

## Scope

**Report count: 1 unique report.** 1 tenant. Received 2026-04-20 through 2026-04-20.

Triage basis: **Investigation**. This is a reported problem requiring investigation, not a confirmed root cause.

Source: the course-supplied October 4, 2026 KB export, archive SHA-256 `267efc5ea61aca6efaaca842160ac4d0377d56bcbf5123e61c604d6ae99597f2`. #4471 is a source-desk identifier, not this GitHub issue number. Deduplicate the 427 rows by report ID, then select the 412 merged into #4471.

## Evidence

The invite arrived before I made the booking. I would like to know how.

## Action and verification

Correlate booking creation, queue enqueue/send and delivery timestamps with event IDs and clock offsets. Check whether the invite belongs to another event or a replay. Preserve the reported ordering anomaly without claiming its cause.

## Engineering disposition

The [course engineering update](https://hq.mega.dev/challenges/what-it-shows#engineering-update), observed 2026-10-30, reports #4471 closed 05 oct.

The update gives no per-report resolution for this investigation. Keep it OPEN pending evidence; closing source ticket #4471 does not establish that this reported symptom is resolved.

## Triage boundaries

The supplied classifier produces 379 parser and 33 hint reports. Review moved five contradictory symptom reports out of the parser ticket into five separate investigations. The ticket counts now partition the 412 unique report IDs exactly once: 374 parser candidates, 33 hint reports, and five single-report investigations. These investigations may later merge if evidence establishes the same cause; distinct symptoms alone do not prove distinct root causes.

Matching subjects, browser locales and intake tags do not establish a cause. Receipt timestamps and merge timestamps describe different events. The export has no product field, product source or booking logs: do not infer affected-user totals, shipped fixes, or confirmed production causes.

## Included report IDs

```text
R-41236
```
