---
name: Kinetic Precision
colors:
  surface: '#11131b'
  surface-dim: '#11131b'
  surface-bright: '#373942'
  surface-container-lowest: '#0c0e16'
  surface-container-low: '#191b23'
  surface-container: '#1d1f27'
  surface-container-high: '#282a32'
  surface-container-highest: '#32343d'
  on-surface: '#e1e2ed'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#e1e2ed'
  inverse-on-surface: '#2e3039'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#11131b'
  on-background: '#e1e2ed'
  surface-variant: '#32343d'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  numeric-display:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system is built for a high-performance personal finance environment where clarity, trust, and technical sophistication are paramount. The aesthetic merges the utility of developer-centric tools with the premium feel of modern fintech.

The brand personality is **authoritative yet accessible**, using a "Functional-Elegant" approach. It draws heavily from **Modern Corporate** and **Glassmorphism** styles—prioritizing information density without sacrificing visual breathing room. Users should feel a sense of absolute control over their data, evoked through a high-fidelity interface that utilizes subtle depth, precision lines, and intentional motion.

## Colors

The palette is optimized for a **Dark Mode** primary experience to reduce eye strain during deep financial review. 

- **Primary (Action):** A vibrant Blue (#2563EB) used for primary calls-to-action and key interactive states.
- **Semantic Logic:** Success (Green), Warning (Amber), and Danger (Red) follow standard financial patterns for profit/loss and alerts.
- **Neutrals:** The background uses a deep Navy (#0F172A). Surfaces and containers use lighter slate shades to create hierarchical "stepping" without relying on heavy shadows.
- **Accents:** Glassmorphic elements should use a 10-15% opacity white tint with a 12px-20px background blur to indicate temporary or overlay states.

## Typography

This design system utilizes **Inter** for all primary reading and interface elements due to its exceptional legibility in UI environments. **Geist** is introduced for labels and numeric displays to provide a technical, monospaced-adjacent feel for financial data.

- **Headlines:** Tight letter spacing and bold weights create a sense of structural importance.
- **Data Display:** For currency and balances, use the `numeric-display` role to ensure numbers are clear and professional.
- **Labels:** Small, uppercase labels provide metadata context without cluttering the visual hierarchy.

## Layout & Spacing

The layout follows a **Fluid Grid** system with fixed maximum widths for desktop to maintain readability of data tables and charts.

- **Grid:** A 12-column grid is used for desktop. Mobile transitions to a single-column layout with 16px side margins.
- **Rhythm:** An 8pt linear scale governs all spacing (4, 8, 16, 24, 32, 48, 64).
- **Density:** Information density is "Moderate-High." Use `16px (md)` padding for standard cards and `24px (lg)` for main section spacing.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Subtle Borders** rather than heavy shadows.

- **Level 0 (Background):** #0F172A.
- **Level 1 (Cards/Sidebar):** #1E293B with a 1px solid border (#334155).
- **Level 2 (Modals/Dropdowns):** Glassmorphic surfaces with a `backdrop-filter: blur(16px)` and a slightly brighter border (#475569) to simulate proximity to the light source.
- **Shadows:** Only used for floating elements (modals). Use a tight, 15% opacity black shadow with a 10px blur, centered.

## Shapes

The design system utilizes **Rounded** corners to soften the technical nature of financial data, making the product feel modern and approachable.

- **Components (Buttons/Inputs):** 0.5rem (8px).
- **Cards/Containers:** 1rem (16px).
- **Large Sections/Feature Blocks:** 1.5rem (24px).
- **Charts:** Bar charts and progress bars should have a minimum of 4px rounding on top/ends to maintain the visual language.

## Components

### Buttons
- **Primary:** Solid #2563EB with white text. 8px roundedness.
- **Secondary:** Ghost style with #334155 border and #F8FAFC text.
- **States:** 10% brightness increase on hover; 5% decrease on active/click.

### Cards
- Background: #1E293B.
- Border: 1px solid #334155.
- Corner Radius: 16px.
- Layout: Use a consistent 16px or 24px internal padding.

### Input Fields
- Dark background (#0F172A), 1px border (#334155).
- Focus State: Border changes to #2563EB with a 2px outer glow (ring).
- Typography: Use `body-md`.

### High-Fidelity Charts
- **Lines:** Use a 2px stroke width.
- **Area:** Use a gradient fill from the primary color (20% opacity) to transparent.
- **Grid Lines:** Very subtle #1E293B lines, dashed.
- **Tooltips:** Glassmorphic container with `label-md` typography.

### Chips & Badges
- Used for transaction categories or status.
- Style: Subdued background (15% of the semantic color) with high-contrast text of the same hue.