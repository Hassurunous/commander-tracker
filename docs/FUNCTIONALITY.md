# Commander Tracker current functionality

Updated October 18, 2026. This document records application behavior currently present in the repository. Intended features, open decisions, and milestone progress belong in [the product roadmap](ROADMAP.md). The [design references](DESIGN_DECISIONS.md) are demonstrations, not implemented feature evidence.

## Implemented today

| Area | Actual application behavior |
| --- | --- |
| Players | First-use setup defaults to four; start with 2–12 players, uniquely identified and seated in order |
| Life | Starts at 40; explicit +1 and -1 controls; negative values permitted |
| Poison | Starts at zero; player-specific modal inspector with +1 and -1 controls; decrement at zero is a no-op |
| Isolation | Adjustments affect the identified player's selected value |
| Storage | In-memory state; no game recovery after reload |
| PWA | Build configuration and assets exist; offline reliability and browser installability are not established |

The Obsidian foundation is merged in PR #6 (`3ecf7e4`, merge `4016f81`): shared
bronze frames, nameplates, life wells and modal tracker entries. Codex review,
rendered browser checks and a whole-codebase baseline have run; AI review is no
longer pending for that delivery. Physical-phone and screen-reader validation
remain unverified. The baseline is not a substitute for formal milestone closure.

The local `table-setup-identities` ticket adds the count form and stable IDs.
That first ticket is merged in PR #8. The local `responsive-board-focus` ticket now adds a space-aware two-/four-seat board with paging, or a selected editor and full roster in Focus. A modal Table menu exposes Pass-around/Focus and Auto/2/4 preferences, retained through automatic fallbacks.
There is no in-session add/remove/rename/reset flow, six-up presentation, generic tracking, commander damage, undo, motion
interaction, persistence, or synchronized play. M2 remains in progress; inspect
`audit-reports/m2-responsive/` for current verification rather than inferring
completion from these implementation notes.

The responsive ticket passed the four offline checks (71 behavioral tests), 18
browser tests, production build/artifact integration, and Storybook build. Codex
review could not start because Shipcheck reported `spawn EPERM`; AI review and
the completion gate remain pending. The temporary AI context limit was restored.

The local `tabletop-mode` extension adds Tabletop to the same menu. Four-seat
pages rotate the upper two panels 180 degrees; two-seat pages stack vertically
with the upper panel rotated. Controls face their seated player, while modal
inspectors and the table menu remain upright. Narrow/short displays use upright
Focus and retain the Tabletop preference. Validation is recorded under
`audit-reports/m2-tabletop/`; this extension does not close M2.
The Tabletop completion gate passed on October 18: all four Shipcheck checks,
73 behavioral tests, 21 browser tests, fresh production/artifact integration and
Storybook build. Codex returned fresh matched supporting evidence for all four
Tabletop requirements and no general candidates. The earlier responsive ticket
has not received a separate final requirements review.

Responsive review resumed on October 18 for draft PR #9. All four offline
checks (73 behavioral tests), 21 browser tests, fresh build/artifact integration
and Storybook build passed. The first resumed Codex run raised no code concerns;
five requirements had matched supporting evidence, while the library/tests
assessment was downgraded because its Storybook quotation did not match the
valid source. Fresh browser/Storybook execution evidence was added to
[the verification record](OBSIDIAN_VALIDATION.md). The next Codex run failed
with `invalid-task-assessment` (not exactly one assessment per requirement).
The loop stopped as required; responsive completion remains blocked. See
`audit-reports/m2-responsive-resume/`. No application edits were needed, and the
temporary context limit was restored to 64,000.

An additional authorized review (cycle five) completed with exactly six valid
assessment IDs, so the previous response-format error did not recur. Codex raised
no code concerns and proposed supporting evidence for all six requirements.
Five retained matched supporting evidence; library/tests was downgraded because
the AI over-escaped a regex in its browser-test quotation. The actual source is
unchanged and the recorded browser suite passed. The five-cycle limit is now
reached; PR #9 remains a draft pending a valid matched assessment or explicit
owner acceptance. Fresh offline checks (73 tests) and production/artifact
integration passed again. The context limit is restored to 64,000. Investigation
and reports: `audit-reports/m2-responsive-cycle5/`.

The owner requested another review after Shipcheck update `3edc8c6` removed
redundant Codex context escaping. That run completed with no code concerns and
five fresh matched supporting assessments. Library/tests was still downgraded:
Codex omitted the outer closing brace when quoting the valid `TabletopTwo`
Storybook example. This is a different quotation error, not a regex mismatch.
All four offline checks and fresh production/artifact integration passed again.
PR #9 remains a draft; the exact pre-review 64,000-byte limit was restored.
Reports: `audit-reports/m2-responsive-updated-shipcheck/`.

The next owner-authorized rerun used Shipcheck's structured evidence selection
update. All selected citations matched, and library/tests now has supporting
evidence: the quotation blocker is resolved. Five requirements were supported;
the board requirement was assessed as insufficient evidence for guarantees
across sizing, targets and text scaling. No code defect was reported. The full
21-test browser suite passed again; it explicitly checks four-up 844×390 geometry
and narrow enlarged-text controls, but does not explicitly measure full-app
enlarged landscape geometry. This assessment remains unresolved, so PR #9 stays
a draft. All four offline checks and fresh production/artifact integration
passed. The original 64,000-byte limit is restored. Reports:
`audit-reports/m2-responsive-evidence-selection/`.

The board coverage follow-up resolves the remaining review gap. Twelve browser
matrix tests measure 60 combinations of 2/4/6/12 players, 100%/150%/200% text and
five viewport sizes; a separate live text-resize regression found and verified a
fix for missing fit recalculations when root font size changes without a window
resize. A hidden rem-sized probe now triggers remeasurement and is cleaned up
on unmount. The full 34-test browser suite, all four offline checks (73 behavioral
tests), fresh production/artifact integration and Storybook build passed.
Final Codex review supports all six responsive requirements with fresh matched
evidence and no code concerns. PR #9 is ready for human review. The owner-approved
temporary 128,000-byte review context was restored to 64,000; file-count limits
and thresholds are unchanged. Reports: `audit-reports/m2-board-coverage/`.
This supersedes the earlier responsive review blockers above and does not claim
physical-device or screen-reader validation or full M2 closure.

## Maintaining this baseline

Update this document when an authorized ticket delivers verified behavior. Describe only the delivered portion, link its evidence from the roadmap completion log, and leave unfinished scope in the roadmap. A visual selection or prototype interaction does not change application status.

The current `shipcheck.config.json` ticket is `responsive-board-focus`. Follow [the developer loop](DEVELOPER_LOOP.md) and [Shipcheck requirements](SHIPCHECK.md) for implementation and verification; this documentation change does not satisfy an application completion gate.
