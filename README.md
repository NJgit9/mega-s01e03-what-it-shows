# What it shows — support ticket #4471

Challenge: [MEGA.dev S01E03](https://hq.mega.dev/challenges/what-it-shows).

This exercise preserves the supplied support KB, adds a signed review page, and files one
ticket for each distinguishable problem. No product code or fix is included.

## Review the deliverables

- [Signed review source](support-kb/src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered desk view](rendered/kb/incidents/4471-review/index.html)
- [Parser issue #1: 374 candidate reports](https://github.com/NJgit9/mega-s01e03-what-it-shows/issues/1)
- [Form-hint issue #2: 33 reports](https://github.com/NJgit9/mega-s01e03-what-it-shows/issues/2)
- [Invite/calendar one-day discrepancy: 1 report](https://github.com/NJgit9/mega-s01e03-what-it-shows/issues/3)
- [June-only one-day discrepancy: 1 report](https://github.com/NJgit9/mega-s01e03-what-it-shows/issues/4)
- [Invite before booking creation: 1 report](https://github.com/NJgit9/mega-s01e03-what-it-shows/issues/5)
- [Lisbon/Toronto date discrepancy: 1 report](https://github.com/NJgit9/mega-s01e03-what-it-shows/issues/6)
- [Wrong weekday display: 1 report](https://github.com/NJgit9/mega-s01e03-what-it-shows/issues/7)
- [Reconciliation and complete report-ID partition](evidence/analysis.json)
- [Source provenance and original-file hashes](evidence/source-manifest.json)

The snapshot contains 427 rows, including 15 exact duplicate rows, for 412 distinct report IDs.
The supplied code assigns 379 to parser and 33 to hint. Intake tags disagree for 38 reports.
That model is not a complete ticket inventory: it puts five contradictory symptoms inside
parser. The reviewed ticket partition removes those five and gives each its own investigation,
leaving 374 parser candidates and 33 hint reports. Do not merge the investigations until
evidence establishes a shared cause. Seven investigation boundaries do not establish seven proven root causes.
The accepted historical decision and all original export files are unchanged.

## Run locally

Use Node 24 or newer. From `support-kb/`:

```sh
npm ci --ignore-scripts
npm run analyze
npm run tickets
npm test
npm run export
npm run preview
```

Open `http://127.0.0.1:4173/kb/incidents/4471-review/`. Expected: the 427 − 15 = 412
reconciliation, seven GitHub issue links with counts 374/33/1/1/1/1/1, five deduplication examples,
separate receipt/merge timeline, and a generated author stamp. The links open the filed
GitHub issues. The Markdown files in `issue-drafts/` retain their submitted text. Change the explorer's tenant and channel to compare
same-subject reports with different causes. The added review appears on `/kb/`.

`npm run export` writes `rendered/`, the complete static site requested by the course. Serve
that folder as a web root to retain route links and interactive components. It is deliberately
versioned as a Challenge deliverable; installed dependencies, build internals, logs and test
screenshots remain ignored. The renderer uses pinned Svelte/SvelteKit, mdsvex and Vite packages;
see `support-kb/package-lock.json`.

`npm run test:browser` uses Playwright in a new headless browser process and fresh context.
It never attaches to a personal browser profile. A compatible installed Chromium is required;
an existing binary can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Evidence and limits

The input archive is `kb-export-267efc5e.zip`, SHA-256
`267efc5ea61aca6efaaca842160ac4d0377d56bcbf5123e61c604d6ae99597f2`.
The user supplied it from the Challenge download. The export says October 4, 2026; review
date is October 30, 2026. The original source describes a fictional support desk in the course
story. Its directory covers multiple products, and report records contain no product field.

The script runs the supplied cause functions against the tenant directory, then applies the
explicit symptom-based investigation assignments in `support-kb/src/lib/kb/review-problems.ts`.
It retains exact input hashes, report IDs, contradictory intake tags, flagged wording and time
scopes. An independent reconciliation of the original model by tenant form/channel found
379/33; this is preserved separately from the reviewed ticket partition. The tests check
distinct-ID grain, conflicting duplicate IDs, complete tenant joins, disjoint group membership,
cause boundaries, the separate-investigation assignments and unknown-tenant behavior. The browser check exercises the rendered
components, author stamp, stale historical decision warning, navigation and interactive
deduplication examples and all seven issue links. The original classifier/explorer remain
available as historical model evidence and are not described as a complete ticket inventory.

These are report counts under the KB's classifier, not affected-user totals or independent
production reproductions. Course acceptance does not establish that a product fix shipped.
The user approved public publication and all seven issues on October 30, 2026.
Public repository: [NJgit9/mega-s01e03-what-it-shows](https://github.com/NJgit9/mega-s01e03-what-it-shows).
`evidence/github-issues.json` records the issue numbers, URLs, counts and submitted-body hashes.
