import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
const destination = join(process.cwd(), "public", "images");
mkdirSync(destination, { recursive: true });
// Each composition is tinted from its own project card colour, so the artwork
// and the card it sits on stay in the same family.
const tint = (hex, amount) => {
  const n = parseInt(hex.slice(1), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(c + (255 - c) * amount),
  );
  return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};
const concepts = [
  ["personal-portfolio", "#214638", "A developer", "portfolio.", "Selected work", "editorial"],
  ["ai-eternity-tourist-guide", "#4938A8", "Where to", "next?", "Plan your trip", "phone", "↗", "Explore destinations"],
  ["instagram-clone", "#A83265", "Share the", "moment.", "Your feed", "phone", "♥", "See what’s new"],
  ["student-information-management", "#176B87", "Every record,", "in order.", "Student overview", "dashboard"],
  ["whatsapp-work-update-automation", "#16866B", "Updates,", "handled.", "Daily automation", "dashboard"],
  ["cms-website-integration", "#344B80", "One source", "of content.", "Content overview", "dashboard"],
  ["organic-heritage-store", "#526B36", "Grown with", "care.", "Organic essentials", "editorial"],
  ["vision-infinite", "#9A652D", "Ideas that", "stand out.", "Branding and events", "editorial"],
  ["rewild-greens-spices", "#47613C", "Rooted in", "flavour.", "Greens and spices", "editorial"],
  ["biometric-attendance-automation", "#315A75", "Every day,", "accounted for.", "Attendance overview", "dashboard"],
].map(([name, base, line1, line2, label, type, metric, cta]) => [
  name,
  base,
  tint(base, 0.42),
  tint(base, 0.86),
  line1,
  line2,
  label,
  type,
  metric ?? "76%",
  cta ?? "See the work",
]);
for (const [
  name,
  dark,
  mid,
  light,
  line1,
  line2,
  label,
  type,
  metric,
  cta,
] of concepts) {
  const geometry = Array.from(
    { length: 8 },
    (_, i) =>
      `<ellipse cx="${400 + i * 28}" cy="${250 + i * 42}" rx="${170 + i * 59}" ry="${300 + i * 33}" fill="none" stroke="${light}" opacity=".1" stroke-width="1.4" transform="rotate(-29 400 400)"/>`,
  ).join("");
  const phone = `<g transform="translate(254 165) rotate(-11 150 290)"><rect x="-9" y="-9" width="318" height="578" rx="43" fill="#171c18" stroke="#c6ccbb" stroke-width="3"/><rect width="300" height="560" rx="34" fill="${light}"/><rect x="107" y="10" width="86" height="19" rx="10" fill="#171c18"/><text x="24" y="66" fill="${dark}" font-size="19" font-weight="700">${name}.</text><path d="M252 57h22m-22 6h22" stroke="${dark}" stroke-width="2"/><text x="24" y="136" fill="${dark}" font-size="37" font-weight="700" letter-spacing="-2">${line1}</text><text x="24" y="177" fill="${dark}" font-size="34" font-weight="700" letter-spacing="-2">${line2}</text><text x="24" y="213" fill="${dark}" font-size="12">${label}</text><rect x="24" y="240" width="252" height="186" rx="16" fill="${mid}"/><circle cx="149" cy="330" r="63" fill="none" stroke="${light}" stroke-width="15" opacity=".35"/><circle cx="149" cy="330" r="63" fill="none" stroke="${light}" stroke-width="15" stroke-dasharray="270 400" stroke-linecap="round" transform="rotate(-90 149 330)"/><text x="148" y="340" text-anchor="middle" fill="${light}" font-size="36" font-weight="700">${metric}</text><rect x="24" y="448" width="252" height="41" rx="20" fill="${dark}"/><text x="150" y="474" text-anchor="middle" fill="${light}" font-size="12">${cta}   ↗</text><rect x="107" y="536" width="86" height="4" rx="2" fill="${dark}" opacity=".4"/></g>`;
  const bars = [60, 95, 70, 145, 125, 190, 157, 219, 185, 240]
    .map(
      (h, i) =>
        `<rect x="${177 + i * 31}" y="${381 - h * 0.65}" width="18" height="${h * 0.65}" rx="5" fill="${i % 3 === 0 ? mid : dark}" opacity="${0.35 + i * 0.06}"/>`,
    )
    .join("");
  const dashboard = `<g transform="translate(93 233) rotate(-7 310 210)"><rect x="-9" y="-9" width="638" height="450" rx="20" fill="#18201d" stroke="${light}" stroke-width="2"/><rect width="620" height="432" rx="13" fill="${light}"/><path d="M0 43h620M126 43v388" stroke="${dark}" opacity=".13"/><circle cx="20" cy="22" r="4" fill="${dark}" opacity=".35"/><circle cx="35" cy="22" r="4" fill="${dark}" opacity=".25"/><circle cx="50" cy="22" r="4" fill="${dark}" opacity=".15"/><text x="245" y="26" font-size="10" fill="${dark}" opacity=".55">${name}.concept / overview</text><text x="20" y="83" font-size="23" font-weight="700" fill="${dark}">${name}.</text>${["Overview", "Projects", "Activity", "Your team"].map((x, i) => `<rect x="12" y="${113 + i * 36}" width="103" height="27" rx="6" fill="${mid}" opacity="${i === 0 ? ".3" : "0"}"/><text x="23" y="${131 + i * 36}" font-size="10" fill="${dark}">${x}</text>`).join("")}<text x="150" y="86" font-size="25" font-weight="700" fill="${dark}">${label}</text><text x="150" y="107" font-size="10" fill="${dark}" opacity=".6">Everything you need, a little more connected.</text>${[0, 1, 2].map((i) => `<rect x="${150 + i * 149}" y="128" width="134" height="72" rx="9" fill="${mid}" opacity=".18"/><text x="${163 + i * 149}" y="150" font-size="10" fill="${dark}">${["In progress", "This month", "Making moves"][i]}</text><text x="${163 + i * 149}" y="180" font-size="26" fill="${dark}" font-weight="700">${["24", "86%", "+18"][i]}</text>`).join("")}<rect x="150" y="220" width="441" height="184" rx="10" fill="${mid}" opacity=".1"/><path d="M164 380h400" stroke="${dark}" opacity=".15"/>${bars}<text x="515" y="257" font-size="11" fill="${dark}">↗ 24%</text></g>`;
  const editorial = `<g transform="translate(123 158) rotate(8 280 290)"><rect x="-8" y="-8" width="571" height="590" rx="15" fill="#1d201a" stroke="${light}" stroke-width="2"/><rect width="555" height="574" rx="9" fill="${light}"/><text x="29" y="48" fill="${dark}" font-size="23" font-weight="700">${name}.</text><text x="421" y="44" fill="${dark}" font-size="9">STUDIO  /  WORK</text><text x="28" y="124" font-size="51" font-weight="700" fill="${dark}" letter-spacing="-2">${line1}</text><text x="28" y="181" font-size="51" font-weight="700" fill="${dark}" letter-spacing="-2">${line2}</text><rect x="28" y="214" width="499" height="275" fill="${mid}"/><path d="M63 489V269h167v220M246 489V239h244v250" fill="${dark}" opacity=".45"/><path d="M82 489V290h126v199M267 489V260h90v229M375 489V260h93v229" fill="${light}" opacity=".65"/><path d="M28 489 320 316 527 489" fill="${light}" opacity=".23"/><circle cx="426" cy="312" r="44" fill="${light}" opacity=".45"/><text x="28" y="528" font-size="12" fill="${dark}">${label}</text><text x="493" y="532" font-size="22" fill="${dark}">↗</text></g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100"><defs><linearGradient id="bg" x2=".7" y2="1"><stop stop-color="${dark}"/><stop offset="1" stop-color="${mid}"/></linearGradient><radialGradient id="glow"><stop stop-color="${light}" stop-opacity=".2"/><stop offset="1" stop-color="${light}" stop-opacity="0"/></radialGradient></defs><rect width="800" height="1100" fill="url(#bg)"/><ellipse cx="500" cy="350" rx="600" ry="550" fill="url(#glow)"/>${geometry}<g font-family="Arial,sans-serif">${type === "phone" ? phone : type === "dashboard" ? dashboard : editorial}</g></svg>`;
  writeFileSync(join(destination, `project-${name}.svg`), svg);
}
for (const [name, symbol, subtitle] of [
  ["code", "&lt;/&gt;", "ONE SMALL IDEA."],
  ["stack", "{  }", "PIECE BY PIECE."],
  ["motion", "✳", "MAKE IT FEEL RIGHT."],
]) {
  writeFileSync(
    join(destination, `journey-${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"><rect width="800" height="450" fill="#bbbba5"/><g fill="none" stroke="#d5d5bd" stroke-width="1">${Array.from({ length: 13 }, (_, i) => `<circle cx="400" cy="200" r="${35 + i * 31}"/>`).join("")}</g><rect x="220" y="80" width="360" height="240" rx="24" fill="#292d23" transform="rotate(-5 400 200)"/><text x="400" y="235" text-anchor="middle" fill="#ffff00" font-family="Arial,sans-serif" font-weight="bold" font-size="120">${symbol}</text><text x="400" y="385" text-anchor="middle" fill="#31382a" font-family="Arial,sans-serif" font-size="16" letter-spacing="4">${subtitle}</text></svg>`,
  );
}
console.log(
  "Created 10 original project compositions and 3 journey illustrations.",
);
