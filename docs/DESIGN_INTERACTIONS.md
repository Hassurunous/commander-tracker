# Commander Tracker trackers and fast interaction design

See [current functionality](FUNCTIONALITY.md) for implemented behavior and [the product roadmap](ROADMAP.md) for intended functionality, milestone progress, proposed details, and unresolved decisions.

Version 5, October 16, 2026. This supplements DESIGN_SPEC.md and supersedes poison-only tracking, portrait-first navigation, the title/layout/Undo toolbar, the side rail, and the reserved central band. The circular app-icon menu fits in the negative space of the cards' meeting corners. It remains a design specification, not authorization to change application behavior or currentTask.

## Carbon as an interaction reference

The owner identifies Carbon as the reference for flexibility, intuitive UI, and ease of use, not its visual style. The [developer's App Store listing](https://apps.apple.com/us/app/carbon-mtg-utility/id1209153225) documents customizable gestures, default counters, and layout options. The listing is evidence of those advertised features, not a live inspection of Carbon's behavior. Top/bottom life zones, the gestures below, and the relational tracker design are Commander Tracker proposals. The developer website was unavailable during research. Do not infer current Carbon mechanics from old reviews or reproduce its feature list wholesale.

## Extensible tracking model

Life remains the primary always-visible value. It may use the same numeric presentation primitives as other trackers but is a protected system definition: start at 40, permit negative values, do not hide, remove, or alter its semantics through custom-tracker settings. Additional tracking is definition-driven rather than a fixed poison field in every component.

| Scope | Example | Identity and display |
| --- | --- | --- |
| Player | Poison, energy, experience, custom numeric counter | Definition ID plus player ID; visible label and value |
| Directed pair | Damage from a specific commander to a specific player | Definition ID plus source entity ID and recipient player ID; show both endpoints |
| Table | A custom table-wide count | Definition ID plus game ID; clearly labeled Table, outside any player's card |

**Proposed definition fields:** stable ID, schema version, human label, numeric value kind, allowed scope, initial value, step, minimum (nullable), maximum (nullable), and optional display metadata. Initial implementation exposes integer counts. Do not implement a general rules engine, arbitrary formulas, scripted callbacks, or generic permanent tracking. Future value kinds require versioned renderers; the schema can evolve without erasing unknown definitions.

**Proposed instance fields:** stable ID, definition ID and version, game ID, subject player or table ID for those scopes, source and recipient IDs for directed pairs, current value, and visibility/pin preferences. Validate that the scope and endpoints match the definition. A label is display text, never a primary key or executable content. Two custom trackers with the same label remain separate identities; the UI should request a distinguishing label where ambiguity would result.

[DESIGN_TRACKER_EXAMPLES.json](DESIGN_TRACKER_EXAMPLES.json) makes these identities concrete, including separate same-owner commanders and a negative-enabled table count. The example is a partial game's tracker set, not a runtime migration or a requirement to initialize every possible tracker for every player. Additional trackers can be created lazily; absence is not the same as a recorded zero.

Template defaults are data: poison, energy, and experience initialize at zero with step one and minimum zero. Poison retains the existing no-op decrement at zero. Custom numeric counts default to the same settings but may explicitly allow negatives; their bounds do not retroactively change other instances. A count above a familiar game threshold remains recordable: no auto-elimination, cap, or game-rule effect is added. Definitions are versioned so a later template change does not silently rewrite a running game.

The editor uses one reusable labeled value row, shared validation, and shared counter operations for all numeric definitions. Adding a custom player or table tracker must not require a new hardcoded component or a new property in the Player interface for each name. User-created directed relationships may reuse the same model later; the first relationship UI specializes commander damage because endpoint meaning matters.

### Commander relationships

A commander is its own stable entity, with an owner player ID, a display label such as Commander A, and a unique entity ID. A player can have more than one commander entity. Track damage for each source commander and recipient player independently. Do not use only the source player's ID, an array index, or a single commanderDamage total.

For example, Player 2 / Commander A → Player 1 = 3 and Player 2 / Commander B → Player 1 = 5 are distinct from Player 2 / Commander A → Player 3 = 1. The recipient's panel opens a list of incoming sources; the source commander and recipient remain visible during adjustment. Include a source commander's owner label and its own identifier; never merge partners. Identity follows the commander entity if control changes. Modeling changing controllers is later work; owner and controller must not be conflated by display labels.

**Proposed conservative default:** adjusting commander damage changes that relationship only. Display `Tracks damage only; adjust life separately`. Automatic coupled life loss needs an explicit product decision and a separate atomic transaction design, including reversals. Do not introduce automatic double-counting. Do not compute elimination from these values.

An optional matrix view may be useful on tablets later, but twelve-player phones must not render a full editable pair matrix. Load or render incoming relationships for one recipient at a time. A future import that cannot resolve an endpoint must surface an Unassigned source or recipient, retain the value, and offer repair; never silently reassign it to the next player.

### Add and manage tracking

`Trackers` on a player's nameplate opens that player's inspector with a clear heading. It contains active labeled values, `Add tracker`, and a separate Commander damage section. `Add tracker` offers Poison, Energy, Experience, and Custom count. Presets are shortcuts to definitions, not a closed list. Custom creation asks for a name, player or table scope, and whether negatives are allowed. Additional settings can expose initial value and step; step must be a positive integer. Never ask a casual player to supply JSON.

The compact nameplate entry uses a stacked-layers icon instead of the visible word Trackers. Glyph: Lucide `layers-3`, 22px, in the bronze accent color, centered in a 48 by 48px native button. Inset the button at least 4px from the surrounding nameplate edges; keep the target at 48px rather than shrinking it to create clearance. The nameplate therefore needs at least 56px height. This suggests a collection of values without tying the action to poison, money, or one game mechanic. Keep the accessible name `Trackers for Player N`; tooltip text may say Trackers but is not essential to activation. The stack does not indicate the number of trackers. In Tabletop, flip the far-side glyph while leaving its button in place. [The reference asset](design-assets/trackers-layers.svg) reproduces the supplied Lucide glyph for portable previews; application implementation may use the same library glyph rather than importing a new icon system. The inspector retains its text heading.

Keep life and all nonzero additional trackers discoverable. Pinned summaries may appear on expanded cards; compact boards show an accessible tracker entry and an indication that nonzero values exist. Pinning or hiding affects presentation only. Reopening a tracker retains its value. Hiding a nonzero tracker must offer clear disclosure in the inspector; removing a tracker instance is a distinct destructive action whose preservation/recovery policy is unresolved. Near-term management hides rather than destroys instances.

The full application inspector should be a labeled dialog on phones and may be a side inspector on tablets. It returns focus to the invoking player's Trackers button on close. Life zones behind an open modal cannot activate. Large lists scroll in the inspector, leaving its heading and close action available. The design preview uses an inline inspector to keep the entire exploration visible in conversation; this difference is intentional, not the production overlay contract.

## Fast life interaction contract

The life well contains two non-overlapping native button zones. Its top half adds one and its bottom half subtracts one. Both have a minimum 48px height and width. The nameplate, tracker entry, frame gutter, page controls, and inspector are outside these zones. The number may be visually centered across the split as a pointer-transparent output. Give the two buttons explicit accessible names and visible +1/−1 cues. Do not put nested controls inside a button or attach a second click handler to the parent card.

| Input | Proposed result | Guardrail |
| --- | --- | --- |
| Tap upper/lower zone | +1/−1 life, once on completed activation | No mutation on pointer-down |
| Keyboard Enter or Space | Activate the focused zone once | Native button semantics; no global numeric hotkeys |
| Exact change | Labeled action opens a signed-delta form; Apply commits once | Display player and Life; Cancel/Escape changes nothing; no ambiguous set-total vs delta field |
| Optional hold acceleration | After 500ms, repeat ±1 every 150ms while held | Off by default; cancel on release, scroll, pointer cancel, visibility loss, modal opening, layout/page change, or leaving zone |
| Table menu → Undo last adjustment | Reverse the latest eligible local adjustment using its receipt | Show player, value type, and signed change; keep a touch/keyboard route available |
| Optional shake shortcut | Open a contextual Undo confirmation without immediately changing a value | Opt-in, capability/permission-aware, one prompt per deliberate shake; Cancel is a no-op |

Hold timing is a prototype proposal for later usability testing. A hold that reaches the repeat threshold emits no initial tap and no trailing click; every repeat is accounted for. Quick tap and hold are mutually exclusive interpretations of the same input. Pointer travel beyond 10 CSS pixels cancels a tap or hold; scrolling and pointer cancellation always cancel. Retain native panning rather than blocking scroll globally. Single-click adjustment commits via one path only, preventing synthetic click duplication after touch. Multi-touch cancels recognition for affected zones rather than accidentally repeating changes. No shake, two-finger gesture, double-tap shortcut, or swipe-to-change-value is enabled by default.

In Tabletop mode, top/bottom is relative to the player reading the content: flip the far-side tap cues and swap the two life zones' vertical arrangement while keeping the life well itself fixed. Thus the far-side player's perceived upper zone still increases life. The nameplate stays at the bottom of top-row cards in both modes. Dragging the device or changing orientation never changes game state. Do not use screen-global y coordinates to infer increment versus decrement.

After a change, keep the total stable in place and announce player, value type, and new value politely. A brief signed-delta badge is optional feedback, not a promised game history. Respect reduced motion. Exact change and explicit buttons remain available when quick zones or hold are disabled. Preferences distinguish tap zones, optional hold, and layout; settings do not change game counts.

Undo is a proposed safety feature for direct interaction, not an audit history. Keep it available until the next eligible local mutation; selection and layout changes do not clear it. Store actual applied delta and affected IDs. A poison decrement clamped at zero is a no-op and does not replace the last undo receipt. An undo uses the receipt's identity even if the user now views another player. For later synchronized play, ordering and permission checks must prevent undo from overwriting others' edits; remote undo semantics remain unresolved.

### Table menu and shake shortcut

Remove the running game's title bar, always-visible Layout dropdown, and standalone Undo button. One circular Table menu button opens a labeled modal containing infrequent options and configuration. For four-up play, center it in the rounded-corner pocket where the four frames meet. There is no reserved inter-row band. Use a 48px diameter, 32px existing app icon, and bronze bezel; keep the icon decorative with empty alt text and give the button the accessible name Table menu. Reuse public/icon-192x192.png in application work; the reference embeds those same image bytes to remain portable. Do not substitute a new logo or ellipsis. The button represents the table, not a particular player, and does not rotate with a player's frame.

The proposed row and column gaps are both 8px. Enlarge only the four inward corner radii to 56px, keeping ordinary outside corners at 18px. This produces a local pocket for the 48px circular control without taking a horizontal strip away from all cards. Match the inset surface and life-button corner curves to the frame; move nameplate text or tracker controls inward where necessary. Do not merely paint a rounded backdrop while leaving an invisible rectangular life button beneath the menu. Do not clip the entire panel and its focus outlines as a shortcut. The button's bounding rectangle may intersect card bounding rectangles; use the actual rounded hit shapes and point tests to verify the pocket.

In Tabletop, keep physical card corners, menu pocket, and card sections fixed; flip the far-row content instead of rotating entire frames. The menu stays upright. Its focus indication must remain within the pocket and clear of active targets. For a two-player single-row layout or Focus, one-column, or odd/incomplete groups, use a dedicated safe menu row rather than expanding a full-width gutter in the four-up layout. Keep its global meaning and accessible name consistent across pages and densities. Other arrangements need their own junction geometry; never force twelve live frames merely to create a center.

Layout controls exist only while the dialog is open. The menu shows the last reversible change, for example `Player 1 life +1`, next to Undo; with no receipt it is disabled with the text `No adjustment to undo`. Escape or Done dismisses without changing state and returns focus to the trigger. Selecting a layout retains all game values. Undo dismisses the menu after applying the displayed operation.

The owner suggested shaking as an alternative to a permanent Undo control. **Proposed:** offer Shake to undo as an opt-in interaction preference, not the only route. A deliberate shake opens `Undo Player 1 life +1?` with Undo and Cancel, rather than immediately reversing anything while the phone is being passed. No prompt without an eligible receipt. Suspend recognition during active touches, a modal, a form, background/inactive state, or a layout change; use a cooldown so one shake cannot reopen multiple prompts. Timing and acceleration thresholds require real-device tuning; do not present an arbitrary constant as validated. Freeze the receipt identity for the confirmation and revalidate eligibility on commit. If the eligible operation changes, cancel the stale prompt rather than undoing a newer operation.

Motion support is a runtime capability, not a reliable device-wide undo command for a PWA. [DeviceMotionEvent documentation](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent) and [permission documentation](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/requestPermission_static) describe secure-context requirements and explicit permission through user activation in supporting browsers. Detect the event and any permission API separately; the absence of requestPermission alone does not mean motion events are unavailable. Request permission only after the user chooses Enable shake, never on load or when opening the menu. If denied, unavailable, or no usable readings arrive, show a clear inactive state and retain menu Undo. Do not claim an enabled shortcut without a functioning signal. The preview requests no motion access and does not simulate a physical sensor.

The menu route supports a resting tablet, desktop, assistive technology, and users who prefer not to shake the phone. The optional shake confirmation is part of the product interaction design, not a developer approval flow. No physical shake, device permission, or bug-report integration is implemented in this design phase.

## Layout preferences and scale

Landscape is the preferred gameplay composition, not a claim of more total pixels or a forced orientation. A dismissible first-use hint may suggest rotating. The app must remain operable in portrait and when device rotation is locked. Never rotate the whole document by 90 degrees to simulate landscape.

| Preference | Intended use | Arrangement |
| --- | --- | --- |
| Pass-around, default | One person holds the shared phone | All frames upright; landscape four-up when minimum dimensions fit |
| Tabletop | Shared device rests between players | Explicit far-row rotation; seat numbers and orientation preview before applying |
| Focus | One player at a time, crowded tables, large text, personal phones | One full editor plus roster; all controls upright |

Additional density choice is Auto, 2, 4, or 6 visible seats; the final fit is constrained by minimum panel and target size. A requested four-up layout that cannot fit falls back to two-up with descriptive text and remembers the preference. Do not discard the request or silently reduce target sizes. Theme, independent seat rotation, custom arrangement editing, and arbitrary gesture remapping are not necessary to deliver these three layouts; propose them separately if useful.

The owner's latest refinement fixes the card layout in both modes: top-row player names and tracker entries sit at the bottom edge of their cards, while bottom-row names and tracker entries sit at the top. These identity bands face the central seam regardless of text orientation. Use DOM order matching the visible section order, not only CSS order that conflicts with keyboard navigation.

Pass-around displays all content upright. Tabletop flips only the top row's names, numbers, tracker glyphs, and tap cues 180 degrees; it must not move the nameplate, tracker target, life well, card frame, or menu pocket. Swap the upper/lower life actions for that row so increase/decrease remain relative to the person across the table. On six-up this applies to the top three; on four-up, the top two. Bottom-row content and the global menu stay upright. A player's tracker inspector still faces that player's seat in Tabletop. Changing modes never changes values or ownership. This supersedes the earlier whole-frame rotation proposal.

A compact landscape frame needs at least 240px width and 168px height. Keep the nameplate/trackers row at least 56px, including the tracker target's clearance, and both life zones at least 48px, with space for the inset frame. At 844×390, four-up needs 336px frames + 8px row gap + 16px outer vertical padding = 360px minimum before extra safe-area insets. Equally stretch the two rows and life zones to fill the usable height. There is no central menu band or side rail. If minimums cannot fit, use two-up or Focus. The contained preview's aspect ratio is illustrative, not a production viewport lock.

For two through four players, show all when they fit. Five through twelve use stable groups sized to the chosen feasible density, with always-visible Previous, Next, page count, and seat range. At four-up, twelve players form three pages. Do not dynamically move a player between groups due to life values, nonzero counters, or selection. Larger tables continue the same grouping. Tablet Auto may show six at once when at least three 240px-wide panels and two minimum-height rows fit; users may choose fewer larger panels. Narrow portrait Auto uses Focus.

Preferences are local-device presentation choices, distinct from game state. They survive layout switches during the session. Saving those preferences across reloads is a separately scoped persistence change. Future synchronized phones may each choose a layout without changing another device's presentation. Current editor selection is not ownership or turn order.

## Additional acceptance scenarios

| ID | Criterion | Verification |
| --- | --- | --- |
| G1 | Energy, experience, and a new custom numeric tracker use the same reusable renderer; adding a custom tracker requires no source change | Component creation flow and model review |
| G2 | Two same-owner commander entities and two recipients retain independent values | Model and rendered relationship tests |
| G3 | Poison keeps its floor, negative-enabled custom values can cross zero, life remains negative-capable, and all updates isolate correctly | Pure operations and rendered controls |
| G4 | Opening or closing trackers and pressing inspector controls never changes life | Event-propagation interaction tests |
| I1 | Upper/lower activations apply exactly one signed step for the correct player | Pointer and keyboard tests |
| I2 | Scrolling, cancellation, multi-touch, dragging, and an orientation change do not cause a stray adjustment | Real touch-device tests plus targeted browser automation |
| I3 | Hold disabled behaves as tap-only; enabled hold has no initial/trailing duplicate tap and stops on every cancellation condition | Fake-timer unit tests plus real-device smoke check |
| I4 | Exact-change Cancel is a no-op; Apply commits one signed delta; undo reverses actual delta to original instance even after selection changes | Form, receipt and interaction tests |
| L1 | Four players are directly editable at a feasible landscape size; twelve players produce stable pages without smaller targets | 844×390 and larger/smaller landscape measurements |
| L2 | Portrait/Focus, layout switches, rotation and density changes retain all values, relationships and seat identities | Browser scenarios with twelve players and multiple trackers |
| L3 | Switching orientation flips content without moving identity bands or frame geometry; life actions remain player-relative and targets retain padding | Compare section coordinates and activate far-side controls before/after switching |
| M1 | Closed gameplay contains no title bar, layout field, or dedicated Undo button; one centered circular app-icon menu exposes the options | Visual, icon identity, target geometry, and accessibility-tree checks |
| M4 | Four-up cards fill the board with equal narrow gaps, and the menu occupies only the local corner pocket; curved hit regions/focus stay separate | Geometry and point hit tests, keyboard and touch checks in both pass-around and tabletop |
| M2 | Menu blocks background edits; Escape/Done restores trigger focus; Undo identifies and reverses only the displayed receipt | Keyboard, pointer and receipt tests |
| M3 | Shake is opt-in; passing or rotating the device does not silently undo; denied/unsupported motion keeps menu Undo usable | Real-device permission, motion and cancellation scenarios |

These scenarios supplement the repository's completion gate. The design reference implements a subset for discussion: direct life zones, menu-contained layout choices, generic player-scoped counters, custom player-tracker creation, separate commander pairings, and menu Undo. It does not implement motion access or shake recognition, custom table-scope creation, hold acceleration, exact-change dialogs, persistence, twelve-player paging, or synchronized play. Those remain specified future work, not demonstrated features. In narrow preview widths the board stacks all four cards rather than implementing production Focus selection or density paging automatically.
