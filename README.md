# Ram Kumar — creative developer portfolio

A complete original Next.js reference implementation inspired by the layout and interaction patterns of [heynesh.com](https://heynesh.com/), with the approved sample Ram Kumar profile. The reference's personal content, source, photos, client assets, proprietary fonts, and branding are not included.

## Run

Node.js 20.9 or later is required.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. In Windows PowerShell with script execution disabled, use `npm.cmd` instead of `npm`. If another app is using port 3000, run `npm.cmd run dev -- --port 4174` and open http://127.0.0.1:4174.

```sh
npm run build
npm start
npm run typecheck
npm run lint
npm run test:e2e
```

## Structure

- `src/data/site.ts`: profile, contact URLs, navigation, timeline, projects, capabilities, skills, service options, FAQ.
- `src/components`: Header, Hero, About, SelectedWork, Capabilities, Skills, Services, CTA, FAQ, Footer, Contact, CustomCursor, and shared UI.
- `src/components/animations/SiteMotion.tsx`: Lenis/GSAP coordination, responsive/reduced-motion cleanup, stable section links and refresh ordering around the pinned gallery.
- `src/components/animations/introMotion.ts`: masked letter-by-letter opening, centre-to-hero name docking, portrait sharpening and staggered detail reveals.
- `src/components/animations/heroMotion.ts`: reversible sticky hero-to-sidebar name, navigation, metric and CTA transitions.
- `src/components/animations/sectionMotion.ts`: masked text lines, rolling year digits, staged journey cards, path drawing and character-by-character scroll reading.
- `src/components/SelectedWork`: desktop ScrollTrigger pinning and horizontal movement; native touch scrolling on smaller screens and for reduced motion.
- `src/styles/globals.css`: design tokens, responsive layouts, micro-interactions, dialog, accordion and reduced-motion styles.
- `public/images`: original artwork. See `docs/ASSETS.md` for provenance and the illustration prompt.
- `docs/REFERENCE-ANALYSIS.md`: observed reference structure and implementation decisions.

## Personalize before publishing

Edit `src/data/site.ts`. Replace the sample profile and illustrative journey with your real material. Add your actual email, optional booking URL and social URLs. Empty social URLs are omitted; an empty email shows the location instead of a fake copy-email action. Change `siteUrl` from `https://example.com` and set `isDemo` to `false` to enable indexing. Replace the illustrated portrait with your own photograph if desired. The original SVG project artwork can be kept or replaced with your own project images.

Contact buttons open an accessible project-brief composer. It validates input and downloads an actual text file, entirely locally. It does not claim to send email or book appointments. Configuring `email` and `bookingUrl` adds real email and scheduling actions. No form backend is included.

## Interaction and accessibility

Scroll-aware navigation, active links, keyboard-accessible mobile menu, smooth anchors, native modal focus trapping and Escape/backdrop dismissal, timeline chapter dialogs, project detail dialogs, capability popovers, service-to-contact selection, single-open FAQ, and back-to-top link. GSAP scopes and ticker listeners are cleaned up on unmount. Reduced motion disables pinning, parallax, automatic movement, and the custom cursor without hiding content. Fonts are self-hosted and the generated portrait uses Next.js image optimization.

## Visual fidelity

The reference's layout, proportions, colors and interaction patterns informed the implementation. Original content and artwork, substitute open fonts, accessible navigation, and a local contact flow intentionally differ. This is not a claim of pixel-identical assets or exact reproduction of every reference animation curve.

## Browser checks

The Playwright suite uses installed Google Chrome by default. Set `PLAYWRIGHT_CHANNEL=msedge` to use Microsoft Edge. Run `npm run build` followed by `npm run test:e2e`; the config starts or reuses the production server at http://127.0.0.1:4173. Reports and screenshots go in ignored `test-results`, `playwright-report`, and `artifacts` directories. See `docs/QA.md` for the completed checks.
