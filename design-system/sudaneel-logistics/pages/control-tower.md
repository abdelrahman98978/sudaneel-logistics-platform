# Control Tower Page Overrides

> **PROJECT:** Sudaneel Logistics
> **Generated:** 2026-09-03 13:16:17
> **Page Type:** Dashboard / Data View

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1400px or full-width
- **Grid:** 12-column grid for data flexibility
- **Sections:** Hero with video background > Key features overlay > Benefits section > CTA

### Spacing Overrides

- **Content Density:** High — optimize for information display

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Use an overlay strong enough for text contrast. Brand accent for CTA. Light text only when the measured contrast passes.

### Component Overrides

- Avoid: Auto-advance slides without a stop control
- Avoid: Depend on animationend or transitionend for required state correctness
- Avoid: Keyboard traps or illogical tab order

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: Hover tooltips, chart zoom on click, row highlighting on hover, smooth filter animations, data loading spinners
- Animation: Provide previous next and play/pause; stop on focus or hover and when reduced motion is requested
- Animation: Cancel or replace prior motion; set the final semantic state directly and handle cancellation cleanup
- Accessibility: Keep tab order aligned with visual order and test every action without a pointer
- CTA Placement: Overlay on video (center/bottom) + Bottom section
