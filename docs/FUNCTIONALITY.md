# Commander Tracker current functionality

Updated October 16, 2026. This document records application behavior currently present in the repository. Intended features, open decisions, and milestone progress belong in [the product roadmap](ROADMAP.md). The [design references](DESIGN_DECISIONS.md) are demonstrations, not implemented feature evidence.

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
It retains the existing board layout with normal scrolling for larger tables.
There is no in-session add/remove/rename/reset flow, configurable layout menu,
paging, portrait roster, generic tracking, commander damage, undo, motion
interaction, persistence, or synchronized play. M2 remains in progress; inspect
`audit-reports/m2-table-setup/` for current verification rather than inferring
completion from these implementation notes.

## Maintaining this baseline

Update this document when an authorized ticket delivers verified behavior. Describe only the delivered portion, link its evidence from the roadmap completion log, and leave unfinished scope in the roadmap. A visual selection or prototype interaction does not change application status.

The current `shipcheck.config.json` ticket is `table-setup-identities`. Follow [the developer loop](DEVELOPER_LOOP.md) and [Shipcheck requirements](SHIPCHECK.md) for implementation and verification; this documentation change does not satisfy an application completion gate.
