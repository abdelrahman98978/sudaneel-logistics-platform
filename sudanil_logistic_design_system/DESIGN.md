---
name: Sudanil Logistic Elite
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#42474c'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#73787c'
  outline-variant: '#c3c7cc'
  surface-tint: '#496173'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#021e2d'
  on-primary-container: '#6e8799'
  inverse-primary: '#b0cade'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#fdcb5b'
  on-secondary-container: '#735500'
  tertiary: '#010101'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1c1c'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce6fb'
  primary-fixed-dim: '#b0cade'
  on-primary-fixed: '#021e2d'
  on-primary-fixed-variant: '#314a5a'
  secondary-fixed: '#ffdfa0'
  secondary-fixed-dim: '#ecc165'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 16px
  margin-desktop: 48px
  gutter: 24px
  section-gap: 80px
  max-width: 1280px
---

## Brand & Style

The brand identity centers on **Industrial Reliability** and **Logistical Precision**. It targets enterprise clients and individual shippers who prioritize trust and speed. The visual style is **Corporate Modern**, blending high-contrast professional tones with sophisticated depth. 

The aesthetic is characterized by:
- **Authority:** Deep navy foundations provide a sense of established power.
- **Urgency:** Amber/Gold accents highlight action-oriented elements and movement.
- **Transparency:** Use of backdrop blurs and subtle glassmorphism in navigation to suggest modern, tech-forward operations.
- **Motion:** Directional cues (arrows) and hover-lift transitions reinforce the concept of progress and delivery.

## Colors

The palette is anchored by "Logistic Navy" (#021e2d) and "Precision Gold" (#795900). 

- **Primary:** Used for backgrounds of high-importance sections, hero overlays, and core branding. It represents the "vessel" or "container."
- **Secondary:** An amber-gold used strictly for calls to action, status indicators, and highlights. It represents "light" and "clearance."
- **Neutral:** A range of cool grays and off-whites that keep the interface feeling clean and professional without the harshness of pure white.
- **Gradients:** Use vertical gradients from `primary-container` to `black` for hero sections to create a "bottomless" professional depth.

## Typography

**Be Vietnam Pro** is used across all roles to maintain a contemporary, geometric feel that remains highly legible in industrial contexts.

- **Headlines:** Use Bold (700) weights with slightly tighter letter-spacing for the largest displays to command attention.
- **Body:** Standardized at 16px/18px for high readability of service descriptions.
- **Labels:** Semi-bold (600) is used for navigation and small status badges to ensure they stand out against varied backgrounds.
- **RTL Support:** The system is designed for Arabic-first environments; ensure line heights are generous enough to prevent character clipping.

## Layout & Spacing

The system uses a **Fixed Grid** approach for desktop and a **Fluid Content** model for mobile.

- **Grid:** 12-column system on desktop with 24px gutters.
- **Margins:** Large 48px horizontal margins on desktop create a "premium" centered look. Mobile reduces this to 16px to maximize utility.
- **Sectioning:** Deep vertical breathing room (80px) between major sections prevents visual clutter in information-heavy logistics content.
- **Bento Grid:** Use a modular grid for service features where primary services span 8 columns and secondary services span 4.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Industrial Shadows**:

- **Logistic Depth:** A custom shadow set using navy-tinted shadows (`rgba(0, 27, 42, 0.08)`) instead of neutral blacks. This creates a more cohesive, brand-aligned sense of elevation.
- **Surface Tiers:** 
    - `surface`: Background.
    - `surface-container`: Light gray used for secondary sections (like partners).
    - `white`: Used for active card elements to pop against the gray background.
- **Interactive Depth:** Components should "lift" (translateY -4px) on hover, accompanied by an increased shadow spread to simulate physical proximity.

## Shapes

The shape language is **Structured but Approachable**:

- **Standard Radius:** 0.5rem (8px) for primary containers and inputs.
- **Large Radius:** 0.75rem to 1rem for cards and Bento grid modules to soften the industrial feel.
- **Pill Shapes:** Used exclusively for "Status Badges" or "Mini-Labels" to distinguish them from actionable buttons.
- **Hard Accents:** Use "Diagonal Accents" (clip-paths) or sharp dividers sparingly to evoke the feeling of ship hulls or truck containers.

## Components

### Buttons
- **Primary:** Solid `secondary-container` with `on-secondary-container` text. This provides the highest contrast.
- **Secondary/Ghost:** `white/10` with a `white/30` border and backdrop blur for use over dark image backgrounds.
- **Interactive:** All buttons must scale slightly (95%) on click to provide tactile feedback.

### Cards
- **Feature Cards:** Must feature a high-quality image, an icon in the secondary brand color, and a "hover-lift" effect. 
- **Border:** Use a subtle `1px` border of `outline-variant` to define edges on white surfaces.

### Input Fields
- **Tracking Input:** Large (h-16), white background, with a prominent internal button. This is the "Hero" component of the utility.

### Navigation
- **Top Bar:** Blurred background (95% opacity) with a thin bottom border. Active links should be marked with a `secondary` 2px bottom border.

### Icons
- **Material Symbols Outlined:** Use a `wght` of 400 and `opsz` of 24. Icons related to logistics (trucks, boats, boxes) should adopt the `secondary` color when used as decorative accents.