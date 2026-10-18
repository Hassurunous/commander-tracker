# Obsidian foundation validation

This records checks for the local `obsidian-frames` source on October 16, 2026.
It is evidence, not an owner acceptance of remaining coverage gaps.

## Life-update investigation

A regression harness queues poison +1, life +1, and poison +1 in one React event.
The old life handler replaces the array from its captured render and loses the
first queued poison increment. `src/LifeTracker.state.test.tsx` fails before the
fix and passes after it. The harness isolates state ownership by substituting the
presentation component; it does not imply a background click can bypass a modal.
The fix uses a functional updater and copies the changed player instead of
mutating an existing player. All counters retain their previous bounds.

## Browser checks

Run `npm run test:browser` with Microsoft Edge installed. The configuration starts
its own Vite server on port 4174 and runs headless installed Edge. It does not
reuse the user's browser or download a browser. Test code is under `test/browser/`.
The JavaScript test/config files are executed by Playwright; they are not covered
by the TypeScript projects or substantively linted by the existing ESLint setup.

The checks cover native modal state, a physical pointer action over a background
life control outside the dialog, unchanged life totals, Tab cycling within the
modal, real Escape dismissal, focus restoration, poison preservation on reopen,
320px layouts at 100% and 200% root font scaling, 48px targets, modal overflow,
and forced-colors keyboard focus. Root font scaling is a text-size simulation,
not physical iOS or Android accessibility settings validation.

Browser execution results are captured under ignored
`audit-reports/obsidian-frames/browser-final.log`. Initial test authoring placed
the pointer on the overlapping Done button; the corrected test asserts its
background point is outside the dialog before clicking. No application workaround
or assertion removal was used to resolve that test-authoring error.

Browser testing also found that native Tab from the last control could focus
browser chrome. Explicit forward/backward Tab wrapping now keeps focus within
the inspector; the browser regression covers both directions.

## Styling and remaining limits

`src/index.css` is attached directly as an authoritative source reference so the
AI reviewer can inspect tokens, focus, targets, forced colors and responsive CSS.
It remains in the task file list. Shipcheck's source collector may still mark CSS
as omitted even though the reference loader includes the exact file; disclose
that tool limitation instead of removing CSS from the requirements or scope.

Earlier rendered checks measured text contrast from 6.37:1 to 15.01:1 and button
edge/fill contrast 4.04:1 for sampled default pairs. These are sampled results,
not proof of every state. Earlier browser observation verified a five-digit life
story. Physical phone testing, screen reader behavior and actual platform text
settings remain unverified. PNG binary inspection remains omitted.

The previous AI suggestion that an already-modal `showModal()` call throws was
rejected against HTML Standard show-a-modal-dialog step 1: already open and modal
returns. The effect also closes during cleanup, and its return-focus callback is
stable. See https://html.spec.whatwg.org/multipage/interactive-elements.html#show-a-modal-dialog.

No API backend or direct API allowance is used. The authorized review command is
`shipcheck task --run-checks --ai codex --json`. Exit zero alone is not readiness.


## Latest browser execution after button-order correction

The owner authorized increasing ai.maxContextBytes and retrying the Codex review.
Controls now place decrement on the left and increment on the right. The
background-click test targets the right-hand life control outside the dialog.
Seven browser tests passed with process exit 0 after this correction. Thirteen
behavioral tests also passed. The captured output below is from this latest run.
Text contrast minimum was 5.02:1; control edge/fill 3.17:1; edge/surroundings
5.07:1; focus/surroundings 11.62:1. All tracker targets were 48x48px, glyphs
22x22px, and the minimum measured external clearance was 6px. Long names and
life values 0, -1, -99, 100, -999, 10000 fit at 320px with 100% and 200% root text.

```text

> commander-tracker@0.0.0 test:browser
> playwright test

[WebServer] (node:33504) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 7 tests using 1 worker

(node:33540) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok 1 test\browser\obsidian.spec.mjs:3:1 › native modal blocks background clicks, traps focus, and Escape restores the trigger (1.2s)
  ok 2 test\browser\obsidian.spec.mjs:39:5 › 320px layout at 100% root text retains targets and reflows (709ms)
  ok 3 test\browser\obsidian.spec.mjs:39:5 › 320px layout at 200% root text retains targets and reflows (688ms)
  ok 4 test\browser\obsidian.spec.mjs:58:1 › forced colors retains a visible keyboard focus outline (491ms)
tracker geometry 100 {"width":48,"height":48,"glyphWidth":22,"glyphHeight":22,"clearance":[211,9,6,6]}
tracker geometry 100 {"width":48,"height":48,"glyphWidth":22,"glyphHeight":22,"clearance":[211,9,6,6]}
tracker geometry 200 {"width":48,"height":48,"glyphWidth":22,"glyphHeight":22,"clearance":[211,9,28.796875,28.796875]}
tracker geometry 200 {"width":48,"height":48,"glyphWidth":22,"glyphHeight":22,"clearance":[211,9,28.796875,28.796875]}
contrast minimums {"text":5.020786679799142,"borderInside":3.1785124155028393,"borderOutside":5.077077258866614,"focus":11.623695140727218,"states":["default","hover","pressed","keyboard-focus","inspector-default","inspector-hover"],"samples":276}
  ok 5 test\browser\obsidian.spec.mjs:97:1 › rendered text, control edges, focus and tracker clearance meet the approved thresholds (1.6s)
boundary layout 100 320px long name 0,-1,-99,100,-999,10000 passed
  ok 6 test\browser\obsidian.spec.mjs:151:5 › long names and boundary life totals fit at 320px with 100% text (1.5s)
boundary layout 200 320px long name 0,-1,-99,100,-999,10000 passed
  ok 7 test\browser\obsidian.spec.mjs:151:5 › long names and boundary life totals fit at 320px with 200% text (1.5s)

  7 passed (12.4s)

```

Source SHA-256 identities at execution:

- `src/LifeTracker.tsx`: `5ef2716ceab835616246e28abd6655337bebbe4a2043d3017e6360b9585b0932`
- `src/index.css`: `9970d83bee67323501b671b5ba06b58970bf9aa4aafcf355df10968b2a3797f5`
- `src/components/CounterControl.tsx`: `bfed4230a9c6ebdf350a32d40989e227e50579bbc2e8cc4fdc65c4f623a29255`
- `src/components/PoisonInspector.tsx`: `243a4d89047f8729c956f1d12d185fb7db813c48ca35cca3f2e1d660a4ede498`
- `src/components/PlayerFrame.tsx`: `ab671858e760e5124e7be14b30f833b1e5712537bcc07e7dbaaaf8a4c209786a`
- `src/test-fixtures/player-frame.tsx`: `0aa18319973ccc08d5c9f6908b21bf70307fda074f002a145e69e700f19392fc`
- `test/browser/obsidian.spec.mjs`: `c156be17b57508b89e2b6423b200de127dfffd94cd3a39fd0d752a695aba8cd9`
- `playwright.config.mjs`: `4ea204a039086134d79ab93fa03e5fc7686d7d7e71c9d69db57a0a87608e7fc1`

## Responsive board, paging, Focus and Tabletop verification — October 18, 2026

Executed against application source at commit `ecc7a67` (review configuration/documentation changes only since that commit), Windows and Node 22. The earlier M1 record above is historical.

- `shipcheck audit . --run-checks --json`: lint, types-app, types-node and behavior all passed; 73 tests across seven files.
- `npm run test:integration`: fresh production build and artifact integration passed.
- `npm run test:browser`: all 21 tests passed in 23.6 seconds, exit 0.
- `npm run build-storybook`: build completed successfully, exit 0.

Browser execution includes the complete seven-test Obsidian suite, six responsive tests (2/4/6/12 players, four-up 844×390, density fallback 736×360, Focus at 390×844 and 320×568), five setup tests and three Tabletop tests. Checks cover contiguous paging and page boundaries, isolated life/poison edits, roster selection/focus, Adjust focus, modal focus return, enlarged text and rotated controls. Test source and logs document the exact assertions; this is browser automation, not physical-phone or screen-reader validation.

Storybook includes TwoPlayers, FourPlayers, TwelvePlayers, FocusRoster and TwoSeatPaging plus TabletopFour, TabletopTwo and TabletopPaging. Shared PlayerRoster and TableMenu stories are also built. The build verifies example compilation; it is not a claim that Storybook interaction tests were executed.

Raw execution logs: `audit-reports/m2-responsive-resume/cycle4-browser.log`, `cycle4-storybook.log`, `cycle3-audit.json` and `integration.log`. These are ignored local records.

Source SHA-256 identities at browser/Storybook execution:

- src/LifeTracker.tsx: 33b62feb6d78720483c471c6c85cc9d083917d77a96a28feede01dc85456c5ec
- src/LifeTracker.stories.tsx: bc84651362c665451091e291aa0b1a83b9f545627006b119153ccb76e273d816
- src/LifeTracker.responsive.test.tsx: 6e3e4cfac4e3fe60eef698f9e4e7a8aae0ca43f0da43fccda993e6446a05ae89
- src/layout.ts: 0860cacf844a35f522a18adc818b24d28b8c261e714fa28ebbe2cdda30c5b9e5
- src/index.css: 90a45ef13f77caf277ea9207f6366159dd4c276a1455071619356b8c42c7f4a5
- test/browser/responsive.spec.mjs: 01bbfd5c90f22d04633e1dd458fbc746adc66eb1c6ea600b41660c531af1baee
- test/browser/table-setup.spec.mjs: 587513226af5a4d792c3fa2e49fe219b789e46762ebb4f82c96d8e69485dac1b
- test/browser/tabletop.spec.mjs: 4e0d12e34d5087452528e5362949605cfe9596c44c00d4cdb982d20591e70b07
