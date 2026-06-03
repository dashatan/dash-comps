import AuthLayout from "@/components/layout/auth";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function AuthPage() {
  return (
    <CatalogPageShell slug="auth">
      <ShowcaseSection title="Auth layout" className="w-full overflow-hidden p-0">
        <div className="border-border h-96 w-full overflow-hidden rounded-xl border">
          <AuthLayout.Root>
            <AuthLayout.Background>
              <div className="from-primary/25 size-full bg-gradient-to-br to-transparent" />
            </AuthLayout.Background>
            <AuthLayout.Content>
              <p className="text-lg font-semibold">Sign in</p>
              <p className="text-muted-foreground text-sm">
                AuthLayout from @/components/layout/auth
              </p>
            </AuthLayout.Content>
          </AuthLayout.Root>
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
