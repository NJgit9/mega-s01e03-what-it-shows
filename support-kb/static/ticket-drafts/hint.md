# [4471/hint] booking-v3 date hint disagrees with date interpretation — 33 reports

## Scope

**Report count: 33 unique reports.** 3 tenants. Received 2026-04-17 through 2026-09-22.

Triage basis: **Supplied cause model**. This is a cause described by the supplied KB model, pending production reproduction.

Source: the course-supplied October 4, 2026 KB export, archive SHA-256 `267efc5ea61aca6efaaca842160ac4d0377d56bcbf5123e61c604d6ae99597f2`. #4471 is a source-desk identifier, not this GitHub issue number. Deduplicate the 427 rows by report ID, then select the 412 merged into #4471.

## Evidence

R-41230: a Copper Studio form booking for 6 January became 1 June. Alder Physio, Copper Studio and Pale Harbour use booking-v3 in day-first locales.

## Action and verification

Generate the form hint and input interpretation from the same tenant locale. Verify all three affected tenants; include v2, app/email and month-first controls. A shared-parser fix alone does not resolve the hint mismatch.

## Engineering disposition

The [course engineering update](https://hq.mega.dev/challenges/what-it-shows#engineering-update), observed 2026-10-30, reports #4471 closed 05 oct.

Reported WON'T FIX: booking-v3 form retired. Close as not planned, preserving retirement as the disposition; do not describe the form as repaired.

## Triage boundaries

The supplied classifier produces 379 parser and 33 hint reports. Review moved five contradictory symptom reports out of the parser ticket into five separate investigations. The ticket counts now partition the 412 unique report IDs exactly once: 374 parser candidates, 33 hint reports, and five single-report investigations. These investigations may later merge if evidence establishes the same cause; distinct symptoms alone do not prove distinct root causes.

Matching subjects, browser locales and intake tags do not establish a cause. Receipt timestamps and merge timestamps describe different events. The export has no product field, product source or booking logs: do not infer affected-user totals, shipped fixes, or confirmed production causes.

## Included report IDs

```text
R-41230 R-41241 R-41251 R-41259 R-41262 R-41275 R-41294 R-41305
R-41308 R-41366 R-41372 R-41384 R-41387 R-41396 R-41400 R-41406
R-41415 R-41416 R-41418 R-41428 R-41439 R-41441 R-41449 R-41453
R-41456 R-41460 R-41472 R-41485 R-41493 R-41539 R-41572 R-41582
R-41584
```
