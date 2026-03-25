# Design System Document: Academic Editorial

## 1. Overview & Creative North Star

### The Creative North Star: "The Digital Curator"
This design system moves away from the rigid, boxy constraints of traditional academic portals. Instead, it adopts the persona of a **Digital Curator**—an interface that feels like a high-end, bespoke academic journal. The aesthetic is defined by "Editorial Minimalism," where authority is conveyed through expansive whitespace, sophisticated typography scales, and a layered depth that suggests physical paper and scholarly substance.

The goal is to move beyond the "template" look. We achieve this through:
*   **Intentional Asymmetry:** Using the 12-column grid as a guide, not a cage, allowing content to "breathe" with varied margin widths.
*   **Textural Depth:** Replacing harsh lines with tonal shifts to create a feeling of organized, intellectual calm.
*   **Typographic Gravity:** Leveraging the high-contrast relationship between a classic serif (Playfair Display) and a modern, functional sans-serif (Inter).

---

## 2. Colors

The color palette is rooted in tradition but executed with contemporary restraint.

### Palette Strategy
*   **Primary (`primary` #002444):** The foundational University Blue. Use this for moments of high authority: primary navigation, major headlines, and significant background blocks.
*   **Secondary/Tertiary (`secondary` #755b18 / `tertiary` #2f2100):** Our discrete Gold accent. This is not a primary brand color but a "light-catcher." Use it sparingly for interactive highlights, subtle icons, or small label backgrounds.
*   **The Neutral Core:** A range of surfaces from `surface_container_lowest` (#ffffff) to `surface_dim` (#dadada) to create architectural depth.

### Design Principles for Color
*   **The "No-Line" Rule:** Prohibit the use of 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. For example, a "Publications" section (`surface_container_low`) should sit on the main page background (`surface`) without a stroke.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers. An article card (`surface_container_lowest`) should "float" on a section background (`surface_container_low`). This creates a soft, natural hierarchy that feels premium rather than clinical.
*   **The Glass & Gradient Rule:** For floating elements like the "Bilingual Toggle," use a glassmorphic effect: a semi-transparent `surface` color with a 12px backdrop-blur. Use subtle gradients on `primary` buttons (transitioning to `primary_container`) to provide a tactile "ink-on-paper" depth.

---

## 3. Typography

Typography is the primary vehicle for the brand’s academic authority.

*   **Display & Headlines (Playfair Display / Newsreader):** These are our "Editorial" voices. Use `display-lg` (3.5rem) for hero statements and `headline-lg` (2rem) for section titles. The high-stroke contrast of these serifs provides an immediate scholarly feel.
*   **Title & Body (Inter):** Inter provides the "Functional" voice. Its high x-height ensures readability for dense academic abstracts. 
*   **Hierarchy as Identity:** Always maintain a significant scale jump between headlines and body text. Use `label-md` (0.75rem) in all-caps with increased letter-spacing (0.05rem) for categories like "JOURNAL ARTICLE" to create a metadata layer that feels curated.

---

## 4. Elevation & Depth

We avoid the "shadow-heavy" look of 2010s material design, opting for **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking" the surface-container tiers. 
    *   *Lowest:* Background (`surface`)
    *   *Middle:* Section Background (`surface_container_low`)
    *   *Highest:* Content Cards (`surface_container_lowest`)
*   **Ambient Shadows:** If a card requires a "lift" (e.g., on hover), use an extra-diffused shadow: `0 12px 32px rgba(26, 28, 28, 0.06)`. The tint is derived from `on_surface` to look like natural light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input fields), use the `outline_variant` at 20% opacity. Never use 100% opaque black or grey strokes.
*   **Backdrop Blur:** Use blurs on the main navigation bar to allow colors from the page content to bleed through, ensuring the site feels like a single, cohesive canvas.

---

## 5. Components

### Publication Cards
*   **Style:** No borders. Background: `surface_container_lowest`. 
*   **Layout:** Use asymmetrical padding—more on the left than the right—to create an editorial flow.
*   **Typography:** The title uses `title-lg` (Playfair Display). The meta-info (Year, Journal) uses `label-md` in Gold (`secondary`).

### Buttons
*   **Primary:** Solid `primary` background. Subtle 4px (`md`) rounded corners. Text: `on_primary` (White).
*   **Secondary (Gold):** Use `secondary_container` background with `on_secondary_container` text. This is for call-to-actions that are important but not "site-critical."
*   **Tertiary:** Ghost style. No background, only a "Ghost Border" on hover.

### Bilingual Toggle
*   **Treatment:** Positioned at the top-right of the viewport. Styled as a pill using `full` roundedness. Use `surface_bright` with a 10% opacity `outline` and a backdrop blur.

### Course Lists
*   **Structure:** Forbid divider lines. Separate courses using `spacing-8` (2.75rem) vertical gaps. Use a vertical Gold `secondary` accent line (2px wide) only on the "Active" or "Current" semester course.

---

## 6. Do's and Don'ts

### Do
*   **DO** embrace white space. If a section feels crowded, increase the spacing from `spacing-10` to `spacing-16`.
*   **DO** use typography as a decorative element. A large, low-opacity Playfair Display numeral (e.g., "01") can act as a section marker.
*   **DO** ensure the Bilingual Toggle is always accessible but never dominant.

### Don't
*   **DON'T** use 1px solid dividers between list items. Use white space or subtle background shifts instead.
*   **DON'T** use high-contrast drop shadows. They break the "paper-like" editorial feel.
*   **DON'T** use bright, saturated colors outside the defined Gold (`secondary`) and Blue (`primary`) tokens. This is an academic environment; saturation must be earned.
*   **DON'T** center-align long blocks of body text. Maintain left-alignment for scholarly readability.