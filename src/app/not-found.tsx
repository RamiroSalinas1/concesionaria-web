import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NotFoundView } from "@/components/not-found-view";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" tabIndex={-1}>
        <NotFoundView />
      </main>
      <SiteFooter />
    </>
  );
}
