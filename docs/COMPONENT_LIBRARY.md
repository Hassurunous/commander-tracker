# React component library

The UI is built from custom, typed React components shared by the application and
Storybook. Keep reusable UI in `src/components/`, with colocated `*.stories.tsx`
files. Components receive values and callbacks through props; the application
owns game state and rules. Do not create a separate imitation UI for Storybook.

Run `npm run storybook` and visit http://localhost:6006 to inspect individual
components, change their props with Controls, and use the Accessibility panel.
Run `npm run build-storybook` to generate the static workbench in
`storybook-static/`. Storybook uses a separate Vite configuration, without the
application's PWA plugin. Telemetry is disabled.

The initial library contains the app's shared CounterControl, with life, negative
life, large life, zero poison, and positive poison examples, plus the interactive
two-player LifeTracker. Use Reset controls for args-driven examples; remount the application story to reset its internal game state. The
accessibility panel is a review aid, not a passing accessibility certification.

For future UI tickets, add stories for relevant normal, boundary, and interaction
states alongside the production components. Apply the approved design tokens to
the same components. Storybook complements behavioral tests, rendered browser
checks, and Shipcheck; it does not replace the repository completion gate.

This setup does not implement the Obsidian visual milestone or new game features.


## Research findings and recommended practices

Researched October 16, 2026 against official React and Storybook documentation.
The installed baseline is React 18, TypeScript, Vite 6, and Storybook 10.6.2.
The recommendations below are project-specific applications of the linked
sources. They guide future authorized UI tickets; they do not change Shipcheck
policy, approve roadmap features, or authorize additional services or spending.

### Component boundaries and ownership

Build one production component and import it into both the app and its stories.
Prefer small components with a clear purpose, composing controls into player
panels and panels into the board. Extract a component when it has a meaningful
API or interaction to review; avoid wrappers for every decorative element.
Keep this as an internal library for now. A separate published package, monorepo,
and release pipeline would add overhead without an established consumer.
These organization choices are recommendations for this repository.

Give each piece of state one owner. Pass controlled values and event callbacks
into reusable controls. Keep transient UI state local when appropriate; keep
player totals and rules in the game layer. Do not copy incoming values into
local state merely to display them, because later prop changes can diverge.
Source: [React: sharing state](https://react.dev/learn/sharing-state-between-components)
and [choosing state structure](https://react.dev/learn/choosing-the-state-structure).

Render without mutating props, shared fixtures, or external state. Apply changes
through event handlers and immutable model operations. For future expandable
tables, use stable player and tracker identities rather than labels or changing
positions. This supports repeatable isolated rendering and preserves ownership
through layout changes. Sources: [keeping components pure](https://react.dev/learn/keeping-components-pure)
and [preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state).

### Typed APIs and discoverable stories

Use explicit TypeScript props for values, accessible labels, supported variants,
and callbacks. Prefer names that describe the event, such as `onChange(delta)`.
Document who applies bounds and whether a callback requests or commits a change.
Avoid overlapping boolean flags that permit contradictory component states.

Keep stories beside their component. Use the existing Component Story Format
with `satisfies Meta<typeof Component>` and `StoryObj<typeof meta>` so required
props and story args remain checked. Name stories by the state or task, not
arbitrary numbering. Use `Components/…` for reusable pieces and `Application/…`
for composed workflows. TypeScript inference can populate Controls; configure
`argTypes` only to clarify descriptions, options, or unsuitable controls.
Source: [Storybook: TypeScript stories](https://storybook.js.org/docs/writing-stories/typescript).

Put common defaults in meta args and override only differences in each story.
Use args for editable inputs, parameters for story configuration, and globals
for shared environment choices. For controlled demos, use `useArgs` so clicking
the component and editing Controls update the same value. A standalone story
can also leave values fixed and expose callback calls for inspection. Never
imply that a static example commits application state.
Source: [Storybook: args](https://storybook.js.org/docs/writing-stories/args).

### State coverage and realistic composition

Choose a concise set of stories that reveals risk, rather than every possible
prop combination. For Commander Tracker, use this coverage plan as components
are implemented:

| Component or workflow | Useful states to expose |
| --- | --- |
| Counter control | Default, zero, negative life, large totals, long player labels |
| Icon entry | Accessible player name, focus, pressed/open state, adequate target padding |
| Player frame | Different values, long names, narrow container, inward identity section |
| Inspector or menu | Closed/open, keyboard dismissal, focus return, background interaction blocked |
| Board | Approved player counts, portrait/landscape, layout changes preserving values |

Only demonstrate implemented states; do not add inert controls for future
features. Keep fixtures deterministic: fixed identities and data, no random
initial values, real network dependency, or shared mutable singleton state.
When future components need providers or layout context, use decorators to
supply those prerequisites instead of weakening the production API. Keep
provider scope as narrow as needed and reset mock state between stories.
Source: [Storybook: decorators](https://storybook.js.org/docs/writing-stories/decorators).

The current counter story contains a small poison-floor simulation. It is a
review harness, not evidence for the production rule. Future domain scenarios
should reuse production model operations or render the application container;
otherwise a duplicated rule could pass in a story while the app is wrong.

### Styling and accessibility

Share production styles and approved design tokens with Storybook. Use semantic
CSS variables for surfaces, text, spacing, borders, and focus rather than
scattering literal values. Prefer component-scoped classes; keep global CSS
limited to deliberate shared foundations. These are recommended project
conventions, not claims that the current template stylesheet meets the design.

Inspect components both alone and inside their real parent layout. Test narrow
containers, large numbers, long text, text enlargement, and implemented
orientation modes. A viewport preset alone does not establish physical phone
usability or correct Tabletop interactions.

Use semantic native controls with meaningful names, visible focus, and keyboard
operation. For this product, retain the documented 48px targets and WCAG 2.2 AA
objective. Review actual rendered contrast, focus order, enlarged text, reduced
motion, and forced colors. Inspect dialogs for focus management and escape
behavior. Automated accessibility checks complement manual checks and assistive
technology testing; they do not establish conformance on their own.
Source: [Storybook: accessibility testing](https://storybook.js.org/docs/writing-tests/accessibility-testing).

### Testing: each layer answers a different question

| Layer | What it establishes | Current project status |
| --- | --- | --- |
| Model and rendered component tests | Rules, boundaries, callbacks, player isolation | Vitest suite exists and remains required |
| Story interaction tests | A rendered scenario behaves as asserted | No authored `play` assertions or automated Storybook test integration yet |
| Accessibility checks | Detectable accessibility issues in the rendered state | Addon available; `a11y.test: 'todo'` is non-blocking |
| Visual regression | Unexpected appearance changes against reviewed baselines | No screenshot baseline service or automated comparison configured |
| Storybook static build | Stories and workbench bundle successfully | `npm run build-storybook` available; not a Shipcheck required check |
| App integration and device checks | Production artifacts and actual application/device behavior | Existing completion gate still applies |

For future story interaction tests, write asynchronous `play` functions using
role/name queries, user-event interactions, and assertions on visible results.
Use explicit `fn()` callback spies from `storybook/test` when callback assertions
are needed. Test an action's effect and isolation, not just successful rendering.
Do not treat an empty Interactions panel as behavioral coverage. A test runner
must be configured before claiming these stories execute in CI.
Source: [Storybook: interaction tests](https://storybook.js.org/docs/writing-tests/interaction-testing).

Visual regression can catch spacing and styling changes that behavioral tests
miss. Keep viewports, fonts, fixtures, and animations deterministic, then review
baseline changes intentionally. Never accept screenshots merely to make a job
pass. Selecting a local tool or hosted provider is a future decision; this guide
adds neither a service nor a paid dependency.
Source: [Storybook: visual tests](https://storybook.js.org/docs/writing-tests/visual-testing).

### Documentation and the owner's review workflow

Autodocs generates an API/reference starting point from stories and component
metadata. Add concise prose explaining purpose, intended use, state ownership,
keyboard behavior, bounds, and limitations; generated props alone do not explain
the contract. Use MDX only when a more substantial usage guide is warranted.
Source: [Storybook: Autodocs](https://storybook.js.org/docs/writing-docs/autodocs).

For a component review:

1. Run `npm run storybook`, choose the component, and read its Docs entry.
2. Inspect each named state; change editable props with Controls and reset them
   before comparing examples.
3. Exercise pointer and keyboard paths, then inspect the Accessibility panel.
4. Check the component inside its application story and relevant narrow layout.
5. Record the story name, viewport, inputs, expected behavior, and observed issue
   so feedback is reproducible.

For future implementation tickets, include relevant stories in the change,
retain meaningful behavioral assertions, type-check stories/configuration, and
verify the static Storybook build alongside the existing app completion checks.
Any change making new checks mandatory, promoting accessibility failures to a
blocking gate, or adding visual-test infrastructure needs the repository's
separate audit-policy authorization. Do not silently alter current thresholds.

### Recommended next improvements

During the approved Obsidian ticket, add shared frame and tracker-entry components
with focused stories, reuse the selected tokens, and document keyboard behavior.
Keep production rule tests authoritative. As a separately scoped follow-up,
consider Storybook interaction-test automation and reviewed visual baselines.
The current setup provides manual component inspection; those automation layers
remain recommendations, not completed work.
