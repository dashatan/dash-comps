import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/common/accordion";

export function AccordionPage() {
  const p = useShowcasePage("accordion");

  return (
    <CatalogPageShell slug="accordion">
      <ShowcaseSection title={p("singleCollapsible.title")}>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>{p("singleCollapsible.whatIsLibrary.trigger")}</AccordionTrigger>
            <AccordionContent className="p-4">
              {p("singleCollapsible.whatIsLibrary.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{p("singleCollapsible.darkMode.trigger")}</AccordionTrigger>
            <AccordionContent className="p-4">
              {p("singleCollapsible.darkMode.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{p("singleCollapsible.staticSite.trigger")}</AccordionTrigger>
            <AccordionContent className="p-4">
              {p("singleCollapsible.staticSite.content")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection title={p("multipleOpen.title")} delay={0.05}>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="a">
            <AccordionTrigger>{p("multipleOpen.designTokens.trigger")}</AccordionTrigger>
            <AccordionContent className="p-4">
              {p("multipleOpen.designTokens.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>{p("multipleOpen.accessibility.trigger")}</AccordionTrigger>
            <AccordionContent className="p-4">
              {p("multipleOpen.accessibility.content")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
