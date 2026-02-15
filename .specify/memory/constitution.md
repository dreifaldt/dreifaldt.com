<!--
Sync Impact Report
==================
- Version change: (none) → 1.0.0
- Added principles:
  - I. Type Safety
  - II. Simplicity First
  - III. Performance
  - IV. Accessibility
- Added sections:
  - Quality Gates
  - Governance
- Removed sections: (none, initial version)
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no update needed
    (Constitution Check section is generic; will be filled per-feature)
  - .specify/templates/spec-template.md — ✅ no update needed
    (No mandatory section changes required by these principles)
  - .specify/templates/tasks-template.md — ✅ no update needed
    (No new principle-driven task types required)
- Follow-up TODOs: none
-->

# dreifaldt.com Constitution

## Core Principles

### I. Type Safety

All code MUST use strict TypeScript. The `any` type is forbidden — no
exceptions. Every function, component prop, and variable MUST be fully
typed. The project's `tsconfig.json` extends `astro/tsconfigs/strict`
and this strictness level MUST NOT be relaxed.

**Rationale**: Strict typing catches bugs at compile time, improves
editor tooling, and serves as living documentation for component
contracts.

### II. Simplicity First

Every feature MUST use the simplest implementation that satisfies the
requirement. YAGNI applies: do not add code, abstractions, or
dependencies for hypothetical future needs. Prefer fewer files over
many small ones. Prefer inline solutions over extracted utilities when
the logic is used once. New dependencies MUST be justified — the
default answer is "no".

**Rationale**: A small personal site stays maintainable only if
complexity is actively resisted. Every abstraction is a liability.

### III. Performance

The site MUST be static-first. Pages MUST ship zero or minimal
client-side JavaScript — use Astro's default static rendering and only
add `client:*` directives when interactivity is required. Images MUST
use optimized formats and appropriate sizing. Lighthouse Performance
score SHOULD remain above 90 on mobile.

**Rationale**: Fast page loads directly affect user experience and SEO.
A personal site has no excuse for being slow.

### IV. Accessibility

All pages MUST use semantic HTML elements (`nav`, `main`, `article`,
`header`, `footer`, etc.) over generic `div`/`span` where applicable.
Interactive elements MUST be keyboard-navigable. Color contrast MUST
meet WCAG 2.1 AA minimums. Images and icons MUST have appropriate alt
text or aria labels. Lighthouse Accessibility score SHOULD remain
above 90.

**Rationale**: The site MUST be usable by everyone, including people
using assistive technologies.

## Quality Gates

All of the following checks MUST pass before code is merged:

- `astro check` (TypeScript validation)
- `eslint .` (linting)
- `prettier --check .` (formatting)
- `astro build` (production build succeeds)

If tests exist for a feature, they MUST also pass. Broken checks MUST
be fixed — not skipped, suppressed, or worked around.

## Governance

This constitution is the highest authority for development decisions on
dreifaldt.com. When a practice conflicts with a principle listed above,
the principle wins.

**Amendments**: Any change to this constitution MUST be documented with
a version bump, a date, and a brief rationale. Version follows semantic
versioning:

- **MAJOR**: Principle removed or fundamentally redefined
- **MINOR**: New principle or section added, or existing guidance
  materially expanded
- **PATCH**: Wording clarifications, typo fixes, non-semantic changes

**Compliance**: All PRs and code reviews SHOULD verify adherence to
these principles. Violations MUST be justified in the PR description
if intentional.

**Version**: 1.0.0 | **Ratified**: 2026-02-15 | **Last Amended**: 2026-02-15
