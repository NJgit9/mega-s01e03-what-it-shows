# [4471/weekday-display] Tuesday 6 October is displayed as Monday — 1 report

## Scope

**Report count: 1 unique report.** 1 tenant. Received 2026-10-04 through 2026-10-04.

Triage basis: **Investigation**. This is a reported problem requiring investigation, not a confirmed root cause.

Source: the course-supplied October 4, 2026 KB export, archive SHA-256 `267efc5ea61aca6efaaca842160ac4d0377d56bcbf5123e61c604d6ae99597f2`. #4471 is a source-desk identifier, not this GitHub issue number. Deduplicate the 427 rows by report ID, then select the 412 merged into #4471.

## Evidence

Tuesday 6 October showed as Monday. I moved it myself. I have stopped reporting these but my colleague says it helps you.

## Action and verification

Retrieve the original booking and rendered invite, including date, year, timezone and weekday label. Distinguish a wrong weekday label from a shifted stored date. Keep this separate until evidence links it to another investigation.

## Triage boundaries

The supplied classifier produces 379 parser and 33 hint reports. Review moved five contradictory symptom reports out of the parser ticket into five separate investigations. The ticket counts now partition the 412 unique report IDs exactly once: 374 parser candidates, 33 hint reports, and five single-report investigations. These investigations may later merge if evidence establishes the same cause; distinct symptoms alone do not prove distinct root causes.

Matching subjects, browser locales and intake tags do not establish a cause. Receipt timestamps and merge timestamps describe different events. The export has no product field, product source or booking logs: do not infer affected-user totals, shipped fixes, or confirmed production causes.

## Included report IDs

```text
R-41620
```
