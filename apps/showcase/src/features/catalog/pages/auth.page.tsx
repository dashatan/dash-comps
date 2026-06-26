import AuthLayout from "@/components/layout/auth";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

export function AuthPage() {
  const p = useShowcasePage("auth");

  return (
    <CatalogPageShell slug="auth">
      <ShowcaseSection
        title={p("authLayout.title")}
        className="w-full overflow-hidden p-0"
      >
        <div className="h-96 w-full overflow-hidden rounded-xl border border-border">
          <AuthLayout.Root>
            <AuthLayout.Background>
              <div className="size-full bg-gradient-to-br from-primary/25 to-transparent" />
            </AuthLayout.Background>
            <AuthLayout.Content>
              <p className="text-lg font-semibold">{p("authLayout.signIn")}</p>
              <p className="text-sm text-muted-foreground">
                {p("authLayout.description")}
              </p>
            </AuthLayout.Content>
          </AuthLayout.Root>
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
