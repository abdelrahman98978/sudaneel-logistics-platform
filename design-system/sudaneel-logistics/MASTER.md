# Sudaneel Logistics - Master Design System (UI/UX Pro Max)

> **Standard Source of Truth**: Generated following UI/UX Pro Max design intelligence protocols.
> **Archetype**: Cyber-Maritime Sovereign Logistics & 3D Spatial Intelligence.
> **Platform Target**: Web (Desktop/Mobile), PWA, Responsive Touch & Keyboard accessible.

---

## 1. 10-Tier UX Priority Hierarchy

| Priority | Category | Status | Enforcement in Sudaneel |
|----------|----------|--------|--------------------------|
| **1. Accessibility** | CRITICAL | Passed | Contrast >= 4.5:1 for body text, 3:1 for large badges. All interactive elements have descriptive `aria-label` or visible text. Focus rings visible on tab navigation. |
| **2. Touch & Interaction** | CRITICAL | Passed | Touch targets >= 44x44px (`min-h-[44px]`). Tactile visual feedback on hover/press (`active:scale-[0.98]`, transition 200ms). |
| **3. Performance** | HIGH | Passed | Zero cumulative layout shift (CLS < 0.05). WebGL/Canvas 60fps rendering without React re-render thrashing. Lazy loading of heavy assets. |
| **4. Style Selection** | HIGH | Passed | Hybrid: Tesla Minimalist Hero + Spatial Apple Vision Pro Glassmorphism + Sovereign Red Sea Logistics. Zero emoji used as structural navigation icons. |
| **5. Layout & Responsive** | HIGH | Passed | Fluid responsive grid with mobile-first breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`). Zero horizontal scroll. |
| **6. Typography & Colors** | MEDIUM | Passed | Bi-directional fonts (Cairo/IBM Plex for Arabic/Urdu/Farsi; Inter/Outfit for Latin). Semantic color tokens across all 14 supported languages. |
| **7. 3D & Animation** | MEDIUM | Passed | 3D Perspective tilt (`perspective(1000px) rotateX(...) rotateY(...) translateZ(20px)`), dynamic spotlight glow, and 60fps particle matrix. Reduced-motion respected. |
| **8. Forms & Feedback** | MEDIUM | Passed | Inline validation, clear placeholder hints, 1-click test pills, instant feedback toast system. |
| **9. Navigation Hierarchy** | HIGH | Passed | Predictable dual-mode navigation: Public 3D Showroom + Unified Operations OS with persistent bottom drawer and Command Palette (`Cmd+K`). |
| **10. Charts & Telemetry** | LOW | Passed | Accessible chart colors, tooltip legends, satellite GPS ping indicator, and live SLA percentages. |

---

## 2. Color Tokens Palette

```css
:root {
  /* Primary Sovereign Navy */
  --color-navy-deep: #032C70;
  --color-navy-dark: #011538;
  --color-navy-abyss: #010D26;
  --color-navy-glow: #0849A8;

  /* Sovereign Accent Gold */
  --color-gold-imperial: #D7A11E;
  --color-gold-hover: #E5A922;
  --color-gold-muted: rgba(215, 161, 30, 0.15);

  /* Interactive Electric Blue */
  --color-blue-electric: #2563EB;
  --color-blue-tesla: #3E6AE1;
  --color-blue-sky: #93C5FD;

  /* Maritime Cyan */
  --color-cyan-marine: #06B6D4;
  --color-cyan-glow: rgba(6, 182, 212, 0.25);

  /* Operational Status */
  --color-status-success: #14A44D;
  --color-status-warning: #D7A11E;
  --color-status-danger: #DC2626;

  /* Spatial Glass Surfaces */
  --glass-bg-card: rgba(3, 44, 112, 0.45);
  --glass-border-card: rgba(37, 99, 235, 0.25);
  --glass-blur-radius: 20px;
}
```

---

## 3. 3D Spatial Physics Specifications

1. **Card Hover Perspective**:
   - `perspective: 1000px;`
   - `maxRotation: 7deg;`
   - `transformStyle: preserve-3d;`
   - `translateZ: 20px;`
2. **Dynamic Cursor Spotlight**:
   - `radial-gradient(400px circle at ${x}% ${y}%, ${glowColor}, transparent 70%);`
3. **Simulation Canvas (WebGL/Canvas 2D)**:
   - Dedicated coordinate projection function `project3D(x, y, z, radY, radX)`.
   - Direct DOM text manipulation for frame counter (zero React state triggers per frame).
   - Mouse drag orbit controls with gyroscope dampening.

---

## 4. Internationalization & Bi-directional Typography

- **RTL Languages**: Arabic (`ar`), Urdu (`ur`), Persian (`fa`).
- **LTR Languages**: English (`en`), French (`fr`), Chinese (`zh`), Turkish (`tr`), Russian (`ru`), German (`de`), Amharic (`am`), Swahili (`sw`), Hindi (`hi`), Italian (`it`), Spanish (`es`).
- **Font Stack**:
  - `font-sans`: `var(--font-cairo), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  - `font-mono`: `"JetBrains Mono", "Courier New", Courier, monospace`

---

## 5. Quality Checklist Compliance

- [x] Vector icons only (Lucide React) — zero emojis used as structural navigation icons.
- [x] All touch buttons >= 44x44px.
- [x] Text contrast >= 4.5:1 against light and dark surfaces.
- [x] 60 FPS animation budget maintained.
- [x] Production build passes with 0 TypeScript and 0 lint errors.
