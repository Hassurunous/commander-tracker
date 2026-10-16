# Commander Tracker current functionality

Updated October 16, 2026. This document records application behavior currently present in the repository. Intended features, open decisions, and milestone progress belong in [the product roadmap](ROADMAP.md). The [design references](DESIGN_DECISIONS.md) are demonstrations, not implemented feature evidence.

## Implemented today

| Area | Actual application behavior |
| --- | --- |
| Players | Two fixed entries, Player 1 and Player 2 |
| Life | Starts at 40; explicit +1 and -1 controls; negative values permitted |
| Poison | Starts at zero; player-specific modal inspector with +1 and -1 controls; decrement at zero is a no-op |
| Isolation | Adjustments affect the identified player's selected value |
| Storage | In-memory state; no game recovery after reload |
| PWA | Build configuration and assets exist; offline reliability and browser installability are not established |

The local `obsidian-frames` implementation adds shared bronze player frames, nameplates, life wells and tracker entries. Its completion evidence is recorded under ignored `audit-reports/obsidian-frames/`; live AI and physical-device validation remain pending.

There is no application setup flow, player management, generic tracking, commander damage, layout menu, undo, motion interaction, persistence, or synchronized play. These observations follow `src/LifeTracker.tsx` and `src/poison.ts`; design references are separate artifacts.

## Maintaining this baseline

Update this document when an authorized ticket delivers verified behavior. Describe only the delivered portion, link its evidence from the roadmap completion log, and leave unfinished scope in the roadmap. A visual selection or prototype interaction does not change application status.

The current `shipcheck.config.json` ticket is `obsidian-frames`. Follow [the developer loop](DEVELOPER_LOOP.md) and [Shipcheck requirements](SHIPCHECK.md) for implementation and verification; this documentation change does not satisfy an application completion gate.
