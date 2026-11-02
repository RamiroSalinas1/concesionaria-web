import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Demostración local",
  robots: { index: false, follow: false },
};

export default function DevelopmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  return children;
}
