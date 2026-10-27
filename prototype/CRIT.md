# CRIT — orbit prototype

6 roles × 2 waves (Playwright, measured) · 2026-10-27 · server :4173
Verdict: **0 P0 · 14 P1 · 12 P2** → tất cả P1 đã fix; P2 đã fix phần rủi ro cao. Screenshots: `playwright-shots/`.

## Wave 1 — measurement

### a11y (3 themes)
- [P1] input + theme-switch border vs surface 1.31–1.44:1 < 3:1 — **FIX**: `--color-border` nâng per-theme (cool #87909C, warm #8B8478, night #6B7484) → ≥3:1
- [P1] nav links 21px < 24px AA — **FIX**: padding var(--space-2) → ~37px
- [P2] disabled opacity 0.6 → 2.87:1; ghost border 1.26; tap 40–42px — disabled giữ (WCAG exempt), tap đã cải qua padding

### brand (3 pages × 3 themes)
- Token law xanh: mọi giá trị render khớp tokens.json, theme switch verified
- [P2] h1 700 untokenized — **FIX**: `--type-weight-strong: 600` token, mọi weight đi qua token
- [P2] `--type-family-display` dead — **FIX**: night-focus brand/h1/h2 dùng display family
- [P2] favicon 404 — **FIX**: `rel=icon data:,` mọi trang

### consistency (6 pages, 1 set)
- Scales sạch: 14/16/20/26 · 2/4/8/12/16/24/32 · radius 4/8/999 · 1px
- [P1] s5 board h3 14px < row-title (inversion) — **FIX**: h3 = base/strong, cùng role
- [P1] data-state=default 3 nghĩa — **FIX**: bỏ data-state khỏi chrome (nav/theme-switch)
- [P1] sending == disabled — **FIX**: sending giữ accent + cursor:progress; disabled mới opacity .6
- [P1] data-pattern chỉ ở gallery — **FIX**: s4 thêm empty pattern (shape dùng chung)
- [P1] empty == loading — **FIX**: loading = solid accent border + pulse animation

## Wave 2 — destruction

### smallscreen 360×800
- [P1] .row-sub bị chip ép → "12-09" gãy giữa số (s2/s3) — **FIX**: `.row{flex-wrap}` + chip flex-shrink:0 + row-sub nowrap
- [P2] tap 31–42px — cải thiện một phần (chips 39px), chấp nhận cho prototype
- 0 overflow, nav ≤720px ẩn đúng thiết kế

### content (hostile injection)
- [P1] .row-title 60-char no-space → page blowout (6 vị trí) — **FIX**: `overflow-wrap: anywhere` + chip guard
- [P2] input value clip im lặng — chấp nhận (chuẩn input)

### firsttime (journey)
- [P1] s1 3 trạng thái đè nhau — **FIX**: chỉ còn default + chú thích trạng thái xem ở gallery
- [P1] s1 jargon (ClerkSignIn) — **FIX**: "Đăng nhập bằng email duy nhất của bạn"
- [P1] s2 dữ liệu mâu thuẫn (3 vs 2 sinh nhật; ngày=sau 3 ngày; quá hạn mù) — **FIX**: số khớp (2 sinh nhật; 12-12 sau 3 ngày; 2 dòng quá hạn chip-danger; stat "5 mở (2 quá hạn)")
- [P1] s4/s5 nav trùng + mất People — **FIX**: nav đầy đủ
- [P1→P2 gap] journey thiếu "ghi nhật ký" — **FIX**: s4 thêm EntryComposer
- [P2] jargon tsvector/trgm — **FIX**: "tìm theo ý chính"; nhắc Enter
- [P2] error không nói cách sửa — **FIX**: s1 chú thích hành động
- [P2] theme switch chưa labeled — chấp nhận (pill Cool/Warm/Night + aria-pressed)

## Kết luận
Gallery + screens đạt: token law 3 themes, AA contrast enabled text + UI parts, no overflow 360px, journey đầy đủ. `prototype/` là implementation spec cho build thật.
