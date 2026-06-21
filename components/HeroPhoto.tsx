import Image from "next/image";
import type { Branch } from "@/lib/types";

export function HeroPhoto({
  branch,
  className = "",
  priority = false,
}: {
  branch: Branch;
  className?: string;
  priority?: boolean;
}) {
  if (!branch.heroImage) return null;

  return (
    <div
      className={`relative overflow-hidden bg-[var(--surface-2)] ${className}`}
      aria-hidden
    >
      <Image
        src={branch.heroImage}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 42vw, 100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(0 0 0 / 0.02), rgb(0 0 0 / 0.28))",
        }}
      />
    </div>
  );
}
