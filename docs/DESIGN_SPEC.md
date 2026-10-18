# Commander Tracker product vision and design specification

See [current functionality](FUNCTIONALITY.md) for implemented behavior and [the product roadmap](ROADMAP.md) for intended functionality, milestone progress, proposed details, and unresolved decisions.

Version 6, October 16, 2026. Audience: product owner and developer agents. **The owner selected the current layout as the desired layout for now.** [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) records the selected references and the boundaries of that decision. Obsidian Arena remains the visual direction, with closely packed player cards, a central app-icon menu, inward-facing name/tracker sections, and padded stacked-layers tracker buttons. [DESIGN_INTERACTIONS.md](DESIGN_INTERACTIONS.md) specifies the interaction contracts.

Implementation status note (October 16, 2026): the M1 visual foundation has since
been merged in PR #6 and reviewed with Codex and browser/build checks. Current
work is the authorized `table-setup-identities` M2 ticket. The design-only and
`poison-floor` wording below records this specification's original handoff;
current authorization and implemented behavior are defined by currentTask,
FUNCTIONALITY.md and ROADMAP.md. Unimplemented gestures/layout/network proposals
remain proposals, and physical-device/screen-reader validation is still pending.

## Authority and scope

**Required** denotes an owner-selected direction or a concrete criterion for a future ticket based on this specification. **Proposed** denotes a designer recommendation that needs inclusion in an approved ticket before implementation. **Flexible** denotes an implementation choice within the stated constraints. **Unresolved** denotes a product decision that must not be guessed by a developer.

The owner authorized design, not application changes. All new behavior below is a design proposal until an implementation ticket is approved. The current `poison-floor` task in `shipcheck.config.json` remains unchanged and does not authorize this work. No audit policy, API allowance, source behavior, dependency, or release process changes are implied. Existing runtime behavior is documented in [DESIGN_DISCOVERY.md](DESIGN_DISCOVERY.md).

## Product vision

Commander Tracker is a tactile instrument for keeping a Commander table legible. A player should be able to receive a phone, identify the intended player, make a precise adjustment, and return attention to the game. Deep blue stone, restrained bronze, and layered frames provide the ritual of a collectible game; typography and explicit controls carry the information.

**Required:** prioritize phones, then tablets, then desktop. Prefer landscape, with configurable arrangements and a fully usable portrait fallback. Accommodate a shared phone or tablet passed among players. Preserve an eventual path to each participant using their own phone. Default to four players and support the core range of two through twelve. Use the selected dark Obsidian Arena direction with more frame detail than the initial exploration. Make additional tracking generic and extensible, including player counters and specific commander-to-recipient relationships. Provide quick life interactions. Carbon is a reference for flexibility, intuitive controls, and ease of use, not the visual style.

**Proposed:** support larger tables through an advanced player-count entry rather than a hard twelve-player product ceiling. Two through twelve is the core validation target; larger tables retain the same grouping or roster composition. Do not promise unlimited performance. Test sixteen and twenty-four as representative extensions before describing them as supported.

## Design principles

1. Identity before adjustment. Player name and seat number stay next to every editable counter group. A selected player is not the current turn player.
2. Read before ornament. Life is the largest value; additional trackers are explicitly labeled. Metallic lines separate regions without crossing numbers or button labels.
3. Stable targets. Changing a value never moves the controls. Quick life zones always adjust life; opening another tracker never silently changes those zones' meaning.
4. Grow through space and navigation. Larger tables add pages or roster rows rather than shrink touch targets. A small phone need not display twelve editable panels simultaneously.
5. Preserve intent. Selecting a player or resizing a screen does not mutate counters, player order, or game state. Future synchronization must make uncertainty visible.

## Experience model

**Proposed default:** landscape pass-around board, four independently editable player frames in a two-by-two arrangement when the available height fits minimum targets. Each life well has two real buttons: top increases life, bottom decreases it. Player names and tracker entry controls sit outside those zones. Most life changes require one tap and no player-selection step.

**Required owner refinement:** the player cards fill available width and height, separated by a narrow gap in both directions. Put the circular app-icon menu in the negative space formed by the four curved meeting corners. Do not reserve a horizontal band or side rail. **Proposed geometry:** 8px row/column gaps, 56px radius on only the corners meeting at center, 18px ordinary outside corners, and a 48px menu button with the existing icon at 32px. Propagate those curves to the inset surfaces and actual button hit regions, and inset header controls near the pocket. Layout, density, interaction preferences, player count, and contextual Undo remain inside the menu. In Focus or a one-column layout, place the same button in a separate row after the editor/board rather than over its life total. Retain a programmatically named main region.

Pass-around keeps all content upright for the person holding the device. In both Pass-around and Tabletop, top-row names/tracker entries remain at the bottom of their cards and bottom-row names/tracker entries remain at the top. Tabletop flips far-row text, values and cues without rotating frames or moving those sections. Tracker buttons have at least 4px clearance and a retained 48px target. Focus provides one player editor and a roster. Configuration never changes values, seat identity, or bounds. Twelve-player phone tables use stable groups with visible page navigation. See DESIGN_INTERACTIONS.md for the precise contracts.

## Frame language

The frame has four distinct layers:

| Layer | Construction | Purpose |
| --- | --- | --- |
| Outer rim | Two-pixel bronze rail around a rounded dark shell, with a dark gutter and one-pixel inner lip | Gives the panel physical depth |
| Nameplate | Rounded capsule with a bronze outline, inset highlight, seat number, and player name | Separates player identity from counters |
| Life well | Dark inset field with broad rounded upper corners and smaller lower corners; one fine muted bronze edge | Gives the large number its own quiet region |
| Tracker entry | Compact outlined control in the nameplate for dense boards; a lower inset band in Focus | Opens generic counters and commander relationships without stealing life taps |

**Required:** decoration must not reduce target size, obscure focus, imply a button, or carry game meaning. **Proposed:** use a small stepped join above the nameplate rather than copying a legendary crown. No imported card art, mana symbols, set marks, or game logos are required. The nameplate is ornamental for all players, not a legendary or active-turn status.

**Flexible:** gradients may simulate a metal bevel; a small CSS pseudo-element may form the stepped join. Essential boundaries use solid colors. Decorative pseudo-elements are pointer-transparent and hidden from accessibility APIs. Do not clip the entire interactive panel with a polygon: that risks cutting off focus outlines and text. No animation, particles, or animated glows on the frame.

The reference is the visual separation and title emphasis described by Wizards, not a reproduction of its frame asset. See [Dominaria frame changes](https://magic.wizards.com/en/news/announcements/dominaria-frame-template-and-rules-changes-2018-03-21). Exact frame geometry is proposed and may be refined with the owner.

## Design system

Use [DESIGN_TOKENS.json](DESIGN_TOKENS.json) as the machine-readable starting point. It is documentation data, not an imported application dependency. Prefix application CSS variables `--ct-`. Keep semantic names consistent across components; avoid scattering literal palette values.

| Semantic color | Value | Application |
| --- | --- | --- |
| canvas | #10151D | Full gameplay background |
| surface | #1C2531 | Player panels and roster controls |
| inset | #131B25 | Life well and inset counter band |
| control | #283647 | Neutral button fill |
| controlHover | #34465A | Fine-pointer hover only |
| text | #F4EEE2 | Names, numerals, action labels |
| textSecondary | #C2C6CC | Supporting labels |
| metal | #D5B77C | Main frame and selected markers |
| metalMuted | #87734D | Decorative inner lip, never essential boundary |
| controlEdge | #8895A6 | Essential button outline |
| focus | #AAD9FF | Keyboard focus ring |
| error | #FFB4A8 | Error text paired with a message |

Calculated solid-color contrast ratios: text/surface 13.38:1; textSecondary/surface 9.01:1; metal/surface 8.02:1; text/control 10.64:1; controlEdge/control 4.04:1; controlEdge/surface 5.08:1; focus/canvas 12.27:1; error/surface 9.09:1. Values use WCAG sRGB relative luminance. These validate these pairs only, not every rendered state, gradient, focus neighbor, opacity, or appearance on a device.

Typography uses `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`; optional `Georgia, serif` only for a short product heading, never the counters. No downloaded font is required. Body and action labels: 16px/1.5, weight 400–500. Player names: 18px/1.3, weight 600. Product title: 22px/1.2, weight 600. Labels: 13px/1.4, weight 500; uppercase only for short labels. Focus life: 72px/1.05; compact landscape life: 56px/1.05, weight 500, tabular lining numbers. Roster life: 30px/1.1. Additional tracker values: 24px/1.2. Use rem equivalents and allow browser text scaling.

Spacing scale: 4, 8, 12, 16, 24, 32px. Phone outer padding: 12px below 360px, otherwise 16px. Player panel padding: 12px; gap between independent controls: at least 8px. Tablet outer padding: 24px. Frame radius: 20px outer, 16px inner, 999px nameplate, 28px 28px 12px 12px life well. Controls: 10px radius and minimum 48 by 48px targets. Panel-to-panel gap: 16px. Focus: 3px solid focus color with 3px offset; do not suppress browser focus if custom styles fail.

Motion is optional: up to 120ms background or border transitions on direct interaction, with no delay in committing the value. Reduced motion disables optional transitions. No number rollovers, entrance animation, sound, or vibration is specified. Elevation is limited to one static shadow per major frame, not each text field.

## Components and interaction states

| Component | Required behavior for its future ticket | States and semantics |
| --- | --- | --- |
| TableMenu | One compact entry outside life targets; exposes layout, count, preferences and contextual Undo | Native button opens labeled dialog; Escape/Done returns focus; background cannot activate while open |
| PlayerFrame | Show name, immutable seat identity, quick life zones, and a Trackers entry | Default, focus-within; frame itself is not a button |
| CounterButton | One activation applies exactly +1 or -1 to its named tracker instance | Default, hover, pressed, focus-visible; optional acceleration is separately specified |
| LifeValue | Starts at 40 for a newly created player and permits negative values | Text output; no automatic elimination or clamp at zero |
| TrackerValue | Displays a definition-driven value, label, and player or relationship identity | Poison template preserves zero floor; no shared global rule that all tracker values behave like poison |
| RosterButton | In Focus, selects the player; shows name, seat, life, and pinned tracker summaries | Native button with aria-pressed; selected state has the word Selected and bronze border |
| SelectedPlayerEditor | In Focus, shows one player's controls and updates the matching roster summary | Labeled region; changing selection does not alter counters |
| PlayerCountForm | Defaults to four for a new table; accepts integer counts from two upward | Label, numeric input, inline error, submit and cancel; errors retain entered text |

Accessible counter names follow `Increase life for Player 1`, `Decrease life for Player 1`, and equivalent poison labels. If names become editable later, include a stable seat identifier where duplicate names would otherwise make controls ambiguous. Do not add editable names merely to implement these frames.

In Focus, roster selection leaves keyboard focus on the roster button, updates the editor, and announces the selected player's name and values. If the editor is offscreen, show a keyboard-accessible `Adjust Player N` link after the selected roster item; activation returns to the editor heading and moves focus there. Use programmatic focus on a heading with tabindex=-1 only for this explicit navigation. Do not automatically scroll on every selection or move focus after each adjustment.

Use one visually hidden polite status region for counter updates, such as `Player 3 energy 6`. Do not make the whole roster live. Rapid input may coalesce announcements but must preserve every count update. At zero poison, announce that it remains zero when decrement is activated. Icons are optional; plus/minus zones always have accessible labels. Quick zones are limited to the life well and must cancel taps when a touch becomes a scroll, as specified in DESIGN_INTERACTIONS.md.

### New table and player count

**Proposed:** a first-use setup presents an integer player count defaulting to four, a short note that two through twelve are the usual range, and `Start table`. Use a native input rather than limiting choices to a fixed list. Counts above twelve reveal informational text that the table will scroll; they do not produce an error solely for exceeding twelve. Reject empty, non-integer, non-finite, unsafe integer, and values below two with an inline message before allocation. Large resource requests need a separately agreed technical safeguard, not an undocumented clamp or silent truncation.

Starting creates that many distinct players with 40 life and zero poison. The setup proposal changes existing app entry behavior and therefore belongs in its own implementation ticket. No reset, replacing a running game, or destructive roster shrink is authorized by this design.

**Unresolved:** whether table size must change during an active game, and what removing a player means for their counters/history. **Proposed near-term:** add players during a session via `Add player`, initialized to 40/0 with a stable new ID and next seat number; keep active-game removal out of that ticket. Owner confirmation is needed before coding this proposal. The illustration changes count as a disposable scenario selector and is not a removal specification.

## Responsive screens

Measure both available width and height, including browser chrome and safe areas. Landscape is a preferred composition, not an orientation lock or an assertion that rotating increases total screen area. Use CSS layout or container queries. Never detect phone or tablet by user agent. The layout contracts below replace the version-one width-only breakpoints.

| Available space or chosen mode | Composition | Growth and fallback |
| --- | --- | --- |
| Landscape phone with at least 240px per panel and 168px panel height | Default two-by-two pass-around board | Four seats per page; stable navigation for larger tables |
| Short landscape that cannot fit four minimum-size frames | One row of two frames per page | More pages, never smaller targets; Focus remains available |
| Portrait phone or chosen Focus | Selected editor and roster | Normal page scrolling; no rotation requirement |
| Spacious tablet | Up to three columns and two rows when minimums fit | Six per page by proposal; explicit choice of fewer larger frames |
| Desktop | Bounded 1120px gameplay canvas | Same layout choices; extra width becomes margins |

At 844 by 390 CSS pixels, the four-up minimum is 336px for two 168px frame rows, an 8px gap, and 16px outer vertical padding: 360px before additional safe-area insets. Distribute remaining usable height equally across the two rows; stretch life zones within each card rather than leaving unused space in the board. The circular menu uses the corner pocket, not another row. If minimums cannot fit, use two-up or Focus. The contained reference uses a representative landscape aspect ratio; production must size to the actual available viewport height and safe areas. Portrait Focus remains usable with scrolling. Do not force full screen or rotate the whole webpage.

At 200% text zoom or enlarged platform fonts, all content reflows without hiding controls. At 400% browser zoom, support an effective 320px-wide view with no two-dimensional page scrolling. Controls retain 48px targets even if that requires more rows.

The life well must handle 0, -1, -99, 100, -999, and 10000 without clipping. Start at 72px, use 56px for longer totals, then move the life buttons below the number if needed; never truncate or round the stored value. Arbitrarily long values require a wrapping text fallback, not an ellipsis. Values must retain their signs. Do not use responsive font shrinking below 48px for the main life value merely to fit an extreme value beside controls.

## Accessibility requirements

Target WCAG 2.2 AA with a product-specific 48px minimum touch target, which is larger than the AA target-size minimum. Verify at least 4.5:1 for normal text, 3:1 for qualifying large text, and 3:1 for essential control boundaries and meaningful state indicators against their adjacent colors. Decorative bronze lips do not establish the button boundary. Test focus against the surface it actually borders.

Preserve logical heading order, native keyboard activation, and visible focus. Selected markers include text in addition to color. Every number has a visible or programmatically associated counter label and player identity. Ensure controls remain usable in forced-colors mode using system colors where needed. Avoid focus or status signaled only by shadow. Text spacing overrides must not overlap labels or cut off buttons.

Required manual scenarios for implementation: keyboard-only selection and adjustment; screen reader identification and polite updates; 200% text enlargement; effective 320px width at zoom; reduced motion; forced colors; portrait and landscape; touch scrolling starting over non-control parts of the panel. Test on at least one iOS Safari phone and one Android Chrome phone before claiming mobile validation. Browser automation alone cannot establish touch comfort or glare performance.

References: [text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), and [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). These requirements are design goals; the mockup does not establish conformance.

## Eventual personal-phone experience

**Required product intent:** each participant should eventually access and operate the same game from their own phone. **Proposed UI continuity:** the same editor defaults to their assigned seat, with the full roster accessible. Table ownership and identity must not be inferred from the selected panel. Keep stable player IDs now so later synchronization need not use array position as identity.

**Unresolved before a networking ticket:** how people join; who may edit which player; whether anonymous sessions suffice; how a phone reconnects; persistence ownership; conflict resolution and undo; and whether a departed player's seat can be reclaimed. Do not add join codes, accounts, or remote controls as part of a local visual ticket.

The eventual UI must distinguish connecting, synced, pending local changes, and disconnected states using text. A reconnect must not silently reset the table or claim pending changes were saved. Concurrent increments from two phones must not overwrite one another. The eventual technical design must settle operation ordering, duplicate submission, permission rejection, and retry semantics before a connected preview is approved. Local offline access and synchronized multiplayer are distinct capabilities.

## Handoff and verification

### Six player exploration

[OBSIDIAN_SIX_REFERENCE.html](OBSIDIAN_SIX_REFERENCE.html) explores three columns and two rows with the same 8px gaps and direct life zones. The exact board center lies along the middle pair's shared edge, rather than at a four-card corner. Small semicircular recesses in those two edges make a local pocket for the app-icon menu, without a full-width strip or shifting the menu off-center. This is an additional proposal; the approved four-player corner layout remains unchanged.

[OBSIDIAN_SIX_TABLETOP_REFERENCE.html](OBSIDIAN_SIX_TABLETOP_REFERENCE.html) demonstrates the single-device Tabletop option: the top three cards' content faces the far side while their name/tracker sections remain at the bottom. The bottom three stay upright, with name/tracker sections at the top. The far-side inspector follows its invoking player's orientation. The global menu stays upright. [OBSIDIAN_SIX_REFERENCE.html](OBSIDIAN_SIX_REFERENCE.html) is the current normal-facing demonstration; switching between these modes retains card section placement. The Tabletop reference's starting mode is solely for demonstration and does not change the proposed Pass-around default.

Three 240px panels plus two 8px gaps and 16px outer padding require 752px of usable width. Six-up therefore suits wider landscape phones or tablets; below that, production Auto should show fewer cards per page rather than weaken the proposed minimum. The responsive conversation illustration can be narrower: the inspected cards measured roughly 235 by 176px with life zones at least 57.5px high. That is a visual exploration, not proof that all six fit the production minimum at that width. A Player 6 increment isolated correctly and the centered menu opened with the right undo receipt. A 72-point sweep at radius 27px around the menu found no life or tracker control hits.

The six-player reference uses clipped recesses for the visual prototype. Before production adoption, verify keyboard focus visibility around those shapes and all touch cancellation cases, plus enlarged text and both orientations. No application code or existing four-player acceptance criteria changed.

Use [DESIGN_INTERACTIONS.md](DESIGN_INTERACTIONS.md) for tracker, gesture, and layout contracts and [DESIGN_IMPLEMENTATION.md](DESIGN_IMPLEMENTATION.md) for phased tickets and traceable acceptance criteria. The design system is the default visual authority; existing behavioral requirements retain authority until an approved ticket changes them. The original comparison is historical. [OBSIDIAN_REFERENCE.html](OBSIDIAN_REFERENCE.html) is the current self-contained landscape reference. Its local interactions illustrate proposals and do not establish persistence, synchronization, device comfort, scale limits, accessibility conformance, or production readiness. The original portrait-only reference is superseded.
