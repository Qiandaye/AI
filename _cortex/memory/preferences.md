---
kind: "codex-memory"
schema_version: "3"
category: "preferences"
updated_at: "2026-07-16T10:00:00+08:00"
managed_by: "codex"
---

# Preferences

## Identity

- **Name**: Qian Daye (钱大爷)
- **Role**: Video content creator (Tech + AI), Indie developer side-hustle
- **Tools**: Codex, Obsidian, Remotion/HyperFrames

## Philosophy

- Automate anything done 3+ times
- Explain why decisions matter and user impact
- Connect implementation to product value, maintainability, reliability
- Call out wrong directions with better alternatives

## Communication

- Chinese for conversation, explanation, planning, review, summary
- English for code: variable names, file names, commit messages, PRs, README, technical docs, UI copy
- Conclusion first, then reasoning
- Fact-based; no filler phrases like "sure thing" or "great question"
- Explain why and UX impact, not just how-to
- Don't ask if continuing when next step is unclear
- Only ask when: goal unclear, permissions missing, real risk of damage

## Core Principles

- Keep it simple. Cut reasons, skip surface-level stuff.
- Prefer plain, maintainable over clever but hard to maintain.
- Precise edits only. No unrelated refactors.
- No speculative features, abstractions, configs, or dependencies.
- Every line traces back to a user goal.

## Tech Preferences

- Complex work: Specify -> Plan -> Task -> Execute -> Verify
- Coding/bugfix: use karpathy-guidelines
- Avoid over-engineering: use ponytail
- Frontend: static pixel-fidelity first, screenshot QA, then real data integration
- Search: rg for content, fd for files
- TypeScript: enums/string literals, no magic numbers
- Functional/declarative patterns preferred over classes

## Memory Rules

- Update this file and decisions.md for long-term info
- Never store secret values; only note where they are configured
- Don't copy obvious code facts
- Report MEMORY.md updates before final answer