# Commander Tracker design implementation brief

This is a proposed sequence for implementing [DESIGN_SPEC.md](DESIGN_SPEC.md), not authorization to edit the app. Each phase needs an explicit approved ticket and authorization to replace `shipcheck.config.json` currentTask. Do not replace that task during an implementation loop or weaken its checks. No paid review budget is authorized by these documents.

The owner has selected the current layout as the desired design for now. Start with [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) and its references. Preserve those layout decisions while treating unselected feature and technical proposals as future ticket work.

Milestone IDs M1–M5 and progress are tracked in [the product roadmap](ROADMAP.md). This brief provides candidate ticket details; keep completion history in the roadmap and delivered behavior in [current functionality](FUNCTIONALITY.md).

## Reading order and decision precedence

Read root AGENTS.md, docs/SHIPCHECK.md, docs/DEVELOPER_LOOP.md, FUNCTIONALITY.md, ROADMAP.md, DESIGN_SPEC.md, DESIGN_INTERACTIONS.md, DESIGN_TOKENS.json, then the approved ticket. DESIGN_DISCOVERY.md preserves source observations and the original alternatives. The owner selected Obsidian Arena with stronger frame detailing, shared-device operation, four players by default, core support for two through twelve, eventual personal-phone access, extensible trackers, quick life interactions, and landscape-first configurable layouts. Carbon is an interaction reference, not a visual one. New UI interaction details are designer proposals until adopted into a ticket.

Preserve existing React and TypeScript conventions. Proposed component boundaries are flexible: TableMenu, PlayerFrame, CounterButton, PlayerRoster, SelectedPlayerEditor, and PlayerCountForm. A shared player model with stable IDs should underpin selection and later synchronization. Pure immutable counter operations simplify isolation tests; do not introduce a backend, state library, or network package for the visual work.

## Phase one Visual foundation

Candidate ticket: `obsidian-frames`. Restyle the existing two-player app with tokens, nameplates, layered borders, life wells, and a padded stacked-layers entry to a player-specific poison inspector. This is a staged presentation of the existing poison controls, not implementation of the generic tracker model. Preserve the two-player initial state, counter semantics, and accessible player/counter labels; add tests for opening and closing the inspector without changing values. Do not introduce setup, persistence, larger tables, or synchronization in this ticket.

Likely source: src/index.css, src/App.tsx, src/LifeTracker.tsx; add a stylesheet or components only where useful. App.css is currently unimported template CSS; do not assume editing it changes the app. Update markup-sensitive test selectors if necessary while preserving behavioral assertions. Do not alter poison thresholds or life semantics.

| ID | Acceptance criterion | Verification |
| --- | --- | --- |
| V1 | Both players start at 40 life and zero poison; life can become negative; poison cannot become negative | Existing complete behavioral suite plus relevant assertions after markup changes |
| V2 | Both frames contain a bronze outer rail, separate nameplate, inset life well, and padded icon entry to the existing poison controls | Browser comparison with frame anatomy in DESIGN_SPEC |
| V3 | Every increment and decrement changes only its identified player and counter by one | Rendered interaction tests covering both players |
| V4 | Targets are at least 48 by 48 CSS pixels; sign and player labels remain legible at 320px width and 200% text size | Browser geometry measurement and visual inspection |
| V5 | Text and essential control boundaries meet specified contrast; focus remains visible in keyboard and forced-colors use | Check actual rendered color pairs plus manual keyboard and forced-colors pass |

## Phase two Local expandable tables

Candidate ticket: `local-table-size`. Introduce new-table count selection, default four, core range two through twelve, stable IDs, and configurable pass-around/tabletop/focus layouts. Implement stable paging for larger tables. Explicit life buttons may precede quick zones, which are covered in phase four. Count entry above twelve is a proposed extension to confirm in this ticket. This is a behavioral change beyond a styling ticket. Include the screen contracts in DESIGN_SPEC and DESIGN_INTERACTIONS as requirements, not a vague link to a picture.

Likely source: LifeTracker and its state/model; setup and roster components; component tests and pure state tests. Keep new-game initialization explicit and separate from selecting a player or reflowing the layout. Player removal, rename, reset, and saved games are non-goals unless separately approved.

| ID | Acceptance criterion | Verification |
| --- | --- | --- |
| T1 | First-use setup defaults to four; starting with 2, 4, 8, or 12 creates exactly that many unique players at 40/0 | Parameterized setup/component tests |
| T2 | Empty, fractional, non-finite, unsafe integer, and values below two are rejected before player allocation with accessible inline errors | Input validation tests and error announcement check |
| T3 | In Focus/portrait, selecting a roster button changes only the editor selection; values and seat order do not change | Component tests across first, middle, and last players |
| T4 | Editing a selected player's life or poison updates that summary and no other player's state | Interaction tests including Player 12 and repeated zero decrements |
| T5 | In Focus/portrait, selected status includes text and aria-pressed; selecting does not move keyboard focus; explicit Adjust link returns to an offscreen editor | Keyboard/browser and screen reader scenarios |
| T6 | Feasible landscape uses a directly editable board; portrait and Focus use an editor/roster; twelve players retain stable page/seat groups | Browser checks at 844×390, 736×360, 390×844, 320×568, 1024×768 and 1440×900 |
| T7 | Resizing, orientation change, and selection changes preserve player identity, values, and order | Browser interaction checks with a twelve-player fixture |
| T8 | If extension above twelve is approved, 16 and 24 create all requested players and preserve usable scrolling; no silent clamp to twelve | Setup and browser scenarios; record device and performance observations |

Do not turn a large-count allocation concern into an invented permanent product maximum. Agree a technical safeguard with the owner if needed. The product preference allows larger tables; actual performance and final overflow copy remain to be validated.

## Phase three Generic tracking

Candidate ticket: `extensible-trackers`. Introduce definition-driven player and table counts plus specific commander-to-recipient damage relationships. Include template creation, custom count naming, bounds, scope validation, stable IDs, and the reusable numeric editor. Preserve poison behavior and life semantics. Adding a custom count must not require a source edit. Do not replace relationship identity with one aggregate per player.

Adopt G1–G4 in DESIGN_INTERACTIONS as explicit ticket criteria. Test multiple commander entities for one owner against multiple recipients; custom negative-enabled counts; hiding and reopening values without resetting; template versions; plain-text rendering of user labels; and isolation of every instance. Confirm the conservative damage-only default before introducing coupled life changes. Generic renderer flexibility does not authorize arbitrary scripted rules.

## Phase four Quick interaction and shared-device validation

Candidate ticket: `quick-life-zones`. Implement upper/lower native button zones with proper tap/scroll cancellation, exact signed-delta entry, local receipt-based undo inside Table menu, and optional disabled-by-default hold acceleration. Remove the title/layout/Undo toolbar; fit the circular app-icon menu in the local rounded-corner pocket, with no reserved horizontal band. Adopt I1–I4, L1–L3, M1–M2 and M4 in DESIGN_INTERACTIONS. Prove there is only one mutation path per action, including touch-generated clicks, and no edits from opening trackers or changing layouts. If hold is deferred, state that explicitly rather than showing an inert setting.

Optional follow-up ticket: `shake-undo`. Implement opt-in motion recognition, permission/capability states and contextual confirmation under M3. Tune on real phones and verify ordinary passing does not undo or spam prompts. Keep touch and keyboard Undo in the menu. Motion permission is not requested by this design phase; no sensor implementation is part of the reference HTML.

Validate direct four-player use on a passed landscape phone, two-up fallback on short displays, and twelve-player paging. Record actual task errors and friction. Optional later work includes approved in-session Add player behavior; decide removal policy before destructive management. No feature should imply reload recovery until persistence is explicitly specified and implemented.

| ID | Acceptance criterion | Verification |
| --- | --- | --- |
| U1 | A player can identify the right seat, change life, and change poison on a passed phone without confusing selection with turn order | Observed task walkthrough; record errors and navigation friction without inventing numeric success claims |
| U2 | Life cases 0, -1, -99, 100, -999, 10000 fit without truncation or reduced target size | Browser fixtures at narrow width and enlarged text |
| U3 | Keyboard, screen reader, reduced motion, text spacing, forced colors, iOS Safari and Android Chrome scenarios are recorded | Manual checklist with device/browser versions and unresolved failures |
| U4 | If Add player is approved, it preserves existing player IDs, counts and selection and creates a distinct 40/0 player | Pure state and rendered component tests |

## Phase five Connected personal phones

This phase needs a separate product and technical brief. Resolve join method, identity, edit permissions, persistence, reconnect, concurrent edits, and ownership before implementation. Do not select a paid backend or authentication provider through this visual specification.

Candidate acceptance scenarios after those choices: two phones increment the same counter without losing either update; retries do not duplicate an adjustment; unauthorized edits are rejected visibly; reconnect preserves the authoritative table; pending edits are distinguished from synchronized values; opening on a second phone preserves the same seat identities. These scenarios are planning inputs, not a complete network contract.

## Completion gate for each approved code ticket

Follow the repository's bounded loop: at most five cycles, thirty minutes, and stop after two comparable cycles without progress or at an earlier documented stopping condition. Record baseline identities and scope. Run `shipcheck audit . --run-checks --json`, inspect the report to confirm lint, application types, configuration types, and complete behavior checks actually ran. Run `npm run test:integration` to produce a fresh build and check the manifest artifacts. Add the design-specific browser/manual checks; deterministic checks cannot verify the visual design.

Only an explicitly authorized existing named API allowance permits a live final AI task review. Run that review after source edits are finished and investigate claims. Without authorization, report AI review pending. Do not claim full readiness from a zero exit code or from a design preview. Never push, merge, publish, or expand spending through this brief.

## Design validation status

This delivery changes documentation and design references only. The current four- and six-player references use the selected central menu, padded tracker icons, fixed inward nameplates, and content-only Tabletop rotation. Earlier whole-frame rotation and reserved-strip arrangements are superseded.

Recorded local preview checks covered player-specific life changes, independent commander relationships, generic numeric rows, menu undo receipts, focus return, and presentation changes without value resets. The latest spacing/orientation checks measured 48px tracker targets with 4px clearance in 56px nameplates, fixed section positions between modes, and a top-row increment affecting only its player. The six-player reference was restored to normal Pass-around presentation. These preview observations do not establish production behavior.

Solid-color contrast calculations cover selected palette pairs, not all states. Twelve-player paging, exact entry, hold recognition, production dialog behavior, motion recognition, persistence, synchronized play, enlarged text, assistive technology, physical reach, glare, and large-table performance still require implementation or validation. No real-device usability claim is made.

Application lint, types, behavioral tests, build, artifact integration, and live AI review were not run for this documentation-only update. No paid review is authorized. The application completion gate above remains unchanged.
