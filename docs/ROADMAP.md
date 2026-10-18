# Commander Tracker product roadmap

Updated October 16, 2026. This is the home for intended functionality, open product decisions, and milestone progress. [Current functionality](FUNCTIONALITY.md) describes what the application actually provides. [Layout decisions](DESIGN_DECISIONS.md) and the design specifications describe the intended experience in detail.

## How to use this roadmap

The owner has selected the product and layout direction below. Milestone order and packaging are proposed; no delivery dates or implementation tickets are committed. A roadmap entry is not authorization to implement it, change audit requirements, or spend on reviews. Before beginning a ticket, reconcile its approved requirements and non-goals with `shipcheck.config.json`; the active ticket is `responsive-board-focus`.

Track implementation status separately from product decisions:

- **Planned:** intended outcome, implementation not started.
- **In progress:** an authorized ticket is underway; link that ticket and record remaining work.
- **Blocked:** record the specific unmet dependency or owner decision.
- **Complete:** implemented outcome verified against approved criteria, with evidence and completion date. Disclose any explicitly accepted limitations.
- **Deferred:** retained for consideration without a scheduled milestone.

A selected design is not a completed application milestone. Do not infer completion from a mockup, merged code alone, or an audit exit code.

## Milestone overview

| ID | Outcome | Implementation status | Dependency or decision |
| --- | --- | --- | --- |
| M1 | Obsidian visual foundation and accessible player controls | In progress | Foundation merged in PR #6; Codex review and browser checks passed. Physical-device/screen-reader validation or explicit acceptance remains outstanding. |
| M2 | Expandable local tables and configurable responsive layouts | In progress | Setup/stable IDs merged in PR #8. `responsive-board-focus` is implementing Pass-around, paging and Focus. Tabletop is being added in `tabletop-mode`; above-twelve safeguards remain deferred. |
| M3 | Generic counters and commander-to-recipient tracking | Planned | Tracker defaults, bounds, and damage/life coupling |
| M4 | Fast shared-device adjustments and accessible recovery | Planned | Gesture and undo decisions; real-device validation |
| M5 | Connected personal phones operating the same game | Planned | Separate networking, identity, permissions, and recovery brief |

These correspond to the candidate phases in [the implementation brief](DESIGN_IMPLEMENTATION.md). That brief supplies detailed candidate acceptance criteria and the unchanged repository completion gate. Accessibility, player isolation, and preservation of existing life/poison semantics apply throughout.

## Milestone completion criteria

### M1 Visual foundation

Deliver the selected frame language, readable life wells, padded tracker entry, and accessible controls in the application. The initial styling ticket may retain two players and existing poison behavior. Verify rendered contrast, target size, keyboard use, and narrow/enlarged-text layouts, plus the approved ticket's application checks. This stage does not imply the entire four- or six-player reference is implemented.

### M2 Expandable tables

Default setup to four players; support the core two-through-twelve range with stable identities and usable overflow. Preserve values and seat order during resize, paging, and layout changes. Verify normal and Tabletop content orientation without moving inward name/tracker sections. Test representative 2-, 4-, 6-, and 12-player cases. Agree safeguards and validation before claiming larger-table support.

### M3 Extensible tracking

Support reusable player counters, custom numeric definitions, and distinct source-commander/recipient relationships. Verify multiple commanders owned by one player, multiple recipients, and isolation of all values. Preserve poison's zero floor and negative life. Resolve damage/life coupling before implementing it. Table-wide counts and custom bounds remain proposed details to adopt explicitly.

### M4 Fast interaction and recovery

Deliver player-relative upper/lower life zones without accidental changes from tracker or menu controls. Provide an agreed accessible undo path within the central menu and verify correct adjustment identity. Validate on real passed phones, including cancellation, orientation, and accessibility. Exact entry, hold acceleration, and shake recognition are proposed additions to scope explicitly; a deferred optional gesture does not prevent completion of an agreed core ticket.

### M5 Connected phones

First agree joining, identity, edit permissions, ownership, persistence, and conflict/reconnect rules. Then verify two-device adjustments without lost or duplicate edits, visible synchronization states, and authorized editing. No backend, authentication service, or paid provider is selected. Offline game recovery needs an explicit contract; PWA assets do not satisfy it.

## Progress and completion log

| Date | Event | Evidence and limits |
| --- | --- | --- |
| 2026-10-16 | Obsidian Arena layout selected; design decision recorded | [Selected references](DESIGN_DECISIONS.md). Design checkpoint only; M1–M5 remain unimplemented. |
| 2026-10-16 | Roadmap established and current functionality separated | [Current baseline](FUNCTIONALITY.md). Documentation only; no application milestone completed. |

When a milestone completes, append a dated entry with its ID, delivered scope, ticket/PR or commit, check and device-validation evidence, and accepted limitations. Update its status above and move only delivered behavior into FUNCTIONALITY.md. Partial delivery remains in progress; record remaining criteria. Keep history rather than overwriting earlier completion entries. No milestone completion dates are assigned until supported by evidence.

## Current implementation tickets

- M1 foundation: [PR #6](https://github.com/Hassurunous/commander-tracker/pull/6),
  commit `3ecf7e4`, merged in `4016f81`. The earlier claim that AI review was
  pending is superseded: Codex task review returned proposed supporting evidence
  for all six criteria with matched quotations, and subsequent Shipcheck 699df25
  baseline review confirmed complete eligible-source and reference coverage.
  Thirteen behavioral and seven browser tests, production integration and
  Storybook build passed. Local evidence: `audit-reports/full-baseline-reconciled/`.
  That general baseline was not a fresh M1 task acceptance. Physical-device and
  screen-reader validation remains unverified; no full milestone closure claimed.
- M2 first ticket: `table-setup-identities` (authorized October 16, 2026).
  First-use count defaults to four; this ticket supports two through twelve,
  stable player IDs and ordered seats, and preserves counter semantics. A simple
  scrolling board is sufficient for this slice. Paging, Focus/portrait roster,
  Pass-around/Tabletop selection and wider-table behavior remain undelivered.
  Local implementation verified in two cycles: 65 behavioral/model tests, 12
  browser tests, fresh production integration and Storybook build passed. Final
  Codex task review supports all six criteria with matched evidence and no
  candidates. Aggregate diagnostic-summary coverage remains flagged partial;
  all selected source/reference paths have valid responses. See
  `audit-reports/m2-table-setup/` for reports. This delivers the first ticket
  locally; M2 stays in progress until the deferred responsive work is delivered.

## Responsive board ticket (October 18, 2026)

The first M2 ticket is merged in [PR #8](https://github.com/Hassurunous/commander-tracker/pull/8)
(merge `f07aa45`). Current work is `responsive-board-focus`: a two-/four-seat
upright board, stable contiguous paging, a Focus editor and roster, and a modal
Table menu exposing only Pass-around/Focus and Auto/2/4 preferences. Layout uses
available width/height and root text scaling, reserving space for page/menu
controls. Four-up is intended at 844×390 for four players; tables requiring page
controls may use two-up at that height and four-up on taller landscape displays.
Presentation changes retain player state and the group containing the anchor seat.
Tabletop rotation, six-up density, quick life zones and persistence remain separate.
Validation evidence is recorded under `audit-reports/m2-responsive/`; this ticket
does not claim physical-device or screen-reader validation or full M2 closure.
All four offline checks (71 behavioral tests), 18 browser tests, the fresh
production build/artifact test, and Storybook build passed. Shipcheck's Codex
review failed to start with `spawn EPERM` and produced no AI report. The loop
stopped on that operational failure; AI review and ticket completion remain
pending. The approved temporary 96,000-byte context limit was restored to 64,000.

Review resumed for draft PR #9 on October 18. All four offline checks, 73
behavioral tests, 21 browser tests, fresh build/artifact integration and Storybook
build passed. Codex initially supported five requirements with matched evidence
and proposed support for the sixth, but quoted Storybook incorrectly. Fresh
execution evidence was added to [the verification record](OBSIDIAN_VALIDATION.md).
The next run failed with `invalid-task-assessment` because the response did not
contain exactly one valid assessment per requirement. No code defect was
confirmed. The loop stopped on that execution failure; PR #9 remains a draft.
The active ticket is again `responsive-board-focus`, reconciled with the
separately-authorized Tabletop menu option. The context limit is restored to
64,000; no API calls were used. Reports: `audit-reports/m2-responsive-resume/`.

## Intended functionality and product decisions

The authorized `tabletop-mode` extension adds opposite-facing upper panels to
the responsive board: two rotated panels on four-seat pages, or one upper panel
on vertically stacked two-seat pages. Paging, player values and responsive Focus
fallback are preserved. Storybook includes two-seat, four-seat and paged examples.
See `audit-reports/m2-tabletop/` for this ticket's validation; earlier responsive
review status above is historical and is not a review of this extension.
Tabletop is ready for human review locally (October 18): all four offline checks,
73 behavioral tests, 21 browser tests, production/artifact integration and
Storybook build passed. Codex assessed all four Tabletop requirements with fresh
matched supporting evidence and no general candidates. No limits changed or API
calls were used. This does not close the earlier responsive ticket's separate
requirements review or M2.

**Selected direction** records owner preferences. **Proposed detail** awaits adoption into an approved ticket. **Unresolved** requires a product decision before dependent work. The sections below retain those distinctions; milestone placement does not approve every proposal.

## Selected direction for tables and devices

- Prioritize phones, then tablets, then desktop. Prefer landscape while retaining a usable portrait experience; do not require physical rotation.
- Optimize a shared phone or tablet passed around the table. Eventually allow players to access and operate the same game from their own phones.
- Default to four players. Design and validate the core range of two through twelve. The owner prefers accommodating larger tables; twelve is not an arbitrary permanent ceiling. Allocation safeguards and validated performance limits remain unresolved.
- Place layout selection inside the global menu, without a persistent dropdown.
- Preserve player identity, seat order, and values through presentation changes. A selected player does not imply whose turn it is.

Proposed details: count entry accepts whole numbers of at least two with accessible validation. Larger tables use stable pages or a roster rather than smaller targets. Portrait uses a focused editor and roster. Density breakpoints require device validation. In-session player addition is a possible later ticket; removal, reset, and recovery policies are unresolved.

## Selected board and orientation

Use Obsidian Arena: dark surfaces, layered bronze frame outlines, and visually dominant life totals. Carbon informs flexibility and ease of use, rather than visual imitation.

Cards fill the available board with narrow gaps. A circular app-icon menu occupies local negative space between cards without reserving a horizontal strip. Four players use a two-by-two reference. Six use three-by-two with a local recess between the middle pair. Six is a demonstration, not the default count.

The name and tracker sections stay near the central seam: at the bottom of top-row cards and the top of bottom-row cards. Their positions stay fixed through orientation changes.

| Mode | Content orientation | Card structure |
| --- | --- | --- |
| Normal / Pass-around, default reference | All names, values, icons, and action cues face the same direction | Name/tracker sections remain inward |
| Optional Tabletop | Top-row content faces the far side; bottom row stays upright | Frames and sections stay fixed; top-row life actions reorder to preserve player-relative increase/decrease |

Do not rotate entire top-row cards. The global menu stays upright. A player's tracker inspector should follow their reading direction in Tabletop; its presentation needs implementation validation.

Use the stacked-layers icon without visible Trackers text on the card. Preserve a player-specific accessible name such as “Trackers for Player 3.” The reference specifies a 22px glyph in a 48px target, with at least 4px clearance from nameplate edges. The icon is an entry point, not a tracker count.

## Selected life interaction

The upper half of the life well increases life by one; the lower half decreases it by one, relative to the player's reading direction. Include visible plus/minus cues and accessible button names. Direct board adjustment does not require selecting the player first. Preserve negative-life behavior.

Nameplate controls, tracker entry, and the central menu must not also trigger life changes. Opening menus and switching layouts must not change values.

Proposed details: exact signed-delta entry and optional hold acceleration reduce repeated tapping. Timing, cancellation, and accidental-touch handling need validation. They are not prerequisites for a first styling ticket and must not appear as inert settings.

## Selected extensible tracking

Poison is one tracker type, alongside energy, experience, and custom numeric counts. Use reusable definitions and instances with stable identities. Adding a custom numeric tracker must not require editing source code. Do not encode every future type as a dedicated player field or use a display name as identity.

Commander damage is directed from a **specific commander entity to a specific recipient player**. Two commanders belonging to one owner remain distinct, as do different recipients. A single aggregate per player cannot satisfy this requirement.

Proposed details:

- Player counts and commander relationships share numeric editing primitives. Table-wide counts are a proposed additional scope.
- Poison, energy, and experience templates start at zero, with a zero minimum and step of one. Preserve the implemented poison floor. Custom definitions may explicitly permit negatives and specify bounds.
- Life remains a protected, always-visible system value starting at 40. Custom settings do not silently change its semantics.
- Opening or hiding a tracker does not reset it. User labels are plain text; custom trackers do not execute arbitrary rules.
- Commander damage adjustments update only that relationship by default. Whether they should also subtract life is **unresolved**; do not introduce coupled changes without a decision.

See [example definitions](DESIGN_TRACKER_EXAMPLES.json) and the interaction specification for proposed data contracts. They do not authorize automatic rules, elimination thresholds, or general nonnumeric emblem management.

## Undo and global menu

The selected layout has no title bar, persistent layout dropdown, or persistent Undo button. The central app-icon button provides table options, layout, and configuration. Expose only functions implemented by the approved ticket.

The owner suggested shaking the phone for undo. These safeguards remain **proposed details**, rather than a confirmed motion contract:

- Keep accessible Undo in the menu, available without motion sensors.
- Identify the latest eligible local adjustment by player, tracker or relationship, and signed delta. A no-op at zero does not replace it; changing layout does not lose it.
- Make shake optional and initially off. Request any required permission after explicit user action. A shake opens contextual confirmation rather than silently undoing while passing the phone.
- Define unsupported-device, denied-permission, and ordinary device-passing behavior. Do not request motion access on page load.

Exact undo scope, reset/removal interactions, and synchronized undo need ticket decisions. The references do not implement motion recognition.

## Future work and owner decisions

Connected phones need a separate brief covering joining, identity, edit permissions, concurrent edits, retry safety, reconnect, persistence, and ownership. No provider or paid service is selected. Offline recovery and synchronized play are separate capabilities; neither is guaranteed by PWA configuration.

Before their respective tickets, decide damage/life coupling, destructive player management and reset, safeguards above twelve, gesture defaults, undo semantics, and persistence expectations. Selecting the layout does not settle these choices.

Earlier README ideas—random player selection, avatars, game logs, alternate themes, dedicated ±5 buttons, configurable starting life, and emblem management—remain an unprioritized backlog. They are not added to selected scope by this update.

## Verification expectations

Future tickets should verify correct player/relationship isolation, poison floor and negative life, stable values through layout changes, no accidental life mutation from other controls, and correct top-row orientation without moving sections. Test representative 2-, 4-, 6-, and 12-player tables and agreed larger-table cases.

Target WCAG 2.2 AA, 48px touch targets, visible keyboard focus, meaningful accessible names, sufficient contrast, reduced motion, and usable enlarged text. Validate real phones in both orientations. The phased brief contains candidate criteria and the unchanged repository completion gate. This documentation update does not establish application checks, device validation, or AI review completion.
