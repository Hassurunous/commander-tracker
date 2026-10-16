# Commander Tracker

A React and TypeScript app for tracking a Magic: The Gathering Commander table. The intended experience prioritizes readable life totals, fast touch adjustments, flexible trackers, and a shared landscape phone or tablet.

## Current application

Two fixed players each start at 40 life and zero poison. Separate buttons adjust each value by one. Life can be negative; poison stops at zero. Values are held in memory and are not restored after a reload.

Vite PWA configuration and icons are present. This does not establish browser installability, reliable offline use, or persistent game state. Expandable tables, commander damage, generic trackers, the selected Obsidian Arena layout, undo, and connected personal phones are not implemented in the application.

## Product planning and design

[Current functionality](docs/FUNCTIONALITY.md) records what the application does today. [The product roadmap](docs/ROADMAP.md) records intended functionality, milestone status, open decisions, and completed work.

For implementation details, read [saved layout decisions](docs/DESIGN_DECISIONS.md), [the design specification](docs/DESIGN_SPEC.md), [interaction contracts](docs/DESIGN_INTERACTIONS.md), and [the phased implementation brief](docs/DESIGN_IMPLEMENTATION.md). HTML references demonstrate design intent. Roadmap entries do not authorize implementation or paid review.

## Getting started

Run from a local checkout with Node.js and npm available. Windows x64 with Node 22 is the qualified development setup.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run dev
```

Open the local address printed by Vite. To build or preview production output:

```sh
npm run build
npm run preview
```

## Development checks and agent workflow

The UI uses custom React components with a Storybook workbench. Run
`npm run storybook` to inspect them locally, or `npm run build-storybook` for a
static build. See [the component library guide](docs/COMPONENT_LIBRARY.md).

Read [agent instructions](AGENTS.md), [Shipcheck setup](docs/SHIPCHECK.md), and [the bounded developer loop](docs/DEVELOPER_LOOP.md). Reconcile each new implementation ticket with `shipcheck.config.json` before starting. Design selection does not replace its current task or authorize paid review.

## License

This project is licensed under the MIT License. See LICENSE for details.
