# Shipcheck setup

Run commands from the repository root with a trusted Node executable on PATH. Install the locked project tools with `npm ci --ignore-scripts --no-audit --no-fund`.

Shipcheck is a separate prerequisite, not a project dependency. Use a trusted installation and confirm `shipcheck --version` and `shipcheck --help`. If it is not on PATH, replace `shipcheck` below with `node <trusted-shipcheck-checkout>/dist/src/cli.js`. Do not use an unqualified npx download. This setup was validated with Shipcheck v0.1 (checkout commit 4b0c04616d37c928c494db6f8da6e422b78be522) on Windows x64 with Node v22.23.3.

## Run checks

- `shipcheck audit . --json` validates configuration without authorizing external checks. Required checks are skipped, with exit 2.
- `shipcheck audit . --run-checks --json` authorizes all four required checks. Save reports outside the repository, capturing stdout, stderr and the immediate process exit separately.
- `node scripts/check-pwa-icons.mjs` runs the fresh-build-and-icon check directly.
- `node scripts/verify-pwa-icons.mjs <output-directory>` verifies existing output without building. Use this for disposable fixtures; it cannot establish build freshness on its own.

`shipcheck.config.json` runs existing ESLint, tsconfig.app.json (src), tsconfig.node.json (vite.config.ts), and the required PWA build/icon helper. The root reference-only TypeScript config is not a substitute for checking both projects. Commands use project-relative tools and Node on PATH, without a shell.

## Build and asset verification

`scripts/check-pwa-icons.mjs` launches Vite with process.execPath, shell:false, a 180-second timeout and a 1 MiB output buffer. The outer Shipcheck check allows 210 seconds and 1 MiB output. Vite's --emptyOutDir replaces dist before a successful fresh build. Verification is skipped if the build fails; old output cannot substitute for a successful build.

`scripts/verify-pwa-icons.mjs` asserts exactly these manifest entries:

| src | sizes | type |
| --- | --- | --- |
| /icon-192x192.png | 192x192 | image/png |
| /icon-512x512.png | 512x512 | image/png |

It also requires byte equality between each src/assets original, public copy and deployed output. Missing files, invalid manifest JSON and mismatches are assertion failures (exit 1). Launch/I/O errors, nonzero build exits, signals and timeouts are operational failures (exit 2). Original assets define expected content; this does not protect against simultaneous changes to originals and copies. Review those source changes separately.

Shipcheck reads source, but authorized external checks are not sandboxed. The build replaces dist, including its manifest and service worker, and Vite may write transient configuration bundles under node_modules/.vite-temp. Tools may write caches under node_modules; npm ci replaces node_modules. Existing Git ignores exclude dist and node_modules, and Shipcheck inherits them. No fixing or source-rewriting commands are configured.

## Reproduce the negative test

After a successful build, copy dist into a temporary directory outside this repository. Run the direct verifier against that copy and expect exit 0. Delete only the copied icon-192x192.png and rerun: expect exit 1 with a missing-file ASSERTION. Restore that icon from dist and expect exit 0 again. Use a verified disposable path and leave application source and acceptance criteria unchanged.

## Validation and limits

Observed validation:

- Missing execution authorization: exit 2; all four required checks skipped.
- Authorized audit: exit 0; lint, both TypeScript checks and the fresh-build/icon check passed.
- A stale sentinel in dist was removed by the build.
- Valid, missing-icon and restored fixtures exited 0, 1 and 0 respectively.
- Source snapshots were unchanged across these runs.

The build emitted a nonfatal stale Browserslist-data warning. Launch/build/timeout classification is implemented, but those error branches were not fault-injected.

These checks do not establish UI correctness, persistence, browser installation, hosting behavior or security. No existing automated application test command was available. Existing ESLint rules do not substantively cover the new .mjs helpers, and the TypeScript projects do not include them; positive/negative executions exercise their asset-verification paths. Binary images are omitted from text inspection. The audit reported outcome=incomplete and generalQualityVerdict=not-established despite successful checks. No AI review, remote resources or API spending are configured.

Add real project tests as separate required checks with bounded time/output and their actual failureExitCodes. Preserve existing assertions, distinguish operational errors from assertion failures, and validate relevant negative cases. Exit 0 alone is not a general correctness verdict.
