import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource-variable/manrope";
import { fontPairs, siteConfig } from "@/config/site";
import { RouteScroll } from "@/components/route-scroll";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const { theme } = siteConfig;
  const fonts = fontPairs[theme.fontPair];
  const tokens = {
    "--background": theme.background,
    "--surface": theme.surface,
    "--elevated": theme.elevated,
    "--foreground": theme.foreground,
    "--muted": theme.muted,
    "--accent": theme.accent,
    "--accent-hover": theme.accentHover,
    "--line": theme.line,
    "--font-display": fonts.display,
    "--font-body": fonts.body,
  } as CSSProperties;
  return (
    <html lang="es-AR" style={tokens} data-scroll-behavior="smooth">
      <body>
        <RouteScroll />
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
