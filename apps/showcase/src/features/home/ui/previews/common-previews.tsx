import { useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { Alert } from "@/components/common/alert";
import Badge from "@/components/common/badge";
import { Button } from "@/components/common/buttons";
import Card from "@/components/common/card";
import Chip from "@/components/common/chips/chip";
import ChipSelect from "@/components/common/chips/chip-select";
import { Carousel } from "@/components/common/carousel";
import TextInput from "@/components/common/inputs/text";
import Tabs from "@/components/common/tabs/tab";
import type { CatalogSlug } from "@/features/catalog/registry";
import { cn } from "@/lib";

const previewFrameClass =
  "flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-background/60 p-3";

export function CommonComponentPreview({ slug }: { slug: CatalogSlug }) {
  switch (slug) {
    case "buttons":
      return <ButtonsPreview />;
    case "cards":
      return <CardsPreview />;
    case "carousel":
      return <CarouselPreview />;
    case "inputs":
      return <InputsPreview />;
    case "badges":
      return <BadgesPreview />;
    case "tabs":
      return <TabsPreview />;
    case "chips":
      return <ChipsPreview />;
    case "alerts":
      return <AlertsPreview />;
    default:
      return null;
  }
}

function ButtonsPreview() {
  return (
    <div className={cn(previewFrameClass, "flex-wrap gap-2")}>
      <Button severity="primary" size="sm">
        Primary
      </Button>
      <Button variant="outlined" severity="secondary" size="sm">
        Outlined
      </Button>
      <Button variant="text" severity="success" size="sm" leftIcon={<Plus className="size-3.5" />}>
        Add
      </Button>
      <Button
        severity="primary"
        size="sm"
        rounded="full"
        rightIcon={<Download className="size-3.5" />}
      >
        Export
      </Button>
    </div>
  );
}

function BadgesPreview() {
  return (
    <div className={cn(previewFrameClass, "flex-wrap gap-2")}>
      <Badge severity="primary">New</Badge>
      <Badge severity="success" appearance="outline">
        Active
      </Badge>
      <Badge severity="warning">Pending</Badge>
      <Badge severity="info" appearance="outline">
        Beta
      </Badge>
    </div>
  );
}

function ChipsPreview() {
  const [preset, setPreset] = useState("week");

  return (
    <div className={cn(previewFrameClass, "flex-col items-stretch gap-2")}>
      <div className="flex flex-wrap gap-1.5">
        {(["today", "week", "month"] as const).map((value) => (
          <ChipSelect
            key={value}
            text={value}
            val={value}
            active={preset === value}
            onSelect={(val) => setPreset(String(val))}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Chip label="React" />
        <Chip label="Motion" />
        <Chip label="Tailwind" />
      </div>
    </div>
  );
}

function CardsPreview() {
  return (
    <div className={cn(previewFrameClass, "items-stretch p-2")}>
      <Card className="w-full overflow-hidden" size="sm">
        <Card.Media
          src="/banners/workspace.jpg"
          alt=""
          aspect="video"
          className="h-24"
        />
        <Card.Header className="p-3">
          <Card.Title className="text-sm">Workspace</Card.Title>
          <Card.Description className="text-xs">
            Media cards with motion-ready layout.
          </Card.Description>
        </Card.Header>
      </Card>
    </div>
  );
}

function CarouselPreview() {
  const slides = ["/carousel/hero-travel.jpg", "/carousel/hero-food.jpg", "/carousel/hero-team.jpg"];

  return (
    <div className={cn(previewFrameClass, "p-2")}>
      <Carousel
        autoPlay
        loop
        rounded="lg"
        size="sm"
        height={144}
        className="w-full"
      >
        <Carousel.Content>
          {slides.map((src) => (
            <Carousel.Item key={src}>
              <div
                className="flex h-full min-h-36 items-end rounded-[inherit] bg-cover bg-center p-3 text-xs font-medium text-white"
                style={{
                  backgroundImage: `linear-gradient(to top, rgb(0 0 0 / 0.55), transparent), url(${src})`,
                }}
              >
                Carousel slide
              </div>
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Carousel.Indicators />
      </Carousel>
    </div>
  );
}

function InputsPreview() {
  return (
    <div className={cn(previewFrameClass, "items-stretch")}>
      <TextInput
        placeholder="Search components…"
        size="sm"
        prefix={<Search className="size-4" />}
        className="w-full"
      />
    </div>
  );
}

function TabsPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = [
    { name: "Overview" },
    { name: "Analytics" },
    { name: "Settings" },
  ];
  const previews = [
    "Dashboard summary and KPIs",
    "Charts and trend insights",
    "Theme, layout, and preferences",
  ];

  return (
    <div className={cn(previewFrameClass, "flex-col items-stretch gap-3 p-3")}>
      <Tabs
        tabs={tabs}
        activeTab={activeIndex}
        onTabClick={(_event, index) => setActiveIndex(index)}
      />
      <div className="bg-muted/40 text-muted-foreground rounded-lg px-3 py-6 text-center text-xs">
        {previews[activeIndex]}
      </div>
    </div>
  );
}

function AlertsPreview() {
  return (
    <div className={cn(previewFrameClass, "items-stretch p-2")}>
      <Alert severity="info" size="sm" appearance="soft" layout="center">
        <Alert.Title>Heads up</Alert.Title>
        <Alert.Description>
          Compound parts with animated enter and exit.
        </Alert.Description>
      </Alert>
    </div>
  );
}
