# Checks and build-artifact integration

Install locked project tools with `npm ci --ignore-scripts --no-audit --no-fund` and run commands from the repository root using Node on PATH. Validation uses Windows x64 and Node 22.

## Fast routine audit

Shipcheck is a separately installed tool. Confirm your trusted installation with `shipcheck --version` and `shipcheck --help`. If needed, invoke its built CLI using `node <trusted-shipcheck-checkout>/dist/src/cli.js` instead of `shipcheck`.

- `shipcheck audit . --json` loads configuration without executing checks. The three required checks are skipped and the exit is 2 (missing authorization).
- `shipcheck audit . --run-checks --json` executes existing ESLint and both actual TypeScript projects: tsconfig.app.json for src and tsconfig.node.json for vite.config.ts. Exit 0 means these configured checks passed, not general correctness.

Routine audits do not build or run artifact integration tests. The root reference-only TypeScript configuration is not used as a substitute for checking both projects. Save report stdout, stderr and process exits outside the repository.

## Explicit build-artifact integration

- `npm run test:integration` runs the existing production build followed by the Node built-in test runner. The test does not run if the build fails.
- `npm run test:artifacts` tests an existing dist directory. It does not rebuild, so use the integration command when freshness matters.

The test reads dist/manifest.webmanifest, requires a nonempty icons array, and checks that every declared icon resolves to a local file within dist. Both resolved paths and symlink targets must remain inside dist. Local root-relative and relative URLs are supported; query strings/fragments are ignored for filesystem lookup. Remote/data URLs are rejected. Icon additions and order changes are allowed; no fixed filenames, entry count, sizes, MIME types or original-byte comparisons are imposed.

This is a build-artifact integration check, not browser installability or full image validation. It does not decode images, validate dimensions or MIME types, test hosting routes, or exercise the UI, persistence or service-worker behavior. The existing ESLint configuration does not substantively lint the .mjs test, and the TypeScript projects do not include it. Node executes it explicitly through the artifact scripts.

A failing artifact assertion is reported by the test runner with a nonzero exit (normally 1). A failed build also returns nonzero, but appears in the build stage and prevents the test stage. Interpret the stage/output rather than assuming every nonzero exit is an icon assertion.

To reproduce a missing-file failure, after a successful build temporarily move a declared icon from generated dist to a safe temporary location, run test:artifacts expecting failure, and restore it in a finally block. Do not modify source assets or criteria. Re-run test:artifacts after restoration.

The production build writes dist (including manifest/service worker) and may create tool caches under node_modules; TypeScript build information is also stored under node_modules. Existing Git ignores exclude these generated locations and Shipcheck inherits those ignores. External commands are authorized execution, not sandboxed by Shipcheck. No fixing flags, remote analysis or paid API calls are configured. Binary text-inspection omissions and partial audit coverage remain visible even when routine checks pass.
