<!-- GENERATED - do not edit. Sources: prototype/gallery + prototype/tokens.json + context/PRD.md §3.
Re-emit: python3 skills/prototype/scripts/emit_handoff.py --target <project>
Hand decisions belong in prototype/DECISIONS.md, never here. -->

# Handoff - orbit

Generated 2026-11-03 - tokens 1.2.0 (APPROVED) - screens 5 - components 17

## Contract

1. Source of truth: `prototype/tokens.json` + `prototype/gallery/`. "Matches the prototype" is a measured claim: computed styles or script output (lint_tokens.py, browse_hub.py), never eyeballed.
2. prototype/gallery/ markup is a showcase. Real components render state from real interactions - never paste demo blocks or demo alerts into app code.
3. Token values come from `prototype/tokens.json`. Generate or diff-check any mirror against it - never hand-type values.
4. A task is done when its gates pass, not when the agent attests done. Deviations get one `prototype/DECISIONS.md` file row each.

## Screens

| Screen | AC | Journey step | File |
| --- | --- | --- | --- |
| s1 | AC-1 | Đăng nhập orbit | gallery/screens/s1.html |
| s2 | AC-5, AC-6 | Dashboard | gallery/screens/s2.html |
| s3 | AC-2 | People | gallery/screens/s3.html |
| s4 | AC-3 | Journal | gallery/screens/s4.html |
| s5 | AC-4 | Tasks | gallery/screens/s5.html |

## Components inventory

| Component | States | Patterns |
| --- | --- | --- |
| BirthdayRow | - | - |
| BoardColumn | - | - |
| Button | default, disabled, sending | - |
| Chip | default | - |
| EntryComposer | default | - |
| Input | default | - |
| JournalRow | - | - |
| Nav | - | - |
| PersonCard | - | - |
| PersonRow | default | - |
| Row | default | - |
| SearchInput | default | - |
| SignInForm | default | - |
| StatTile | - | - |
| StatePattern | - | empty, error, loading |
| TaskRow | - | - |
| ThemeSwitch | - | - |

## Tasks

| Task | Screens | AC | Components | States | Patterns | Gates |
| --- | --- | --- | --- | --- | --- | --- |
| T-s1 | s1 | AC-1 | Button, SignInForm, ThemeSwitch | default | - | lint_tokens clean; emit_handoff --check clean; measured match vs gallery |
| T-s2 | s2 | AC-5, AC-6 | BirthdayRow, JournalRow, Nav, StatTile, TaskRow, ThemeSwitch | - | - | lint_tokens clean; emit_handoff --check clean; measured match vs gallery |
| T-s3 | s3 | AC-2 | Nav, PersonCard, PersonRow, ThemeSwitch | - | - | lint_tokens clean; emit_handoff --check clean; measured match vs gallery |
| T-s4 | s4 | AC-3 | Button, EntryComposer, JournalRow, Nav, StatePattern, ThemeSwitch | default | empty | lint_tokens clean; emit_handoff --check clean; measured match vs gallery |
| T-s5 | s5 | AC-4 | BoardColumn, Nav, TaskRow, ThemeSwitch | - | - | lint_tokens clean; emit_handoff --check clean; measured match vs gallery |
