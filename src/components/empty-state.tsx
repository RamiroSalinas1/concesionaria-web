import { CarFront } from "lucide-react";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

export function EmptyState({
  title = siteConfig.copy.empty.title,
  description = siteConfig.copy.empty.description,
  children,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-art" aria-hidden="true">
        <span />
        <CarFront size={48} strokeWidth={1} />
        <span />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
