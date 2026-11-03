export type FontPair = "sport";
export type HomeSection = "hero" | "categories" | "featured";

export interface SiteConfig {
  name: string;
  description: string;
  theme: {
    background: string;
    surface: string;
    elevated: string;
    foreground: string;
    muted: string;
    accent: string;
    accentHover: string;
    line: string;
    fontPair: FontPair;
  };
  sections: { id: HomeSection; visible: boolean }[];
  navigation: { label: string; href: string }[];
  contact: { email: string | null; whatsapp: string | null };
  social: { label: string; href: string }[];
  copy: {
    catalogCta: string;
    home: {
      eyebrow: string;
      title: [string, string];
      description: string;
      secondaryCta: string;
      graphicLabel: string;
      artEyebrow: string;
      artFooter: string;
      featuredEyebrow: string;
      featuredTitle: string;
      featuredDescription: string;
    };
    empty: { title: string; description: string };
    catalog: {
      eyebrow: string;
      title: string;
      description: string;
      emptyTitle: string;
      filteredEmptyDescription: string;
      footnote: [string, string];
    };
    footer: string;
  };
}

export const fontPairs = {
  sport: {
    display: '"Barlow Condensed", Impact, sans-serif',
    body: '"Manrope Variable", Arial, sans-serif',
    label: "Barlow Condensed + Manrope",
  },
} satisfies Record<FontPair, { display: string; body: string; label: string }>;

export const siteConfig: SiteConfig = {
  name: "Concesionaria Demo",
  description:
    "Autos, motos y otros vehículos. Conocé el catálogo de Concesionaria Demo.",
  theme: {
    background: "#101113",
    surface: "#181a1d",
    elevated: "#222529",
    foreground: "#f5f3ef",
    muted: "#a8acb3",
    accent: "#db202c",
    accentHover: "#bd1722",
    line: "#35383e",
    fontPair: "sport",
  },
  sections: [
    { id: "hero", visible: true },
    { id: "categories", visible: true },
    { id: "featured", visible: true },
  ],
  navigation: [
    { label: "Inicio", href: "/" },
    { label: "Catálogo", href: "/catalogo" },
    { label: "Destacados", href: "/#destacados" },
  ],
  contact: { email: null, whatsapp: null },
  social: [],
  copy: {
    catalogCta: "Explorar catálogo",
    home: {
      eyebrow: "Autos. Motos. Nuevos caminos.",
      title: ["Tu próximo", "capítulo."],
      description:
        "Hay caminos que empiezan con una decisión. Encontrá eso que te mueve.",
      secondaryCta: "Conocé los destacados",
      graphicLabel: "El movimiento es el punto de partida.",
      artEyebrow: "Pasión en cada dirección",
      artFooter: "Diseñado para moverte",
      featuredEyebrow: "Una selección para vos",
      featuredTitle: "Los próximos protagonistas.",
      featuredDescription:
        "Este espacio es para los vehículos destacados de nuestro catálogo.",
    },
    empty: {
      title: "El próximo puede ser el tuyo.",
      description:
        "Todavía no hay vehículos publicados. Cuando estén disponibles, vas a encontrarlos acá.",
    },
    catalog: {
      eyebrow: "Encontrá lo que te mueve",
      title: "El camino empieza acá.",
      description: "Autos, motos y otros vehículos. Explorá a tu manera.",
      emptyTitle: "Un nuevo camino está por empezar.",
      filteredEmptyDescription:
        "Todavía no hay vehículos publicados para consultar. Tus filtros quedaron aplicados; podés modificarlos o limpiarlos.",
      footnote: [
        "Autos, motos y otras posibilidades.",
        "Tu próximo capítulo empieza con vos.",
      ],
    },
    footer: "Nuevos caminos. La misma pasión por moverse.",
  },
};

export const vehicleTypes = [
  {
    value: "auto",
    label: "Autos",
    detail: "Tu próxima dirección",
    singular: "Auto",
  },
  {
    value: "moto",
    label: "Motos",
    detail: "Otra forma de moverte",
    singular: "Moto",
  },
  {
    value: "otro",
    label: "Otros vehículos",
    detail: "Más posibilidades",
    singular: "Otro vehículo",
  },
] as const;

export const paymentMethods = [
  { id: "cash", label: "Contado" },
  { id: "bank_transfer", label: "Transferencia" },
  { id: "financing", label: "Financiación" },
  { id: "trade_in", label: "Permuta" },
] as const;
