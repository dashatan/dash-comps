import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/common/accordion";

export function AccordionPage() {
  return (
    <CatalogPageShell slug="accordion">
      <ShowcaseSection title="Single collapsible">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is this component library?</AccordionTrigger>
            <AccordionContent className="p-4">
              A collection of production-ready React components built with Tailwind CSS v4, Radix UI,
              and motion-first interactions.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Does it support dark mode?</AccordionTrigger>
            <AccordionContent className="p-4">
              Yes. Toggle between light and dark themes using the header control. Theme preference is
              persisted in local storage.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I use it in a static site?</AccordionTrigger>
            <AccordionContent className="p-4">
              Absolutely. This showcase is built with Vite and exports to static HTML, CSS, and JS.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection title="Multiple open" delay={0.05}>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="a">
            <AccordionTrigger>Design tokens</AccordionTrigger>
            <AccordionContent className="p-4">Semantic colors, spacing, and typography variables.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Accessibility</AccordionTrigger>
            <AccordionContent className="p-4">Built on Radix primitives with keyboard navigation.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
