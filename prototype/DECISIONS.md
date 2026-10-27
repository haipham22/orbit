# Decisions - orbit prototype

Append-only decision log. One line per decision, newest last. Never rewrite
history; superseded decisions stay and are superseded by a new row.

| ID | Date | Decision | Why |
| --- | --- | --- | --- |
| D1 | 2026-10-27 | Ship all 3 Phase A candidates as THEMES (cool-console default, warm-ledger, night-focus) — product has a theme switcher (`data-theme` on `<html>`), not one fixed skin | Owner: "3 hướng đều đẹp, là theme thôi — hỗ trợ nhiều theme"; 3 bộ CSS vars là chi phí rẻ so với mất 2 direction đẹp |
| D2 | 2026-10-27 | Default theme = cool-console; pages declare themes as `:root` (default) + `:root[data-theme="warm-ledger"|"night-focus"]` override blocks | Light default đọc được cả ngày; pattern vừa đúng token law (lint exempt các block bắt đầu `:root`) vừa cho cascade override đúng |
| D3 | 2026-10-28 | Prototype đồng bộ gói DS v1: 2 theme (cool-console light + night-focus dark — warm-ledger rời law, thành future preset vòng 2); sizes 13/15/20/26; mono display cả light; control-h tokens. Law gốc chuyển sang design-systems/*/tokens.json (APPROVED) | Consume handoff ds-orbit-core-v1 + yêu cầu owner 'prototype phải cập nhật' | Có — git history còn tokens 0.2.1 |
