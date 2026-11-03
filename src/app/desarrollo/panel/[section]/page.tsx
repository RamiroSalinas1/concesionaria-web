import { notFound } from "next/navigation";

export default async function AdminDemoPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  if (process.env.NODE_ENV === "development") {
    const { section } = await params;
    const [{ AdminDemo }, { adminSections }] = await Promise.all([
      import("@/dev/admin-demo"),
      import("@/dev/admin-sections"),
    ]);
    const selected = adminSections.find((item) => item.id === section);
    if (!selected) notFound();
    return <AdminDemo section={selected.id} />;
  }
  notFound();
}
