/**
 * Prose whose words brighten from grey to full ink as they scroll up the screen, so the
 * paragraph is read in step with the scroll. Pure CSS (see .lit-word); where scroll-driven
 * animation is unsupported the words simply render in full ink.
 */
export function ScrollLitText({ text, className = "" }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n+/).filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, p) => (
        <p key={p} className={p > 0 ? "mt-5" : undefined}>
          {paragraph.split(/\s+/).map((word, w) => (
            <span key={w} className="lit-word">
              {word}{" "}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
