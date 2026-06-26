import { useState } from "react";
import { Button } from "@/components/common/buttons";
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
  const [controlledValue, setControlledValue] = useState("");

  return (
    <CatalogPageShell slug="accordion">
      <ShowcaseSection
        title={p("singleCollapsible.title")}
        description={p("singleCollapsible.description")}
        layout="stack"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              {p("singleCollapsible.whatIsLibrary.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("singleCollapsible.whatIsLibrary.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              {p("singleCollapsible.darkMode.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("singleCollapsible.darkMode.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              {p("singleCollapsible.staticSite.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("singleCollapsible.staticSite.content")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("multipleOpen.title")}
        description={p("multipleOpen.description")}
        layout="stack"
      >
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="a">
            <AccordionTrigger>
              {p("multipleOpen.designTokens.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("multipleOpen.designTokens.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>
              {p("multipleOpen.accessibility.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("multipleOpen.accessibility.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger>
              {p("multipleOpen.composition.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("multipleOpen.composition.content")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("singleExclusive.title")}
        description={p("singleExclusive.description")}
        layout="stack"
      >
        <Accordion type="single" className="w-full">
          <AccordionItem value="exclusive-1">
            <AccordionTrigger>
              {p("singleExclusive.account.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("singleExclusive.account.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="exclusive-2">
            <AccordionTrigger>
              {p("singleExclusive.billing.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("singleExclusive.billing.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="exclusive-3">
            <AccordionTrigger>
              {p("singleExclusive.notifications.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("singleExclusive.notifications.content")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("defaultOpen.title")}
        description={p("defaultOpen.description")}
        layout="stack"
      >
        <Accordion
          type="single"
          collapsible
          defaultValue="returns"
          className="w-full"
        >
          <AccordionItem value="shipping">
            <AccordionTrigger>
              {p("defaultOpen.shipping.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("defaultOpen.shipping.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger>
              {p("defaultOpen.returns.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("defaultOpen.returns.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="support">
            <AccordionTrigger>
              {p("defaultOpen.support.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("defaultOpen.support.content")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("defaultOpenMultiple.title")}
        description={p("defaultOpenMultiple.description")}
        layout="stack"
      >
        <Accordion
          type="multiple"
          defaultValue={["tokens", "a11y"]}
          className="w-full"
        >
          <AccordionItem value="tokens">
            <AccordionTrigger>
              {p("defaultOpenMultiple.tokens.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("defaultOpenMultiple.tokens.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="a11y">
            <AccordionTrigger>
              {p("defaultOpenMultiple.a11y.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("defaultOpenMultiple.a11y.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="motion">
            <AccordionTrigger>
              {p("defaultOpenMultiple.motion.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("defaultOpenMultiple.motion.content")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("controlled.title")}
        description={p("controlled.description")}
        layout="stack"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outlined"
            onClick={() => setControlledValue("controlled-1")}
          >
            {p("controlled.openFirst")}
          </Button>
          <Button
            size="sm"
            variant="outlined"
            onClick={() => setControlledValue("controlled-2")}
          >
            {p("controlled.openSecond")}
          </Button>
          <Button
            size="sm"
            variant="text"
            onClick={() => setControlledValue("")}
          >
            {p("controlled.collapseAll")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {p("controlled.current", {
              value: controlledValue || p("controlled.none"),
            })}
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          value={controlledValue}
          onValueChange={setControlledValue}
          className="w-full"
        >
          <AccordionItem value="controlled-1">
            <AccordionTrigger>
              {p("controlled.profile.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("controlled.profile.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="controlled-2">
            <AccordionTrigger>
              {p("controlled.security.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("controlled.security.content")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("disabledItems.title")}
        description={p("disabledItems.description")}
        layout="stack"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="enabled-1">
            <AccordionTrigger>
              {p("disabledItems.available.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("disabledItems.available.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="disabled-1" disabled>
            <AccordionTrigger>
              {p("disabledItems.locked.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("disabledItems.locked.content")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="enabled-2">
            <AccordionTrigger>
              {p("disabledItems.another.trigger")}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {p("disabledItems.another.content")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("singleItem.title")}
        description={p("singleItem.description")}
        layout="stack"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="only">
            <AccordionTrigger>{p("singleItem.trigger")}</AccordionTrigger>
            <AccordionContent className="p-4">
              {p("singleItem.content")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("richContent.title")}
        description={p("richContent.description")}
        layout="stack"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="rich">
            <AccordionTrigger>{p("richContent.trigger")}</AccordionTrigger>
            <AccordionContent className="space-y-3 p-4">
              <p>{p("richContent.intro")}</p>
              <ul className="list-disc space-y-1 ps-5 text-muted-foreground">
                <li>{p("richContent.listItem1")}</li>
                <li>{p("richContent.listItem2")}</li>
                <li>{p("richContent.listItem3")}</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                {p("richContent.outro")}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
