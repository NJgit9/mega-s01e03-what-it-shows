# [4471/cross-timezone-date] The same meeting shows different days in Lisbon and Toronto — 1 report

## Scope

**Report count: 1 unique report.** 1 tenant. Received 2026-06-12 through 2026-06-12.

Triage basis: **Investigation**. This is a reported problem requiring investigation, not a confirmed root cause.

Source: the course-supplied October 4, 2026 KB export, archive SHA-256 `267efc5ea61aca6efaaca842160ac4d0377d56bcbf5123e61c604d6ae99597f2`. #4471 is a source-desk identifier, not this GitHub issue number. Deduplicate the 427 rows by report ID, then select the 412 merged into #4471.

## Evidence

Client in Lisbon got Tuesday. Client in Toronto got Monday. Same meeting. We held it twice.

## Action and verification

Compare both invites, UTC instant, local timezones and any all-day/date-only fields. Determine whether both local dates correctly represent one instant or whether scheduling semantics are wrong. Different local dates alone do not prove a software defect.

## Triage boundaries

The supplied classifier produces 379 parser and 33 hint reports. Review moved five contradictory symptom reports out of the parser ticket into five separate investigations. The ticket counts now partition the 412 unique report IDs exactly once: 374 parser candidates, 33 hint reports, and five single-report investigations. These investigations may later merge if evidence establishes the same cause; distinct symptoms alone do not prove distinct root causes.

Matching subjects, browser locales and intake tags do not establish a cause. Receipt timestamps and merge timestamps describe different events. The export has no product field, product source or booking logs: do not infer affected-user totals, shipped fixes, or confirmed production causes.

## Included report IDs

```text
R-41344
```
