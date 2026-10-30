# S01E03 — what it shows

The course accepted the tickets and signed KB page on October 30, 2026.
[Course debrief](https://hq.mega.dev/challenges/what-it-shows#debrief).

The task was to split support ticket #4471 into actionable problems with report counts and
add a page the desk could trust. The export contained 427 rows but only 412 distinct report IDs.
The supplied classifier produced 379 parser and 33 hint reports. Nick questioned the two-draft
result and required one ticket per problem, so five contradictory symptoms gained separate
investigations: 374 parser candidates, 33 hint reports, and five single-report investigations.
The extra investigations do not establish five additional root causes.

## What the questions showed

- **The rendered view:** Codex ran the code and inspected the actual Svelte-rendered page in an isolated Playwright browser. The visible table and chart were checked, rather than relying on prose or calculations alone. Nick questioned the grouping while reviewing the page; no independent user verification is claimed.
- **The desk's update:** After the first accepted ticket submission, Codex revisited the Challenge page because the desk said work continued. That re-fetch exposed the engineering update before the next submission: parser fixed; hint won't fix because booking-v3 was retired.
- **Rendering the kb:** The exercise retains pinned rendering dependencies, the complete static output, and an isolated browser check. Rebuild from `support-kb/` with `npm run export`, then use `npm run preview`.
- **Tickets from the terminal:** The existing signed-in GitHub CLI created all seven issues. It closed parser #1 as completed and hint #2 as not planned; #3–#7 remain open. The ticket-text generator is reusable; the one-off issue creation/closure commands were not packaged as a reusable script.
- **Claims with a source:** Report IDs, tenant files, executable classification, original-file hashes, rendered output, course engineering statements and verified GitHub issue states support the claims. Source engineering outcomes are distinct from independent production tests.

## Snags and decisions

Codex initially left five reports in a parser footnote. Nick's requirement gave each unmatched
problem an actionable investigation; that was the decision that changed the ticket inventory.

The course then rejected the page signature: Codex had used author text. Codex retrieved the
course-issued page signature, inserted it exactly in frontmatter, rebuilt the derived desk
stamp, and resubmitted successfully. The course signature is a required public page marker;
OAuth credentials and ignored session evidence are not included in this repository.

## Preserved capabilities and limits

The project gained a KB renderer, report reconciliation, generated issue text, signed review
page, static export, source manifest and browser verification. The signed-in course browser
and GitHub CLI were already available. All 30 original export files remain unchanged.

Next time, inspect the rendered page and contradictory report bodies before accepting a
computed grouping. Revisit the owning source before closing tickets because later outcomes
can differ. The course accepted the Challenge artifact; five investigations still require
evidence, and no product source, deployed fix or production verification was supplied here.
