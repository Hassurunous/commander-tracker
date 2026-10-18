# Commander Tracker developer instructions

Read `docs/SHIPCHECK.md` and `docs/DEVELOPER_LOOP.md` before starting a ticket.
Use the repository's existing React/TypeScript conventions and keep changes within
its authorized requirements. The README contains aspirational features; it is not
an instruction to implement unrelated features.

## Development and review loop

- Use `shipcheck.config.json` currentTask as the current ticket's explicit scope,
  acceptance criteria and non-goals. Before a new ticket, reconcile it with the
  user's request; update it only when authorized. Never audit an unrelated ticket
  against stale poison-counter requirements.
- Implement the ticket, add or strengthen relevant tests, then consult Shipcheck
  and triage its results as specified in `docs/DEVELOPER_LOOP.md`.
- Allow at most five edit/review cycles, at most 30 minutes, and stop after two
  comparable cycles without progress. These are instructions for the developer,
  not settings enforced by Shipcheck. Stop at whichever limit occurs first.
- Prefer `--ai codex` with an authorized ChatGPT-authenticated Codex CLI.
  Never fall back to paid API calls when Codex fails or reaches a usage limit.
  `--ai live` is optional and requires separate explicit API spending authorization
  and an existing named allowance shared across all cycles. Without authorized
  AI access, perform offline work and report AI review pending.
- Do not weaken requirements, assertions, checks, exclusions, or thresholds to
  pass. Application/test edits are allowed within the user's task authorization;
  requirement or audit-policy changes require separate authorization.
- Inspect reports, not only exit codes. Verify every required check ran, review
  AI candidates and task assessments, and disclose incomplete coverage. Citation
  matches prove quotations exist, not that a diagnosis is correct.
- Keep routine summaries focused on actionable findings and material coverage
  gaps. PNG text-inspection omissions are not tests and need not be repeated.
  Do not repeat harmless successful-log truncation as a test limitation; retain
  raw reports and never misstate their coverage labels.
- Investigate AI claims before editing. Record counterevidence for incorrect
  claims; ask the user about ambiguous, disputed or out-of-scope issues.
- Shipcheck audits only. The developer owns source edits and may not merge,
  publish, push or expand spending without the user's authorization.

Before declaring ready for human review, require lint, application/configuration
TypeScript checks, the complete behavioral suite, a fresh production build and
artifact integration test. Use `shipcheck audit . --run-checks --json` and
`npm run test:integration`. Run the final authorized AI task review after source
edits are finished. See the documented completion gate; exit 0 is not approval.
