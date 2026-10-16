# Commander Tracker selected layout

See [current functionality](FUNCTIONALITY.md) for implemented behavior and [the product roadmap](ROADMAP.md) for intended functionality, milestone progress, proposed details, and unresolved decisions.

The owner selected the current Obsidian Arena layout on October 16, 2026 as the desired layout for now. This records a design decision, not authorization to implement, release, change audit policy, or spend on reviews.

## Selected references

The primary visual reference is [the six-player Pass-around layout](OBSIDIAN_SIX_REFERENCE.html), with every player's content upright. It demonstrates the selected appearance; the intended default table size remains four players.

[The four-player reference](OBSIDIAN_REFERENCE.html) uses the same frame, icon, spacing, section placement and orientation rules. [The six-player Tabletop reference](OBSIDIAN_SIX_TABLETOP_REFERENCE.html) demonstrates the optional opposite-facing top-row content.

## Decisions to preserve

- Landscape-first, tightly packed player cards fill the board, with narrow equal gaps and clear life totals.
- Obsidian surfaces and layered bronze frames retain the selected card-inspired appearance.
- A circular existing-app-icon button opens the global Table menu in the local central pocket. There is no full-width menu strip, side rail, title bar, persistent layout field, or dedicated visible Undo button.
- Four-up uses the rounded meeting corners for that pocket. The six-up exploration uses small curved recesses in the middle pair's shared edge.
- Player name and tracker sections stay at the bottom of top-row cards and the top of bottom-row cards, in both orientation modes.
- Pass-around keeps all content upright. Tabletop flips far-row content and player-relative life actions without moving card sections, frames, or the central pocket.
- Tracker entries use the bronze stacked-layers icon with a 48px touch target and at least 4px external clearance. The accessible name still identifies the player's trackers.
- Additional tracking remains extensible; selecting this appearance does not restrict tracking to poison.

## Handoff scope

Read this decision before [DESIGN_SPEC.md](DESIGN_SPEC.md), [DESIGN_INTERACTIONS.md](DESIGN_INTERACTIONS.md), [DESIGN_TOKENS.json](DESIGN_TOKENS.json), and [DESIGN_IMPLEMENTATION.md](DESIGN_IMPLEMENTATION.md). Earlier exploratory descriptions are superseded where they conflict with the selected references and decisions above.

This selection covers the current layout and visual direction. It does not approve every proposed gesture, network behavior, persistence feature, technical threshold, or implementation phase. Wider-table behavior, responsive fallbacks and accessibility still require the documented validation. Application code and the existing poison-floor ticket remain unchanged. A future code ticket must reconcile currentTask with the authorized implementation scope.
