# UX/UI Implementation Audit Report

Audit date: June 22, 2026
Scope: refreshed static source review, dependency/documentation review through Context7, live reference review, asset inspection, and production build analysis. The production build completed successfully with TypeScript 5.9 and Vite 7.3. Viewport findings below are based on the implemented CSS and component structure; they should still be confirmed in a browser/device QA pass.

Implementation follow-up: after updating this audit, a first conservative refinement pass was completed and visually checked at 1440×900 and 390×844. It corrected the Milka composition, carousel semantics/targets, keyboard focus, RSVP error associations, skip navigation, hero image priority, and multiline RSVP feedback. Larger product/content blockers remain explicitly listed.

## 1. Executive Summary

The implementation has a credible, custom editorial foundation. It does not read as a basic landing-page template: the full-bleed hero, alternating photographic story, restrained ivory/forest/gold palette, serif-led type, paper grain, and cinematic event sequence create a deliberate narrative. The current visual direction is worth preserving, but the Milka first scene has moved away from its specific light editorial brief and now repeats the site's dark cinematic treatment.

What is working well:

- The visual direction is recognizably romantic and editorial rather than corporate.
- The story is organized into clear emotional chapters with large imagery and generous spacing.
- The rendered experience is not card-heavy.
- Most below-the-fold images use native lazy loading.
- Aspect-ratio or viewport-sized wrappers reserve image space in most major compositions.
- The code has a genuine reduced-motion foundation through `MotionConfig reducedMotion="user"` and `useReducedMotion`.
- Semantic landmarks, one `h1`, section headings, real links/buttons, fieldset/legend, labels, and useful image alternatives are present.

What is weak:

- Core guest tasks arrive too late. Date, venue, maps, dress code, and RSVP sit after a long cinematic narrative with no quick navigation.
- The proposal video CTAs point back to `#video-propuesta`, the ID of the link itself; the advertised action does not open a video.
- RSVP currently reports success through a mock transport and does not persist a response. This is a release blocker even though it is not a visual issue.
- The image pipeline is not production-ready: no `srcset`/`sizes`, no generated responsive variants, and several multi-megabyte originals.
- Several small olive/terracotta labels fail normal-text contrast, form errors are not programmatically associated with controls, focus treatment is incomplete, and carousel dots are far below WCAG 2.2 target-size guidance.
- Fixed `100svh`/`100vh` sections with `overflow-hidden` create clipping risk on short laptops, small phones, landscape phones, text zoom, and translated/expanded content.
- The RSVP visual language introduces a disconnected petrol palette and Manrope heading treatment.
- Hacienda architecture, natural wood, orchids, candles, and botanical craft are not strongly represented in the mounted UI. Some botanical components exist but are unused.
- The codebase contains unmounted sections, unused content, and substantial legacy CSS, which makes the design system harder to reason about.

Overall UX/UI rating: **6.8/10** after the first refinement pass.

The concept is stronger than the production readiness. The site already has the right emotional skeleton, but accessibility, task flow, real RSVP behavior, responsive robustness, image delivery, and visual-system cleanup prevent a higher score.

## 2. References Used

### UX/UI and visual-design principles

- [Nielsen Norman Group — Visual Hierarchy in UX](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/): used to assess contrast, scale, grouping, breathing room, and whether visual emphasis matches information priority.
- [Nielsen Norman Group — Web UX Study Guide](https://www.nngroup.com/articles/web-ux-study-guide/): used for scanning behavior, web conventions, content priority, forms, navigation, and cross-platform expectations.
- [Laws of UX](https://lawsofux.com/): used particularly for the Aesthetic-Usability Effect, Fitts's Law, Hick's Law, Peak-End Rule, and Serial Position Effect. A beautiful invitation still needs obvious, reachable guest actions.
- [Material Design 3 — Layout](https://m3.material.io/foundations/layout/overview): used as a principle reference for adaptive composition, containment, and breakpoint behavior, not as a visual style.
- [Material Design 3 — Color](https://m3.material.io/styles/color/overview): used for role-based color consistency and legibility.
- [Material Design 3 — Typography](https://m3.material.io/styles/typography/overview): used for type roles, hierarchy, and readable scale. Material components or styling are not recommended for this site.

### Accessibility

- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/): normative basis for contrast, keyboard access, focus, target size, labels, errors, reflow, and status messages.
- [W3C — WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/): used to frame the POUR principles and conformance scope.
- [W3C — Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/): used to interpret implementation impact rather than treating checks as purely mechanical.
- [W3C — Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html): used to evaluate parallax, scroll-linked movement, infinite ambient animation, and reduced-motion handling.

### Responsive images, CSS, and performance

- [MDN — Responsive Images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images): used to evaluate missing `srcset`, `sizes`, resolution switching, and art direction.
- [MDN — `background-image`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-image): used to distinguish decorative backgrounds from meaningful images and their accessibility implications.
- [MDN — `background-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-size): used to assess `cover`-style cropping and focal-point risk.
- [MDN — Lazy Loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading): used for offscreen resource deferral.
- [web.dev — Browser-level Image Lazy Loading](https://web.dev/articles/browser-level-image-lazy-loading): used to verify eager loading for the first viewport and lazy loading below the fold.
- [web.dev — Optimize Cumulative Layout Shift](https://web.dev/articles/optimize-cls): used to evaluate explicit dimensions and reserved aspect ratios.
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals): used to frame LCP, CLS, and INP risks.

### Installed framework/library documentation

- [React documentation](https://react.dev/) (`/reactjs/react.dev` in Context7): used for component composition, stable list identity, controlled forms, and semantic JSX. Installed version: React 19.1.x.
- [Tailwind CSS documentation](https://tailwindcss.com/docs) (`/tailwindlabs/tailwindcss.com` in Context7): used for Tailwind 4's mobile-first breakpoints, responsive utilities, CSS-first tokens, and arbitrary-value usage. Installed version: Tailwind 4.1.x.
- [Motion for React accessibility documentation](https://motion.dev/docs/react-accessibility) (`/websites/motion_dev_react` in Context7): used for `MotionConfig reducedMotion="user"`, `useReducedMotion`, transform suppression, parallax, and animation alternatives. Installed package: `framer-motion` 12.23.x.
- Next.js, shadcn/ui, Radix UI, and MUI do not appear in `package.json` or mounted code, so their documentation does not apply.

### Design-quality inspiration

- [BelArosa Chalet](https://www.belarosa-chalet.ch/en): used for calm pacing, large environmental imagery, restrained copy, and luxury hospitality rhythm.
- [The Lane](https://thelane.com/): used for wedding-specific editorial voice, considered imperfection, candlelight/botanical materiality, and image-led storytelling.
- [Vogue Weddings](https://www.vogue.com/weddings): used for disciplined editorial typography and photography-first hierarchy.
- [Green Wedding Shoes](https://greenweddingshoes.com/): used for approachable wedding storytelling and the balance of inspiration with practical planning content.
- [Awwwards — Wedding Websites](https://www.awwwards.com/websites/wedding/): used as a benchmark for custom wedding storytelling, large photography, typography, responsive motion, and non-template character. The category page was not fully machine-readable during this audit, so related Awwwards wedding examples and their published design/usability criteria were also reviewed; no layout was copied.

## 3. Alignment With Intended Design Direction

### Luxury wedding invitation

**Moderate-to-strong alignment.** `HeroSection.tsx`, `StorySection.tsx`, and the event photography create a bespoke invitation rather than a utility site. The restrained base palette and serif hierarchy support luxury. However, stock imagery in `weddingContent.ts:50-55` and `weddingContent.ts:374-375` weakens authenticity, while the disconnected RSVP styling lowers finish quality.

### Editorial storytelling

**Strong visual alignment, mixed UX alignment.** Large image fields, alternating story chapters, captions, restrained copy widths, and full-viewport chapters create an editorial rhythm. The problem is functional pacing: a guest must traverse multiple long sequences before reaching essential details. Editorial narrative should enrich, not obstruct, task completion.

### Hacienda / organic / botanical inspiration

**Weak-to-moderate alignment.** Ivory, moss, muted gold, paper grain, and the reception image support organic warmth. The mounted UI does not meaningfully express wood, orchids, candlelight, hacienda arches, tactile paper edges, or crafted stationery. `AnimatedOrchid.tsx`, `BotanicalFrame.tsx`, and `.wood-tint` exist but are not used by `App.tsx`.

### Soft, romantic, premium feeling

**Moderate-to-strong alignment.** The story and both Milka scenes are now soft and romantic. The light Milka first scene restores a useful editorial pause between darker cinematic moments. The hero, proposal, and 240svh wedding-details experience still use substantial dark overlays, so future work should avoid adding more dark sections.

## 4. Section-by-Section Review

### Hero — `src/components/sections/HeroSection.tsx`

**Current state:** Full-viewport portrait image, layered dark gradients, ornamental SVGs, staged intro animation, date panel, and an ornamental anchor to the story.

**What works:** The first impression is personal and premium. A single `h1` is used at `HeroSection.tsx:191`. The image is eagerly loaded, the background container reserves the viewport, text contrast is reinforced with overlays, the CTA is a real anchor, and reduced motion disables parallax/particles.

**What does not work:** The hero is visually dense: top ornament, eyebrow, names, subtitle, body, date card, and large bottom ornament all compete within one viewport. The dark overlay is heavy, especially at the top and bottom. The date is visually treated like a translucent card, adding landing-page UI to an otherwise editorial frame. There is no direct path to event details or RSVP.

**Responsive issues:** `min-h-[100svh]` allows the section to grow, which is safer than fixed height, but the long centered stack will become very tall on 320px-wide or landscape phones. `whitespace-nowrap` on the names at `HeroSection.tsx:195` is safe for the current short names but fragile if content changes.

**Accessibility issues:** The first-view image alt is useful. The CTA has an accessible name and focus ring. Some visible text is as small as `0.54rem`–`0.62rem`; this is not appropriate for essential content. White text at reduced opacity should be contrast-tested against the actual image, not only the overlay formula.

**Recommended improvements:** Simplify the content stack; make names/date the dominant pair; reduce the visual weight of the date container; provide a compact “Detalles / Confirmar asistencia” route; add `fetchpriority="high"`, responsive sources, and explicit intrinsic dimensions to the LCP image; preserve a content-configurable focal point.

### Nuestra historia — `src/components/sections/StorySection.tsx`

**Current state:** Three large alternating chapters, horizontal image carousels, scroll-linked image/copy motion, a drawn route, and a moving plane.

**What works:** The sequence is easy to understand, image-to-copy balance is strong on desktop, and the spacing avoids a generic card grid. Headings and paragraphs establish a clear reading order. Images sit in fixed aspect-ratio frames, reducing layout shift. Arrow-key support exists for focused multi-image carousels.

**What does not work:** The section is long relative to the amount of story. Every chapter has entrance animation, scroll-linked parallax, clip-path reveal, opacity modulation, carousel behavior, connector animation, and a moving plane. The combined motion language is more demonstrative than calm. The first chapter mixes authentic photography with generic Unsplash party imagery, which makes the story feel less personal.

**Responsive issues:** Mobile uses a portrait frame for all source orientations. Landscape images such as `inicio-2016.jpg` are cropped into `aspect-[4/5]`, risking lost meaning. The large `pt-28` gaps after the first chapter produce a slow mobile scroll. The carousel relies on horizontal gestures without visible previous/next controls.

**Accessibility issues:** Dot buttons at `StorySection.tsx:174-180` are only 6px high and 6–20px wide, far below the WCAG 2.2 24×24 CSS-pixel minimum unless spacing exceptions can be proven. They have no selected-state semantics (`aria-current` or equivalent) and no explicit focus style. The scrollable carousel has no role/label or instructions. Hidden scrollbars reduce discoverability. All images have meaningful alt text, which is good.

**Recommended improvements:** Use one motion idea per chapter; keep image reveal or route progress, not every effect. Add 44px visual controls or 24px minimum hit areas, selected-state semantics, and a labelled carousel region. Use source-specific aspect ratios/art direction and authentic images only. Shorten mobile vertical gaps.

### Milka — `src/components/sections/MilkaSection.tsx`

**Current state:** A light editorial composition with the image above the copy on mobile and on the right on desktop, followed by a separate white message section with circular portrait and script signature.

**What works:** The first scene now matches the intended brief without becoming card-based. The large authentic image, restrained type, soft ivory transition, and subtle paw details create an emotional pause. The second white scene creates a distinctive voice. Motion is reduced-motion aware.

**What does not work:** Two substantial Milka scenes still give the pet more narrative time than either ceremony or reception. Image selection depends on exact caption strings and constant array indexes, which is fragile.

**Responsive issues:** The first scene is now content-driven with a 48svh mobile media region and a 62%-wide right-side desktop image, removing its previous fixed desktop height. The second message scene remains long but is content-driven.

**Accessibility issues:** The background-style image correctly uses `alt=""` and `aria-hidden` because it is atmospheric and adjacent text carries the narrative. The circular portrait has meaningful alt text and a screen-reader-only caption. Several olive/terracotta micro-labels elsewhere remain below normal-text contrast targets.

**Recommended improvements:** Keep the new first-scene composition. Replace caption-based image selection with explicit content roles, add responsive image sources/focal-point data, and consider shortening the second scene only after testing the full narrative with guests.

### Proposal — `src/components/sections/ProposalSection.tsx`

**Current state:** One dark mountain scene followed by a light proposal-confirmation scene with ring image, quote, video poster, and supporting copy.

**What works:** This is a strong emotional peak. The light second panel creates useful contrast after the dark mountain frame. Photography, headline scale, and asymmetric layout feel editorial. Reduced motion disables background drift and ambient particles.

**What does not work:** Both video CTAs use `content.videoUrl`, currently `#video-propuesta`, while the main link itself has `id="video-propuesta"` (`ProposalSection.tsx:233-242`, `weddingContent.ts:234-236`). Activating it does not play or open a video. The family photo is imported and emitted but never rendered. The main video card explicitly uses `outline-none` and provides no replacement focus-visible style.

**Responsive issues:** The second panel becomes `lg:h-[100svh]` with `overflow-hidden`; a short 1024px-wide laptop can clip the image/video/copy stack. The full-screen model also becomes fragile under 200% text zoom.

**Accessibility issues:** The primary video link has no visible keyboard focus. The poster alt “Video de la propuesta” duplicates the link's accessible name and could be empty within the already-labelled link. If the final video opens a new tab or dialog, that behavior must be communicated and the video needs captions/transcript as applicable.

**Recommended improvements:** Connect a real video URL or an accessible dialog/player; restore a strong focus-visible ring; use one clear video CTA; remove unused media; replace fixed desktop height with min-height and content-driven overflow.

### Wedding details — `src/components/sections/WeddingDetailsSection.tsx`

**Current state:** A 240svh scroll-controlled ceremony/reception reveal, followed by a fixed-height dress-code screen and RSVP.

**What works:** The ceremony and reception scenes are visually memorable, map links are real anchors with focus states, and important data is presented as labelled pairs. The background images are decorative to assistive technology because equivalent text is present. The dress-code illustrations have accessible names.

**What does not work:** Essential information is made conditional on a long scroll interaction. One panel is `aria-hidden` based on scroll progress, so content exposure depends on animation state. Ceremony venue content remains “Lugar por confirmar” and its map is a broad regional search. The sequence is cinematic but less scannable than guests need. The dress-code block compresses two dense columns into one viewport.

**Responsive issues:** Mobile panels are positioned at the bottom of a fixed `100svh` sticky viewport with `overflow-hidden`; long venue names, browser UI, landscape orientation, and text zoom can clip copy or CTAs. The dress-code screen is always `h-[100svh] overflow-hidden` and always two columns, even at 320px. Text falls to `0.58rem`–`0.78rem`, which is too compressed.

**Accessibility issues:** Inactive absolutely positioned articles remain in the DOM with `aria-hidden`, while the interaction has no non-scroll alternative. Small dress-code labels and chips have contrast/readability risk. Decorative color swatches are supplemented by text labels, which is correct.

**Recommended improvements:** Present date, venue, time, and maps in a static scannable summary before or alongside the cinematic layer. Under reduced motion, render both moments in normal flow. On small screens, use one column and content-driven height. Confirm the real ceremony venue and destination before launch.

### RSVP — `src/components/RSVPForm.tsx` and `src/lib/submitRSVP.ts`

**Current state:** Controlled React form with text inputs, radio group, conditional companion field, client validation, loading/success/error states, and mock async submission.

**What works:** Labels wrap controls, attendance uses `fieldset`/`legend`, native input types are used, the success message has `role="status"`, and the failure has `role="alert"`. The flow is understandable and the touch rows are generally large.

**What does not work:** `mockRSVPTransport` returns a fake success after 1.5 seconds. Guests can believe they confirmed when no response was saved. The section introduces petrol blue and a plain sans-serif heading, visually separating it from the invitation. The success copy contains newlines that collapse under normal CSS whitespace.

**Responsive issues:** The form itself is fluid and single-column, but the section follows a very long journey. Submit is not full-width on small screens; that is not inherently wrong, but a wider CTA would make the final action more obvious.

**Accessibility issues:** Custom errors are visible but controls do not receive `aria-invalid`, `aria-describedby`, stable error IDs, or focus after failed submission. Input focus removes the outline and changes only a 1px underline. The submit button has no explicit focus-visible style. Error text `#bc6c25` on `#f8f8f8` is approximately 3.72:1, below 4.5:1 for normal text. Placeholder contrast is approximately 2.81:1; placeholders should not carry essential instructions.

**Recommended improvements:** Implement real persistence first; add accessible error associations and a form-level error summary; use unmistakable focus rings; align RSVP typography/colors with the main system; preserve message line breaks; show a confirmation identifier or retry-safe state.

### Gallery and journey code

`GallerySection.tsx` and `JourneySection.tsx` exist, and corresponding content exists in `weddingContent.ts`, but neither is mounted in `App.tsx:27-33`. They are not part of the current user experience and should not be presented as implemented features. Gallery data uses Picsum placeholders, so mounting it would immediately reduce authenticity. The unmounted gallery does include lazy loading, keyboard focus, and tap-to-reveal logic, but its hidden scrollbars and hover-dependent captions would require another accessibility pass.

## 5. Design System Review

### Colors

The forest/ivory base is strong and premium. Approximate static contrast checks show forest on ivory at 13.63:1 and gold on the wedding-detail dark base at 10.67:1. Olive on ivory is about 3.71:1 and terracotta on ivory about 2.93:1, so both fail normal-text AA when used for small labels. The RSVP introduces unrelated petrol variables and legacy orange error colors at `styles.css:836-840` and `styles.css:953-956`.

Recommendation: define semantic roles (`text-primary`, `text-secondary`, `text-accent-readable`, `surface`, `surface-inverse`, `focus`, `error`) and reserve pale olive/gold/terracotta for borders, ornaments, or large text unless darkened.

### Typography

Cormorant Garamond plus Manrope is a suitable editorial pairing. Great Vibes should remain a rare accent. Four font families plus Material Symbols are requested from Google Fonts in `index.html:10-19`; Playfair Display is only a fallback after Cormorant and therefore normally unused. Repeated 9–12px uppercase labels with high tracking undermine readability and make the site feel fashion-editorial at the expense of guest usability.

Recommendation: keep two primary families, optionally one script accent; remove unused Playfair and replace the single icon font with inline SVG. Set an accessible minimum of roughly 12–14px for nonessential labels and 16px for body/form content.

### Spacing

Large section spacing creates calm pacing on desktop. On mobile, repeated 100svh scenes plus `pt-28`, `pb-32`, and `md:pt-44` produce excessive travel before practical information. Spacing is not tokenized; many arbitrary values make rhythm hard to govern.

### Buttons and links

Map links and the secondary proposal link have clear typography and focus styles. The hero CTA is visually an ornament rather than an obvious action. The proposal poster link lacks focus, the carousel dots are too small, and the RSVP CTA is stylistically disconnected.

### Cards

The mounted implementation correctly avoids a card-heavy pattern. The hero date panel and RSVP shell are the only notable containers. Legacy paper-card styles and unmounted gallery/card components remain in the stylesheet/codebase.

### Shadows

Image shadows are soft and appropriate. The site uses several one-off shadow values, but they remain visually restrained. Consolidate them into two roles: subtle paper elevation and editorial image elevation.

### Image treatments

Full bleed, portrait crops, subtle gradients, and minimal rounding fit the brief. The main weaknesses are inconsistent authenticity, hardcoded focal points, and lack of responsive variants. Circular treatment should remain specific to Milka rather than become a repeated motif.

### Decorative elements

Paper grain, fine rules, ornaments, paws, and route lines support a handcrafted invitation. The plane icon font and several unused botanical/wood styles indicate an incomplete visual language. Use a small, coherent motif set tied to the venue and stationery rather than adding more decoration.

### Motion language

Durations around 0.9–1.4 seconds and eased reveals generally feel calm. The cumulative system is too broad: parallax, scale, clip-path, opacity, particles, infinite floating, a moving plane, sticky transitions, and scroll progress all coexist. Motion should signal narrative transitions, not decorate every layer.

## 6. Responsiveness Review

Tailwind 4 defaults apply: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, and `2xl` 1536px. The implementation is mobile-first but relies heavily on arbitrary values and has no dedicated small-mobile breakpoint below 640px.

### Desktop (1280px and above)

- The large max-widths (`92rem`–`94rem`) and asymmetric compositions should read well.
- Story alternation and Milka's right-side image are strongest here.
- Very wide screens will remain visually contained.
- Fixed-height Milka/proposal/dress-code screens are vulnerable on wide but short viewports.

### Standard laptop (1024–1279px)

- `lg` switches several sections to fixed `100vh`/`100svh` exactly at 1024px, where many devices have only 600–768px of usable height.
- Proposal scene two, Milka scene one, and dress code need content-driven height or a height media query.
- The story's large horizontal spacing is acceptable, but motion and image decoding can compete on mid-range hardware.

### Tablet (768–1023px)

- Most layouts return to normal document flow and are safer than laptop layouts.
- Story image/copy remain stacked until `lg`, producing long but readable chapters.
- Wedding details remain a fixed sticky viewport and dress code remains fixed-height/two-column; these are the main tablet risks.

### Mobile (375–767px)

- Milka correctly moves image to the top.
- Story and proposal stacks are legible but vertically long.
- Wedding-detail text may compete with background focal points despite overlays.
- Small typography, hidden carousel scrollbars, and tiny dots reduce usability.
- Full-screen sections should account for browser controls, safe areas, text zoom, and content expansion.

### Small mobile (320–374px and landscape phones)

- The dress-code two-column layout is too compressed and uses sub-12px labels.
- Fixed-height/overflow-hidden event and dress-code scenes risk clipped content.
- The hero names happen to fit, but `whitespace-nowrap` is content-fragile.
- Minimum touch target and spacing failures are most severe here.

Required QA matrix for the implementation phase: 320×568, 360×800, 390×844, 430×932, 768×1024, 1024×600, 1280×720, 1440×900, and 1920×1080; repeat at 200% browser zoom and with reduced motion enabled.

## 7. Accessibility Review

### Critical

No source-proven issue was classified as a complete accessibility blocker. This does **not** constitute WCAG conformance; automated and assistive-technology testing has not yet been run.

### Important

- **Contrast:** olive and terracotta microcopy fails 4.5:1 on ivory in several contexts. Examples include hero/story/Milka/dress-code eyebrows and `styles.css` form error colors.
- **Focus visibility:** addressed in the first pass for the proposal video card, RSVP controls, radio groups, submit button, and carousel controls. A full keyboard sweep is still required.
- **Form errors:** addressed in the first pass with stable IDs, `aria-describedby`, `aria-invalid`, and focus movement to the first invalid field.
- **Target size:** addressed in the first pass for story and proposal carousel dots with 24×24 CSS-pixel hit areas.
- **Reflow/clipping:** fixed viewport heights and hidden overflow in wedding details, dress code, desktop Milka, and desktop proposal are unsafe under zoom/reflow.
- **Carousel semantics:** labelled regions, grouped slide positions, selected-state semantics, and keyboard arrow behavior are now present. Visible directional arrows remain a nice-to-have usability enhancement.
- **Keyboard action:** focus visibility is fixed; the proposal video destination remains nonfunctional until a real URL/player is provided.
- **Motion alternative:** transforms are mostly disabled correctly, but reduced motion still leaves a 240svh scroll requirement and state-switched wedding content. The alternative should reduce interaction burden, not just animation.

### Nice to Have

- Add a skip link and a compact landmark/quick-navigation menu for story, details, and RSVP.
- Announce carousel position changes only if useful and non-noisy.
- Add `aria-busy` to the RSVP form or button region during submission.
- Ensure the final video has captions, transcript, and an accessible player/dialog.
- Consider a user-facing motion toggle in addition to OS preference for a highly animated invitation.
- Review alt text with the couple to distinguish meaningful memories from decorative atmosphere.

## 8. Performance Review

### Build baseline

The refreshed production build succeeds. Output is approximately 25 MB total. The main JavaScript is 408.34 KB raw / 125.98 KB gzip; CSS is 90.01 KB raw / 16.74 KB gzip. This is not catastrophic for a narrative site, but it is high for a static invitation and should be tested on mid-range mobile hardware.

### Image optimization

- `src/assets` is approximately 22 MB.
- `distancia-3.jpg` is 6.53 MB at 5184×3880.
- `propuesta-eigergletscher-bg.png` is 2.00 MB.
- `propuesta-anillo-manos.png` is 1.88 MB.
- `inicio-2016.jpg` is 1.79 MB.
- Multiple other images are 0.8–1.14 MB.
- Vite fingerprints imports but does not generate responsive image variants or recompress these sources.
- Every image uses a single `src`; no local image uses `srcset`, `sizes`, or `<picture>`.

Convert photographic PNGs to AVIF/WebP/JPEG as appropriate, generate width variants, and cap dimensions to realistic display/DPR requirements. Preserve originals outside the shipped bundle.

### Layout shift

Most story/proposal/Milka frames use CSS aspect ratios or fixed viewport boxes, which is good. No `<img>` carries intrinsic `width` and `height`, however. Add them because browsers can reserve the correct ratio before CSS and image metadata resolve. Remote images are especially important.

### Lazy loading

The hero correctly uses eager loading. Most below-fold images use `loading="lazy"`. Story carousels render all slides in the DOM, so browsers may still fetch many near-viewport horizontal images; measure this rather than assuming every slide is deferred. The first wedding-detail background is marked eager despite being far below the initial viewport, which may create avoidable competition with earlier content.

### Hero image behavior

The hero is 420 KB and likely the LCP element. It lacks `fetchpriority="high"`, responsive sources, and a preload strategy. Its portrait intrinsic ratio is reasonable for mobile but desktop displays crop heavily; art-directed sources would improve both composition and bytes.

### Background image risks

Major photographic “backgrounds” are implemented as absolute `<img>` elements rather than CSS backgrounds. This is a good choice because it permits lazy loading, responsive sources, and explicit accessibility. CSS gradient backgrounds are lightweight. Legacy `.hero-backdrop-image` references an external Pexels URL but is unused in the mounted UI and should be removed.

### Animation performance

Most animations use transforms and opacity. The story plane writes `left`, `top`, and `transform` on scroll (`StorySection.tsx:265-296`) and declares `will-change: transform, top, left`; changing top/left can trigger layout work. Use a transform-only path strategy. Clip-path reveals, multiple springs, and continuous scroll observers should be profiled on mobile.

### Mobile performance

The 123 KB gzipped JS bundle includes a substantial animation runtime for an invitation. More important than bundle size is image transfer/decode pressure. Test LCP, INP, memory, and long tasks on throttled mobile, then simplify motion before considering framework-level micro-optimizations.

## 9. Code Quality Review

- `WeddingDetailsSection.tsx` (642 lines), `StorySection.tsx` (408), `MilkaSection.tsx` (347), and `ProposalSection.tsx` (307) combine content selection, responsive composition, animation orchestration, and semantics. Split by responsibility during implementation.
- `styles.css` is 1,321 lines and contains large unused groups for old story rows, gallery, Milka cards, itinerary, hero backdrops, and wood treatments. Mounted components mostly use inline Tailwind utilities, creating two competing styling systems.
- `JourneySection`, `GallerySection`, `StoryCard`, `PhotoCard`, `InvitationLayer`, `BotanicalFrame`, and `AnimatedOrchid` are currently unmounted. Decide whether to remove or deliberately integrate them.
- `weddingContent.ts` contains unused journey/gallery data and placeholder remote imagery. Content and shipped assets are not aligned with what `App.tsx` renders.
- Milka image roles are inferred from exact human-readable captions (`MilkaSection.tsx:197-210`). Use explicit fields such as `storyBackground`, `portrait`, and focal points.
- Motion easings, durations, viewport thresholds, shadows, max widths, and colors are duplicated as arbitrary values. Promote them to design/motion tokens.
- Tailwind 4 supports CSS-first theme tokens, but the project defines plain `:root` variables plus many arbitrary values instead of an intentional `@theme` layer.
- Story keys include `resetNonce` (`StorySection.tsx:396-402`), deliberately remounting every chapter when the page returns to the top. This resets carousel state and recreates DOM; avoid unless a tested requirement justifies it.
- `activeMomentIndex` is driven continuously from a spring subscription. A CSS/semantic normal-flow structure with progressive enhancement would be simpler and safer.
- The RSVP transport abstraction is good, but shipping the mock as default makes the UI misleading.
- Production compilation is clean; no TypeScript/build errors were found.

## 10. Specific Review: Milka Section

### Comparison with the desired layout

- **Light background:** Met. The first scene uses the shared ivory surface.
- **Right-side desktop image:** Met. At `lg`, `MilkaStoryBackground` occupies the right 62% of the section.
- **Top image on mobile:** Met. The image occupies the top 48svh and the copy follows in normal flow.
- **Soft white integration:** Met. Mobile uses a transparent-to-ivory vertical fade; desktop uses an ivory-to-transparent horizontal fade.
- **Elegant emotional feeling:** Met. The typography, photo, paw details, and generous light space now read as soft editorial content rather than another cinematic dark scene.
- **Replaceable image system:** Partially met. Images come from typed content and use `object-cover`, but role selection depends on exact captions/indexes and focal position is hardcoded. A replacement with a different subject location can crop badly.
- **No dark overlay:** Met.

### Technical assessment

Using an `<img>` rather than CSS `background-image` remains preferable here because it allows native lazy loading, responsive-image markup, decoding control, and a deliberate empty alt when decorative. It now sits in a responsive media region rather than covering the entire section. The implementation still uses one source and lacks intrinsic dimensions, `srcset`, and `sizes`.

The new gradient direction protects the image-to-copy transition without darkening the photograph. Forest text remains on the light content surface and does not depend on the image for contrast.

### Exact changes recommended later

1. Keep the implemented light split composition and its current content/decorative language.
2. Replace caption/index inference with explicit image roles and per-breakpoint focal points.
3. Generate responsive AVIF/WebP sources and add dimensions, `srcset`, and `sizes`.
4. Keep the new content-driven first-scene height and verify it at 200% zoom.
5. Shorten or merge the second “mensaje de Milka” scene so the overall narrative remains balanced.
6. Darken olive/terracotta microcopy to pass contrast without losing softness.

Verdict: **The Milka section now matches its specific composition brief and should be kept, with only image-pipeline and content-model refinements later.**

## 11. Priority Fixes

### High Priority

1. Replace the mock RSVP transport with real durable submission, retry/error handling, and an auditable confirmation state.
2. Fix the proposal video destination and give the primary video link a visible keyboard focus state.
3. **Completed in the first pass:** restore the requested light Milka composition without changing its copy or emotional character.
4. Build a responsive image pipeline; compress/re-encode large assets, generate width variants, add dimensions/`srcset`/`sizes`, and prioritize the hero correctly.
5. Remove fixed-height clipping risk from wedding details, dress code, desktop Milka, and desktop proposal; provide normal-flow reduced-motion layouts.
6. Fix WCAG issues: small-text contrast, form error associations, focus visibility, carousel semantics, and 24×24 minimum targets.
7. Put a scannable date/venue/map/RSVP summary or quick navigation near the top so guest tasks do not depend on traversing the full story.
8. Replace stock/placeholder imagery with authentic approved photography and confirm final ceremony data.

### Medium Priority

1. Simplify motion to a small vocabulary and remove layout-affecting scroll animation.
2. Rework the dress-code section for one-column small-mobile flow and readable type.
3. Align RSVP color, typography, button, and feedback styles with the invitation system.
4. Reduce the total vertical duration of story and Milka content.
5. Define semantic color, typography, spacing, elevation, radius, and motion tokens.
6. Add a deliberate art-direction/focal-point model for replaceable images.

### Low Priority

1. Remove unused fonts, the Material Symbols font, dead components, unmounted placeholder content, and legacy CSS.
2. Consolidate repeated easing, shadow, max-width, and gradient values.
3. Add subtle hacienda/botanical material cues only after usability and performance work is complete.
4. Consider a user-facing motion control.

## 12. Recommended Implementation Plan

1. **Lock content and behavior:** confirm ceremony venue/maps, real video URL/player behavior, RSVP storage destination, privacy expectations, final photographs, and guest limits.
2. **Establish measurable acceptance criteria:** WCAG 2.2 AA, target viewport matrix, 200% zoom, keyboard-only flow, reduced-motion flow, and mobile performance budgets.
3. **Fix release blockers:** real RSVP transport, proposal video, focus visibility, form errors, target sizes, and failing contrast roles.
4. **Create the image pipeline:** audit crops, generate AVIF/WebP/JPEG variants, add intrinsic dimensions and responsive markup, set hero priority, and remove unused emitted media.
5. **Restructure guest task flow:** add a compact early summary/quick links while preserving the story as the primary emotional path.
6. **Make layout content-driven:** replace unsafe fixed heights, create static/reflow versions of wedding moments, and make dress code one-column on small screens.
7. **Formalize the design system:** define semantic tokens and align RSVP with the main palette/type system.
8. **Simplify motion:** retain a few calm reveal/transition patterns, remove top/left animation, and verify the full reduced-motion experience.
9. **Refactor components and remove dead code:** split large sections, clarify image roles, eliminate unused content/components/styles/fonts.
10. **Verify:** run production build, Lighthouse/WebPageTest on mobile throttling, axe or equivalent automation, keyboard testing, VoiceOver/NVDA spot checks, real-device QA, and a real end-to-end RSVP submission.

## 13. Files and Components to Review or Modify Later

- `src/App.tsx`: add task-oriented navigation/summary; decide whether journey/gallery belong; preserve reduced-motion config.
- `src/components/sections/HeroSection.tsx`: simplify hierarchy, improve CTA routing, responsive hero sources, dimensions, priority, and focal points.
- `src/components/sections/StorySection.tsx`: reduce motion layers, improve carousel semantics/controls/targets, use responsive crops, remove top/left plane animation and forced remounts.
- `src/components/sections/MilkaSection.tsx`: retain layout, replace caption-based image roles, add responsive sources/focal points, and remove fixed desktop clipping.
- `src/components/sections/ProposalSection.tsx`: connect the real video, repair focus, remove fixed-height risk, and deduplicate video actions.
- `src/components/sections/WeddingDetailsSection.tsx`: provide a scannable/normal-flow event structure, safer mobile layout, reduced-motion alternative, and responsive images.
- `src/components/RSVPForm.tsx`: add accessible validation relationships, focus management, busy state, robust confirmation feedback, and system-aligned styling.
- `src/lib/submitRSVP.ts`: replace mock default with real, secure, retry-safe persistence and useful failure handling.
- `src/data/weddingContent.ts`: finalize venue/video content, remove stock/placeholders, remove unused data or mount it intentionally, and model image roles/focal points explicitly.
- `src/styles.css`: remove dead rules, create semantic design tokens, fix contrast/focus, align RSVP, and add complete reduced-motion/reflow rules.
- `index.html`: remove unused Playfair/Material Symbols requests; consider self-hosting/subsetting critical fonts.
- `src/assets/*`: recompress, resize, convert formats, generate variants, and remove unused originals from the shipped application.
- `src/components/sections/GallerySection.tsx`, `JourneySection.tsx`, and unused shared components: either remove them or complete and audit them before mounting.
- `vite.config.ts`: consider an image-generation plugin/build step only after the desired asset workflow is defined; the current base path is otherwise unrelated to the UX findings.

## 14. Final Recommendation

**Refined.**

Keep the core visual direction, hero concept, alternating story language, proposal emotional peak, Milka content, and overall pacing. Apply targeted structural fixes to guest tasks, RSVP behavior, full-viewport resilience, accessibility, image delivery, and the Milka first-scene composition.

The visual system does not need a rebuild. The most effective path is a sequence of small, verified changes, with the mock RSVP and missing final content treated as release blockers rather than reasons to redesign the site.
