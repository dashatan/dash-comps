import AuthLayout from "@/components/layout/auth";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

export function AuthPage() {
  const p = useShowcasePage("auth");

  return (
    <CatalogPageShell slug="auth">
      <ShowcaseSection title={p("authLayout.title")} className="w-full overflow-hidden p-0">
        <div className="border-border h-96 w-full overflow-hidden rounded-xl border">
          <AuthLayout.Root>
            <AuthLayout.Background>
              <div className="from-primary/25 size-full bg-gradient-to-br to-transparent" />
            </AuthLayout.Background>
            <AuthLayout.Content>
              <p className="text-lg font-semibold">{p("authLayout.signIn")}</p>
              <p className="text-muted-foreground text-sm">{p("authLayout.description")}</p>
            </AuthLayout.Content>
          </AuthLayout.Root>
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
