# Verification

## Completed

- Next.js production build succeeds; the home page, favicon, Open Graph image and not-found route are generated.
- TypeScript and ESLint validate the application and test source. Generated browser reports are excluded from linting.
- 35 Playwright checks pass in Google Chrome against the production build, including eight dedicated motion regression checks.
- Layout checks pass at 320, 375, 390, 425, 768, 820, 1024, 1280, 1366, 1440, 1536, 1920 and 2560 pixels with no document-level horizontal overflow.
- Desktop and mobile axe WCAG 2 A/AA and 2.1 AA scans have no reported violations in the tested states, including the visible sidebar and contact dialog. Automated checks do not replace a full accessibility audit.
- Verified desktop and mobile navigation, active links, Escape/backdrop dismissal, modal focus containment and restoration, timeline chapter navigation, project detail navigation, capability popovers, service selection, form validation and a real brief download.
- Verified testimonial buttons, segmented controls, keyboard navigation and dragging; native touch swipes on both galleries; single-open FAQ keyboard operation; reduced-motion behavior; desktop pinned scrolling and custom cursor; mobile menu navigation with motion enabled.
- Verified original images load and the initial production page has no browser console errors or warnings.
- Reviewed desktop section captures and mobile/tablet captures against the reference inspection. Fixed initial wordmark clipping, mobile CTA/copy overlap, SVG escaping, anchor offsets, text contrast, and sidebar accessibility labels.
- Re-inspected the reference frame by frame and verified the letter-by-letter name opening, centre-to-top docking, portrait sharpening, sticky hero-to-sidebar morph, wheel-driven forward/reverse travel, rolling year digits, replayable journey cards, drawn path and reversible character reading effect.
- Tested keyboard interruption during the opening, direct hash navigation and reload, desktop/mobile breakpoint changes, live reduced-motion changes, and accessible split text with motion enabled. Fixed ScrollTrigger refresh ordering so project pin spacing is included in later animation ranges and hash destinations.
- Repeated the 13-width layout review with motion enabled: no document-level overflow or JavaScript errors. Chrome emitted portrait preload warnings while changing responsive image sizes in the same page session; the images loaded correctly.
- Final visual corrections preserve complete words during character animation and keep the portrait, heading and badges within the sticky stage on wide screens. The motion accessibility check waits for staged fades to settle before evaluating contrast.

## Scope and limitations

### Portrait refresh regression

The intro previously used `clearProps: "all"` on the Next.js image, which also removed its `fill` positioning and sizing. Its final size could then depend on the browser-selected image resource. Animation now runs on a dedicated wrapper and only clears animation-owned properties. Desktop portrait and backdrop share explicit geometry calibrated to the approved screenshot, including when the intro is skipped or reduced motion is active.

`tests/portrait.spec.ts` checks the settled entrance and cleanup frames, cached and cache-bypassing reloads at pixel densities 1 and 2, a fresh hash-link visit, reduced motion, and resizing during the intro.

Visual and interaction testing uses Chrome/Chromium. Safari and Firefox have not been independently tested. The reference's proprietary fonts and personal/client assets are deliberately replaced, so the result is a close original reference implementation rather than a pixel-identical copy. The contact flow downloads a local brief; email and scheduling require real configuration. No message delivery backend is included.

## Reproduce

```sh
npm run build
npm run typecheck
npm run lint
npm run test:e2e
```

For screenshots with a production server running on port 4173:

```sh
node scripts/visual-check.mjs
```

Use `npm.cmd` on Windows if PowerShell blocks the npm script wrapper.
