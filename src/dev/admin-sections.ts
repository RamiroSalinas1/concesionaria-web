export const adminSections = [
  {
    id: "vehiculos",
    label: "Vehículos",
    description: "Cada vehículo, en su lugar.",
  },
  {
    id: "apariencia",
    label: "Apariencia",
    description: "Una identidad con tu carácter.",
  },
  {
    id: "contenido",
    label: "Contenido",
    description: "Tu historia, a tu manera.",
  },
  {
    id: "contacto",
    label: "Contacto",
    description: "Los caminos para encontrarte.",
  },
  {
    id: "historial",
    label: "Historial",
    description: "Cada cambio tiene su historia.",
  },
] as const;

export type AdminSection = (typeof adminSections)[number]["id"];
