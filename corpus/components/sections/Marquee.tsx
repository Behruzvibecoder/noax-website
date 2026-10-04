/**
 * Infinite marquee of anatomical terms, lifted from Noax's marquee treatment:
 * oversized display type, accent drop-shadow, pauses on hover, seamless loop
 * built from a duplicated track.
 */
export function Marquee({
  items,
  reverse = false,
  duration = 38,
}: {
  items: string[];
  reverse?: boolean;
  duration?: number;
}) {
  return (
    <div
      className="cx-marquee-host relative overflow-hidden py-[var(--spacing-fluid-md)]"
      aria-hidden="true"
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div className="cx-marquee" data-reverse={reverse ? "true" : "false"}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <li
                key={`${copy}-${item}`}
                className="flex items-center font-[var(--font-display)] font-medium leading-none whitespace-nowrap [font-size:var(--font-size-marquee)]"
                style={{
                  color: copy === 0 ? "var(--cx-foreground)" : "var(--cx-foreground)",
                  textShadow: "0 0 0.14em color-mix(in oklab, var(--color-blush) 55%, transparent)",
                }}
              >
                {item}
                <span
                  className="mx-[0.28em] inline-block size-[0.14em] rounded-full bg-[var(--color-blush)]"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
