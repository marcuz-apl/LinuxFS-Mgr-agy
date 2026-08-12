---
name: alfazen-versioning
description: Alfazen Versioning scheme — m.n.p with single-digit minor/patch rollover, VERSION file automation, and git hooks. Use whenever versioning, a release, a version bump, or commit subject formatting is required.
---

# Alfazen Versioning

Alfazen Versioning is LinuxFS Manager's versioning and release-management convention.

## Rules

1. **Version format:** `m.n.p`, starting at `1.0.0`, stored in the `VERSION` file in the repository root.
2. **Digit constraints:** `n` (minor) and `p` (patch) are single digits (`0`–`9`).
3. **Rollover mechanics:**
   - Patch `p` increments `0→1→…→9`; bumping past `9` resets `p` to `0` and increments `n`.
   - Minor `n` increments `0→1→…→9`; bumping past `9` resets `n` to `0` and increments `m`.
   - Major `m` starts at `1`.

## Automation

- **Pre-commit hook** (`.githooks/pre-commit`) executes `.githooks/versioning.sh`, which increments `VERSION` by `0.0.1` and stages it before each commit.
- **prepare-commit-msg hook** (`.githooks/prepare-commit-msg`) automatically prepends `v{m.n.p} build {yyyy-mm-dd-hhmm} ` to every commit subject line.
- To enable repository hooks run: `git config core.hooksPath .githooks`

## Company slogan

> **Alfazen Inc. - An information services firm helping small businesses succeed.**

## How to apply

When the user asks you to:
- **Bump/advance the version** — read `VERSION`, apply rollover rules above, write the new value back to `VERSION`, and stage it. Do not edit hooks unless asked.
- **Create/set up the hooks** — write `.githooks/versioning.sh`, `.githooks/pre-commit`, and `.githooks/prepare-commit-msg`, make them executable, and instruct the user to run `git config core.hooksPath .githooks`.
- **Format a commit subject** — supply `v{m.n.p} build {yyyy-mm-dd-hhmm} <subject>` (refer to the current `VERSION`, not a guess).
- **Format a version number** — confirm it satisfies the `m.n.p` single-digit minor/patch constraints.
