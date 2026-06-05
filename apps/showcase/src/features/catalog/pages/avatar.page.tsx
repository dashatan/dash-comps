import { UserAvatar } from "@/components/common/avatar";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

export function AvatarPage() {
  const p = useShowcasePage("avatar");

  return (
    <CatalogPageShell slug="avatar">
      <ShowcaseSection title={p("sizes.title")} description={p("sizes.description")}>
        <UserAvatar user={{ first_name: "Sara", username: "sara" }} size={32} />
        <UserAvatar user={{ first_name: "Ali", username: "ali" }} size={48} />
        <UserAvatar user={{ username: "guest" }} size={56} showBorder />
      </ShowcaseSection>
      <ShowcaseSection title={p("fallbackInitials.title")} delay={0.05}>
        <UserAvatar user={{ first_name: "Reza", last_name: "Karimi" }} size={40} />
        <UserAvatar user={{ username: "no_name" }} size={40} />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
