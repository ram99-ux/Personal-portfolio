# Reference inspection — 30 September 2026

Reference: https://heynesh.com/. Inspected rendered Chrome desktop (1440×1000) and mobile (390×844), page geometry, navigation, timeline, project scroll, capability panels, services, testimonial track, and FAQ. The connected Browser runtime exposed no browsers, so local headless Chrome was used for inspection and verification.

## Observed design

- Base: #d5cfbe; fluorescent yellow approximately #ffff00; cream #f8f7f3; pure black text. Glass panels use translucent cream, subtle pale borders, 8–12 px corner radii and backdrop blur.
- Full-width hero: yellow oversized wordmark behind a centered cutout portrait. Desktop navigation splits around the portrait beneath the wordmark. Three stacked headline lines overlay the dark shirt. Floating glass badges, two yellow CTAs, side-aligned introduction and description.
- At 1440 px, page edge inset is 20–40 px, the fixed sidebar is about 267 px wide, and content begins at x≈302 px. Sidebar appears as the hero exits and contains identity, metrics, section links, scrolling labels, copy-email control and contact CTA.
- Reference fonts are proprietary Tr 3 A and PP Neue Montreal. Use locally bundled OFL Archivo and Manrope for comparable broad display proportions and compact body rhythm; do not redistribute reference font files.
- Desktop hero heading ≈76 px; section headings ≈66 px; capability title ≈180 px. Body ≈17 px/27 px. Display tracking is tight.
- About section has large breathing room, a fixed blurred portrait backdrop, staggered translucent story cards with large yellow years and a long curved black/yellow progression line.
- Selected work changes to black. Portrait cards form a horizontally moving, vertically pinned track; rounded image panels have tag pills, index, title and a round yellow arrow.
- Capabilities: huge centered two-line heading, scroll-revealed statement, inline icon controls that reveal descriptive capability panels.
- Services: three adjoining pale panels, first tinted darker, icon tiles, large price/value, feature checklists and CTA.
- Large editorial contact section, chat-bubble interaction. Testimonials are a draggable horizontal track with segmented navigation and no timed autoplay.
- FAQ: giant wordmark above a two-column accordion grid. Cards animate expansion and plus/minus.
- Mobile: compact fixed bar (wordmark, contact, four-dot menu); smaller giant wordmark behind portrait; badges repositioned; no desktop sidebar; stacked sections, touch-scroll project/testimonial tracks, single-column services and FAQ.

## Original implementation choices

Use the approved Ram Kumar sample profile, explicit demonstration projects/testimonials/timeline, original generated illustration, custom SVG project compositions and custom textual wordmark. No reference source, photos, logos, client names, prices, copy, or downloadable assets are reused. Contact opens a working local project-brief composer with downloadable .txt output until genuine contact/scheduling URLs are supplied. Do not claim messages are sent or bookings made.

## Layout and motion plan

Desktop: layered full-width hero → left fixed sidebar + offset main sections → black pinned project gallery → warm capability/service/testimonial/FAQ sections. Mobile: compact header + vertically stacked content with native horizontal touch galleries. GSAP scoped contexts own intro, parallax, SVG drawing, word reveal and pinning. Lenis shares the GSAP ticker. Reduced motion keeps all content visible, disables pinning/cursor/automatic movement and uses native scrolling. Native dialogs provide modal focus trapping and Escape, with focus restored on close.

## Frame-by-frame motion correction

Re-inspected the rendered reference at 1440×1000 after feedback that the opening and scroll animations were missing. Screenshots and computed DOM states are saved under `artifacts/reference-motion/` and `artifacts/reference-motion-sections/`. Reference scripts and assets were not copied.

- Opening: the full-width yellow name starts centred vertically on an opaque paper background. Letters rise through a bottom mask in sequence while the name shifts left into alignment. The completed word holds briefly, then docks at the hero’s top inset. The curtain fades while the portrait scales up and sharpens; headline lines, navigation, badges and buttons follow with overlapping blur reveals. Observed reference frames show staggered letters around 1.5s, a completed central name around 2.1s, docking/portrait reveal around 2.8s, and final details through roughly 4s. Network loading affects absolute times.
- Desktop hero: a sticky 100vh stage sits inside a 300vh section. The following section overlaps its last 130vh, beginning around scrollY 1700 at this viewport. Over the first 150vh of scroll, the name contracts toward the sidebar logo, split navigation links travel independently into a vertical list, metrics migrate toward the sidebar, the secondary CTA fades and the primary CTA moves left. Headline scrolls upwards while the portrait stays in place and progressively blurs. The sidebar fills in as the moving elements arrive. This transition reverses with scroll.
- Journey: cards begin at about scale .6, opacity 0, and y 10%. Entry has an approximately .3s delay and strong ease-out, settling around 1.4s. Separate masked year digits roll for roughly 1.6s. Heading/body lines rise through masks, then icons and the Read more control appear. Cards reset above their entry threshold and replay on re-entry.
- Headings/body/CTA: masked line reveals, approximately .3s delay, .6s duration and .1s stagger. These remain revealed after first entry.
- Capability statement: individual characters, opacity .1→1 and y 5px→0, controlled continuously by scroll and reversible. Approximate range: statement top at 92% of viewport to statement bottom at 67%.
- Capability display heading, service panels and footer wordmark remain static in the inspected reference. No invented CTA colour-fill animation was added.

The implementation uses original RAM lettering and the approved sample content. Font metrics, portrait and line lengths differ from the reference, so docking targets are measured from the live layout rather than hard-coded reference coordinates. Intro and scroll timelines animate separate layers. Keyboard input, intentional scrolling, links and resize can interrupt the opening; hash links, restored history and reduced motion skip it. A pre-paint marker avoids flashing the completed hero before the intro, with a timeout fallback if hydration fails.
