<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- [PRINCIPLE_1_NAME] -> I. Local-First Ring Operation
- [PRINCIPLE_2_NAME] -> II. Authoritative Scoring and Auditability
- [PRINCIPLE_3_NAME] -> III. Secure Pairing and Secret Boundary
- [PRINCIPLE_4_NAME] -> IV. Validation and Recovery Gate
- [PRINCIPLE_5_NAME] -> V. Documentation-Backed Tournament Delivery
Added sections:
- Operational Reliability Standards
- Delivery Workflow and Quality Gates
Removed sections:
- None
Templates requiring updates:
- .specify/templates/plan-template.md - reviewed, no changes required
- .specify/templates/spec-template.md - reviewed, no changes required
- .specify/templates/tasks-template.md - reviewed, no changes required
Follow-up TODOs:
- Add pairing protocol details when LAN remotes are implemented
-->

# TKD-Software Constitution

## Core Principles

### I. Local-First Ring Operation
The scoring flow for an active competition ring MUST continue operating without
internet connectivity. Athlete selection, judge deductions, score calculation,
result publication, and local recovery MUST remain available from the ring host
even when remote sync is degraded or unavailable.

### II. Authoritative Scoring and Auditability
Each ring MUST have exactly one authoritative scoring state. Judge inputs,
deductions, resets, and publication events MUST be attributable to a specific
judge slot or operator action and SHOULD remain reviewable after the event.
Client remotes and displays MUST reflect ring-host state rather than invent or
recalculate their own truth.

### III. Secure Pairing and Secret Boundary
Public UI configuration and demo data MAY live in the client code when safe to
publish, but secrets, cloud credentials, provider tokens, and signing material
MUST never be committed to the repository. Future judge remotes MUST use a
documented pairing or authorization flow before they can affect live scoring.

### IV. Validation and Recovery Gate
Every change intended for merge, handoff, or deployment MUST pass
`npm run validate` on Node 22 or newer. A change is incomplete if it breaks the
prototype build, test suite, linting, type checks, repository validation, or
secret leak heuristics. Work touching live scoring logic SHOULD include at least
one targeted test covering the changed rule or failure path.

### V. Documentation-Backed Tournament Delivery
Changes that alter scoring rules, operator workflow, architecture, deployment,
or recovery expectations MUST update the relevant documentation in `README.md`,
`ARCHITECTURE.md`, `SECURITY.md`, or the active `specs/` artifact in the same
unit of work. Meaningful scope changes SHOULD flow through `speckit` artifacts
so the rationale remains auditable.

## Operational Reliability Standards

- The ring host MUST support a manual fallback path if remote judge devices are
  unavailable.
- Score calculations MUST be deterministic and cover configured judge counts.
- Recovery behavior after refresh, restart, or transient device loss MUST be
  specified before live-event deployment.
- Cloud sync MUST be additive and asynchronous; it must not block active scoring
  for the current athlete.

## Delivery Workflow and Quality Gates

- Use the active feature directory under `specs/` for meaningful work.
- Validate non-trivial scoring changes with unit tests before review.
- Document new device, sync, or deployment assumptions before implementation.
- Treat operational clarity for judges and organizers as part of product
  quality, not optional polish.

## Governance

This constitution supersedes conflicting informal practices for this repository.
All reviews and planning artifacts MUST check compliance against these
principles. Amendments require a documented rationale, an impact review across
Spec Kit templates and runtime guidance, and a semantic version update:

- MAJOR for incompatible governance changes or principle removal
- MINOR for new principles or materially expanded requirements
- PATCH for clarifications that do not change expected behavior

Compliance exceptions MUST be explicit in the relevant planning artifact and
must justify why a simpler compliant path was rejected.

**Version**: 1.0.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-05-31

