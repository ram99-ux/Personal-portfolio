import { profile } from "@/data/site";
/** Decorative lettering; the profile name is available as normal text nearby. */
export function DisplayWordmark() {
  return (
    <svg viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
      {Array.from(profile.wordmark).map((letter, index, letters) => (
        <g className="wordmark-letter" key={`${letter}-${index}`}>
          <text
            x={(index * 1000) / letters.length}
            y="257"
            textLength={1000 / letters.length - 15}
            lengthAdjust="spacingAndGlyphs"
          >
            {letter}
          </text>
        </g>
      ))}
    </svg>
  );
}
