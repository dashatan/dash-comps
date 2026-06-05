import { useMemo, useState, type ReactNode } from "react";
import Banner from "@/components/common/banner";
import { Button } from "@/components/common/buttons";
import {
  showcaseBannerAppearances,
  showcaseBannerImageAligns,
  showcaseBannerImageBlends,
  showcaseBannerImageModes,
  showcaseBannerImageOpacities,
  showcaseBannerImages,
  showcaseBannerLayouts,
  showcaseBannerSeverities,
  showcaseBannerSizes,
} from "@/features/catalog/data/banner-samples";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

function BannerStack({ children }: { children: ReactNode }) {
  return <div className="flex w-full min-w-0 flex-col gap-4">{children}</div>;
}

function LabeledBanner({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

export function BannerPage() {
  const p = useShowcasePage("banner");
  const [dismissed, setDismissed] = useState(false);
  const [clicks, setClicks] = useState(0);
  const isRtl = useMemo(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.dir === "rtl";
  }, [document.documentElement.dir]);

  return (
    <CatalogPageShell slug="banner">
      <ShowcaseSection
        title={p("compound.title")}
        description={p("compound.description")}
        layout="stack"
      >
        <Banner
          size="lg"
          severity="primary"
          rounded="xl"
          shadow="sm"
          src={showcaseBannerImages.workspace}
          imageMode="cover"
        >
          <Banner.Badge>{p("compound.badge")}</Banner.Badge>
          <Banner.Title size="lg">{p("compound.heading")}</Banner.Title>
          <Banner.Description size="lg">
            {p("compound.subheading")}
          </Banner.Description>
          <Banner.Actions>
            <Button size="sm">{p("compound.primaryAction")}</Button>
            <Button size="sm" variant="outlined">
              {p("compound.secondaryAction")}
            </Button>
          </Banner.Actions>
        </Banner>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("severities.title")}
        description={p("severities.description")}
        layout="stack"
      >
        <BannerStack>
          {showcaseBannerSeverities.map((severity) => (
            <Banner
              key={severity}
              size="sm"
              severity={severity}
              appearance="soft"
            >
              <Banner.Title size="sm">
                {p(`severities.${severity}`)}
              </Banner.Title>
              <Banner.Description size="sm">
                {p(`severities.${severity}Description`)}
              </Banner.Description>
            </Banner>
          ))}
        </BannerStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("appearances.title")}
        description={p("appearances.description")}
        layout="stack"
      >
        <BannerStack>
          {showcaseBannerAppearances.map((appearance) => (
            <Banner
              key={appearance}
              size="md"
              severity="primary"
              appearance={appearance}
            >
              <Banner.Title size="md">
                {p(`appearances.${appearance}`)}
              </Banner.Title>
              <Banner.Description
                size="md"
                className={
                  appearance === "solid"
                    ? "text-primary-foreground/80"
                    : undefined
                }
              >
                {p(`appearances.${appearance}Description`)}
              </Banner.Description>
            </Banner>
          ))}
        </BannerStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sizes.title")}
        description={p("sizes.description")}
        layout="stack"
      >
        <BannerStack>
          {showcaseBannerSizes.map((size) => (
            <LabeledBanner key={size} label={size}>
              <Banner
                size={size}
                severity="default"
                src={showcaseBannerImages.analytics}
                imageMode="cover"
              >
                <Banner.Title size={size === "hero" ? "hero" : size}>
                  {p("sizes.heading")}
                </Banner.Title>
                <Banner.Description size={size === "hero" ? "hero" : size}>
                  {p("sizes.subheading", { size })}
                </Banner.Description>
              </Banner>
            </LabeledBanner>
          ))}
        </BannerStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("layouts.title")}
        description={p("layouts.description")}
        layout="stack"
      >
        <BannerStack>
          {showcaseBannerLayouts.map((layout) => (
            <Banner
              key={layout}
              size="md"
              severity="secondary"
              layout={layout}
              src={showcaseBannerImages.team}
              imageMode="cover"
            >
              <Banner.Title size="md">{p(`layouts.${layout}`)}</Banner.Title>
              <Banner.Description size="md">
                {p(`layouts.${layout}Description`)}
              </Banner.Description>
              {layout === "row" ? (
                <Banner.Actions>
                  <Button size="sm" variant="outlined">
                    {p("layouts.action")}
                  </Button>
                </Banner.Actions>
              ) : null}
            </Banner>
          ))}
        </BannerStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("imageModes.title")}
        description={p("imageModes.description")}
        layout="stack"
      >
        <BannerStack>
          {showcaseBannerImageModes.map((imageMode) => (
            <LabeledBanner key={imageMode} label={p(`imageModes.${imageMode}`)}>
              <Banner
                size="lg"
                severity="default"
                src={showcaseBannerImages.business}
                imageMode={imageMode}
                imageAlign={isRtl ? "start" : "end"}
                imageSize="70%"
                imageBlend={imageMode === "cover" ? "overlay" : "none"}
                imageOpacity={imageMode === "cover" ? "strong" : "default"}
              >
                <Banner.Title size="lg">{p("imageModes.heading")}</Banner.Title>
                <Banner.Description size="lg">
                  {p("imageModes.subheading", {
                    mode: p(`imageModes.${imageMode}`),
                  })}
                </Banner.Description>
              </Banner>
            </LabeledBanner>
          ))}
        </BannerStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("imageAlign.title")}
        description={p("imageAlign.description")}
        layout="stack"
      >
        <BannerStack>
          {showcaseBannerImageAligns.map((imageAlign) => (
            <LabeledBanner
              key={imageAlign}
              label={p(`imageAlign.${imageAlign}`)}
            >
              <Banner
                size="md"
                severity="info"
                src={showcaseBannerImages.workspace}
                imageMode="decor"
                imageAlign={imageAlign}
                imageSize="40%"
              >
                <Banner.Title size="md">{p("imageAlign.heading")}</Banner.Title>
                <Banner.Description size="md">
                  {p("imageAlign.subheading", {
                    align: p(`imageAlign.${imageAlign}`),
                  })}
                </Banner.Description>
              </Banner>
            </LabeledBanner>
          ))}
        </BannerStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("imageBlend.title")}
        description={p("imageBlend.description")}
        layout="stack"
      >
        <BannerStack>
          {showcaseBannerImageBlends.map((imageBlend) => (
            <LabeledBanner key={imageBlend} label={imageBlend}>
              <Banner
                size="md"
                severity="warning"
                src={showcaseBannerImages.analytics}
                imageMode="decor"
                imageBlend={imageBlend}
                imageSize="45%"
              >
                <Banner.Title size="md">{p("imageBlend.heading")}</Banner.Title>
                <Banner.Description size="md">
                  {p("imageBlend.subheading", { blend: imageBlend })}
                </Banner.Description>
              </Banner>
            </LabeledBanner>
          ))}
        </BannerStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("imageOpacity.title")}
        description={p("imageOpacity.description")}
        layout="stack"
      >
        <BannerStack>
          {showcaseBannerImageOpacities.map((imageOpacity) => (
            <LabeledBanner key={imageOpacity} label={imageOpacity}>
              <Banner
                size="md"
                severity="success"
                src={showcaseBannerImages.team}
                imageMode="decor"
                imageOpacity={imageOpacity}
                imageSize="50%"
              >
                <Banner.Title size="md">
                  {p("imageOpacity.heading")}
                </Banner.Title>
                <Banner.Description size="md">
                  {p("imageOpacity.subheading", { opacity: imageOpacity })}
                </Banner.Description>
              </Banner>
            </LabeledBanner>
          ))}
        </BannerStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("hero.title")}
        description={p("hero.description")}
        layout="stack"
      >
        <Banner
          size="hero"
          severity="default"
          rounded="xl"
          shadow="md"
          layout="center"
          src={showcaseBannerImages.business}
          imageMode="cover"
          imageBlend="overlay"
          imageOpacity="strong"
          contentAlign="center"
        >
          <Banner.Title size="hero">{p("hero.heading")}</Banner.Title>
          <Banner.Description size="hero">
            {p("hero.subheading")}
          </Banner.Description>
          <Banner.Actions>
            <Button>{p("hero.action")}</Button>
          </Banner.Actions>
        </Banner>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("dismissible.title")}
        description={p("dismissible.description")}
        layout="stack"
      >
        {dismissed ? (
          <p className="text-sm text-muted-foreground">
            {p("dismissible.dismissed")}
          </p>
        ) : (
          <Banner
            size="md"
            severity="info"
            dismissible
            onDismiss={() => setDismissed(true)}
            src={showcaseBannerImages.workspace}
            imageMode="decor"
            imageSize="35%"
          >
            <Banner.Title size="md">{p("dismissible.heading")}</Banner.Title>
            <Banner.Description size="md">
              {p("dismissible.subheading")}
            </Banner.Description>
          </Banner>
        )}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("interactive.title")}
        description={p("interactive.description")}
        layout="stack"
      >
        <Banner
          size="lg"
          severity="primary"
          interactive
          rounded="xl"
          shadow="sm"
          src={showcaseBannerImages.team}
          imageMode="decor"
          onClick={() => setClicks((count) => count + 1)}
        >
          <Banner.Title size="lg">{p("interactive.heading")}</Banner.Title>
          <Banner.Description size="lg">
            {p("interactive.subheading")}
          </Banner.Description>
          <p className="text-sm text-muted-foreground">
            {p("interactive.clicks", { count: clicks })}
          </p>
        </Banner>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("legacyImage.title")}
        description={p("legacyImage.description")}
        layout="stack"
      >
        <Banner
          size="md"
          severity="muted"
          image={{ src: showcaseBannerImages.analytics }}
          imageMode="decor"
        >
          <Banner.Title size="md">{p("legacyImage.heading")}</Banner.Title>
          <Banner.Description size="md">
            {p("legacyImage.subheading")}
          </Banner.Description>
        </Banner>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
