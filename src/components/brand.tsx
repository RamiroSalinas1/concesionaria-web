import { siteConfig } from "@/config/site";

export function Brand({ compact = false }: { compact?: boolean }) {
  const words = siteConfig.name.split(" ");
  return (
    <span className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-symbol" aria-hidden="true">
        <i />
        <i />
      </span>
      <span className="brand-wordmark">
        <span>{words.slice(0, -1).join(" ")}</span>
        <strong>{words.at(-1)}</strong>
      </span>
    </span>
  );
}
