# Commander Tracker design discovery

Design exploration dated October 16, 2026. The owner selected Obsidian Arena with richer, layered frame embellishment. This brief preserves the original baseline and comparison. The selected direction and subsequent owner decisions are specified in [DESIGN_SPEC.md](DESIGN_SPEC.md), which supersedes proposals below where they differ.

Subsequent direction: landscape-first configurable layouts, generic player and relationship tracking, and quick life interactions. Carbon is the owner's usability reference, not the visual reference. See [DESIGN_INTERACTIONS.md](DESIGN_INTERACTIONS.md). The original poison-only and portrait-first concepts below are historical.

Commander Tracker should help people read and adjust the table's state quickly on a phone, with the material richness of a collectible game. Phones are primary, tablets secondary, and desktop tertiary. The proposed identity uses original surfaces and typography rather than game artwork, branded symbols, or copied card frames.

## Scope and ticket reconciliation

The authorized phase is design discovery only. Application behavior, source, tests, dependencies, and audit policy remain outside these edits. `shipcheck.config.json` currently names `poison-floor`, with life and poison isolation requirements. That ticket does not cover a visual redesign. It remains unchanged; neither concept is an implementation instruction under that ticket. A later implementation ticket needs owner approval for its requirements and for replacing currentTask. No API allowance has been authorized.

## Existing experience

| Area | Observed implementation | Design implication |
| --- | --- | --- |
| Entry | App renders the heading Commander Life Tracker and LifeTracker directly | Gameplay is the only existing screen; no navigation shell is needed |
| Players | Two fixed names, Player 1 and Player 2 | Preserve both players in the representative screen; do not imply player management |
| Life | Starts at 40; individual increment and decrement buttons change by one; negative values are permitted | Give life the strongest hierarchy and preserve negative numbers |
| Poison | Starts at zero; changes by one and floors at zero | Keep explicitly labeled, separate from life, and directly accessible |
| State | React component memory | Refreshing remounts initial values; do not promise a saved game |
| Appearance | Imported index.css supplies generic Vite styling, a large heading, dark/light system colors, and vertically centered body | Introduce intentional mobile geometry, hierarchy, spacing, and tactile controls |
| Unused stylesheet | App.css contains template rules but is not imported by main.tsx or App.tsx | Do not assume its root padding or centered text is active |
| PWA | Vite configuration declares manifest icons and caching | Caching configuration does not establish durable game state or verified installability |

Sources: `src/App.tsx`, `src/LifeTracker.tsx`, `src/poison.ts`, `src/main.tsx`, `src/index.css`, `src/App.css`, `vite.config.ts`, and existing behavioral tests. The local preview could not start because Vite is not installed in the working directory. Current appearance is assessed from source, not a browser observation.

The README lists commander damage, random selection, larger adjustments, persistence, player management, settings, and other aspirations. Those are not implemented by LifeTracker and are excluded from these concepts.

## Shared comparison scenario

Both concepts depict the same portrait phone screen and the same reachable mid-game state: Player 1 has 37 life and 2 poison; Player 2 has 40 life and 0 poison. This is example content, not a change to starting values. Each player has life minus/plus and poison minus/plus controls. Local preview taps update both concepts together so switching directions preserves an identical comparison state. Preview state is disposable.

Both concepts keep players upright and stacked. This assumes a single operator holding the phone or a phone passed between players. It is a proposal pending the device-ownership decision below. Neither includes game creation, reset, settings, undo, long press, elimination, commander damage, avatars, or new game rules.

## Obsidian Arena

Dark blue stone surfaces, warm bronze trim, understated raised controls, and large sans-serif life totals establish an arena atmosphere. Typography carries the hierarchy; restrained edge treatment supplies the fantasy character. Decoration is static and never sits behind numerals. Player identity uses explicit names and seat numbers rather than relying on hue.

Life controls flank the central total. Poison has a smaller dedicated row below a divider. This arrangement prioritizes reading the number and adjusting it without finding a secondary view. Separate button surfaces make the tap boundaries visible.

Provisional palette: background #10151D, panel #1C2531, foreground #F4EEE2, secondary text #C2C6CC, bronze #D5B77C, control #283647. These are exploration values, not approved tokens. Border and interaction contrast require measurement during specification.

Advantages: strong numeric hierarchy, clear separation of counters, atmospheric identity without illustration downloads, and familiar functional typography. Tradeoffs: dark surfaces need testing under glare; flanking controls offer less space to unusually long totals; repeated framed panels can feel heavy if ornament grows.

## Gilded Folio

Warm paper, dark ink, fine inset frames, and restrained serif headings evoke the physical feel of a collectible object. The composition uses a nameplate, a left label with a right-aligned life total, then a broad pair of explicitly labeled life controls. Poison remains a separate row.

Provisional palette: background #E9DFCA, panel #FBF5E8, foreground #28251E, secondary text #625848, accent #79551E, control #EDE2CE. These are exploration values, not approved tokens.

Advantages: broad life buttons, explicit action text, quieter material character, and a light surface worth testing in brighter rooms. Tradeoffs: serif numerals may be slower to distinguish at distance; the layered frame consumes space; the identity feels more like a physical game companion than a digital arena.

## Recommended direction

Choose Obsidian Arena as the visual foundation. It gives life totals the clearest central emphasis and best matches the requested atmosphere while remaining practical to implement with typography and CSS. Borrow Folio's restraint in ornament, without combining both palettes into one screen. Glare and distance readability are hypotheses to test, not measured advantages. A light appearance, theme switcher, or custom player colors would require a separate scope decision.

## Product decisions needed

Resolved by the owner after the comparison: Obsidian Arena; shared devices passed between players as the most common interaction; eventual access from each player's own phone; expandable tables with four players by default and a core range of two through twelve. The owner expressed a preference for allowing larger tables. The specification proposes an advanced entry for more than twelve, without treating unlimited scale as a verified capability. Earlier two-player proposals below are historical, not current product direction.

| Decision | Why it matters | Proposed starting point |
| --- | --- | --- |
| Who operates the phone: one scorekeeper, passed around, or placed centrally? | Determines orientation, reach, and whether upright stacked panels work | One scorekeeper or passed phone; validate with owner |
| Is the next implementation limited to the existing two players, or should separate future work support a larger table? | A larger player count materially changes the phone layout | Implement two-player styling first; explore larger tables only under approved scope |
| Which visual direction should define the product? | Locks surface, type, and hierarchy decisions | Obsidian Arena |

## Provisional design constraints

These guide the next specification; they do not replace repository requirements. Keep one tap equal to one existing adjustment. Do not hide poison behind a menu. Preserve player-specific accessible button names. Present names and values as text; color is supplementary. Keep touch targets at least 48 by 48 CSS pixels with separation between counter groups. Use text contrast targets of 4.5:1 for ordinary text and 3:1 for large text, and 3:1 for essential control boundaries and focus indicators; verify actual combinations before implementation. Preserve visible keyboard focus and keyboard activation.

Plan for 320px phone widths, text enlargement, negative and three-digit totals, short landscape heights, and safe areas. Allow vertical scrolling when content needs it rather than shrinking controls. Reduced motion must remove optional animation. No continuous glow, particles, card art, or remote font dependency is needed for either direction. The preview is a portrait concept, not proof that these constraints have passed device or assistive-technology validation.

On tablets, investigate side-by-side player panels when minimum control and text widths fit. On desktop, retain a bounded gameplay canvas instead of expanding into a dashboard. Exact breakpoints and landscape arrangements remain part of the selected-direction specification.

## Handoff after direction selection

Produce the product vision with explicit principles and non-goals; semantic design tokens with measured contrast; component anatomy and all interaction states; phone, landscape, tablet, and bounded desktop layouts; accessibility and responsive acceptance criteria; and phased implementation tickets linked to source files and meaningful tests.

Each decision should be tagged required, flexible, or unresolved. Bind each acceptance criterion to a screen or component, its expected behavior, and a verification method. Record the chosen direction and device assumptions before developer agents treat a mockup as a requirement. Preserve existing behavioral coverage; adjust markup-coupled tests only when assertions still substantiate the same behavior.

Implementation completion remains subject to the repository's offline audit, full behavioral suite, fresh build and artifact integration gate, and an explicitly authorized final AI task review. These design artifacts do not establish application readiness. No paid review was performed.
