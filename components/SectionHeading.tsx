export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2
        className="font-display balance text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-tight tracking-tightish"
        style={{ color: "var(--text-strong)" }}
      >
        {title}
      </h2>
      {intro && (
        <p
          className="mt-4 text-base leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
