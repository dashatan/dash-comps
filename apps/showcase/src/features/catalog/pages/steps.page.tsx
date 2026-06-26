import { useState, type ReactNode } from "react";
import { Button } from "@/components/common/buttons";
import Steps from "@/components/common/steps.tsx";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

function ShowcaseRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function StepBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary">
      {children}
    </span>
  );
}

export function StepsPage() {
  const p = useShowcasePage("steps");
  const [activeStep, setActiveStep] = useState(0);

  const fullWizardSteps = [
    {
      name: p("firstStep.steps.details.name"),
      title: p("firstStep.steps.details.title"),
      subtitle: p("firstStep.steps.details.subtitle"),
    },
    {
      name: p("firstStep.steps.review.name"),
      title: p("firstStep.steps.review.title"),
      subtitle: p("firstStep.steps.review.subtitle"),
    },
    {
      name: p("firstStep.steps.done.name"),
      title: p("firstStep.steps.done.title"),
      subtitle: p("firstStep.steps.done.subtitle"),
    },
  ];

  const controlledSteps = [
    {
      name: p("controlled.steps.details.name"),
      title: p("controlled.steps.details.title"),
      subtitle: p("controlled.steps.details.subtitle"),
    },
    {
      name: p("controlled.steps.review.name"),
      title: p("controlled.steps.review.title"),
      subtitle: p("controlled.steps.review.subtitle"),
    },
    {
      name: p("controlled.steps.done.name"),
      title: p("controlled.steps.done.title"),
      subtitle: p("controlled.steps.done.subtitle"),
    },
  ];

  const activeStateSteps = [
    { name: p("activeStates.steps.details") },
    { name: p("activeStates.steps.review") },
    { name: p("activeStates.steps.done") },
  ];

  return (
    <CatalogPageShell slug="steps">
      <ShowcaseSection
        title={p("firstStep.title")}
        description={p("firstStep.description")}
        layout="stack"
      >
        <Steps active={0} steps={fullWizardSteps} />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("midProgress.title")}
        description={p("midProgress.description")}
        layout="stack"
      >
        <Steps
          active={1}
          steps={[
            { name: p("midProgress.steps.start") },
            { name: p("midProgress.steps.review") },
            { name: p("midProgress.steps.done") },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("lastStep.title")}
        description={p("lastStep.description")}
        layout="stack"
      >
        <Steps active={2} steps={fullWizardSteps} />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("withoutSubtitles.title")}
        description={p("withoutSubtitles.description")}
        layout="stack"
      >
        <Steps
          active={0}
          steps={[
            {
              name: p("withoutSubtitles.steps.details.name"),
              title: p("withoutSubtitles.steps.details.title"),
            },
            {
              name: p("withoutSubtitles.steps.review.name"),
              title: p("withoutSubtitles.steps.review.title"),
            },
            {
              name: p("withoutSubtitles.steps.done.name"),
              title: p("withoutSubtitles.steps.done.title"),
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("withoutNames.title")}
        description={p("withoutNames.description")}
        layout="stack"
      >
        <Steps
          active={1}
          steps={[
            {
              title: p("withoutNames.steps.details.title"),
              subtitle: p("withoutNames.steps.details.subtitle"),
            },
            {
              title: p("withoutNames.steps.review.title"),
              subtitle: p("withoutNames.steps.review.subtitle"),
            },
            {
              title: p("withoutNames.steps.done.title"),
              subtitle: p("withoutNames.steps.done.subtitle"),
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("minimalHeader.title")}
        description={p("minimalHeader.description")}
        layout="stack"
      >
        <Steps
          active={0}
          steps={[
            { name: p("minimalHeader.steps.details") },
            { name: p("minimalHeader.steps.review") },
            { name: p("minimalHeader.steps.done") },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("twoSteps.title")}
        description={p("twoSteps.description")}
        layout="stack"
      >
        <Steps
          active={0}
          steps={[
            {
              name: p("twoSteps.steps.setup.name"),
              title: p("twoSteps.steps.setup.title"),
              subtitle: p("twoSteps.steps.setup.subtitle"),
            },
            {
              name: p("twoSteps.steps.confirm.name"),
              title: p("twoSteps.steps.confirm.title"),
              subtitle: p("twoSteps.steps.confirm.subtitle"),
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("fiveSteps.title")}
        description={p("fiveSteps.description")}
        layout="stack"
      >
        <Steps
          active={2}
          steps={[
            { name: p("fiveSteps.steps.account") },
            { name: p("fiveSteps.steps.profile") },
            { name: p("fiveSteps.steps.billing") },
            { name: p("fiveSteps.steps.review") },
            { name: p("fiveSteps.steps.done") },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("customNames.title")}
        description={p("customNames.description")}
        layout="stack"
      >
        <Steps
          active={1}
          steps={[
            {
              name: (
                <StepBadge>{p("customNames.steps.badges.draft")}</StepBadge>
              ),
              title: p("customNames.steps.draft.title"),
              subtitle: p("customNames.steps.draft.subtitle"),
            },
            {
              name: (
                <StepBadge>{p("customNames.steps.badges.review")}</StepBadge>
              ),
              title: p("customNames.steps.review.title"),
              subtitle: p("customNames.steps.review.subtitle"),
            },
            {
              name: (
                <StepBadge>{p("customNames.steps.badges.published")}</StepBadge>
              ),
              title: p("customNames.steps.published.title"),
              subtitle: p("customNames.steps.published.subtitle"),
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("controlled.title")}
        description={p("controlled.description")}
        layout="stack"
      >
        <Steps active={activeStep} steps={controlledSteps} />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outlined"
            size="sm"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
          >
            {p("controlled.previous")}
          </Button>
          <Button
            size="sm"
            disabled={activeStep === controlledSteps.length - 1}
            onClick={() =>
              setActiveStep((step) =>
                Math.min(controlledSteps.length - 1, step + 1),
              )
            }
          >
            {p("controlled.next")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {p("controlled.info", {
              step: activeStep + 1,
              total: controlledSteps.length,
            })}
          </p>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("activeStates.title")}
        description={p("activeStates.description")}
        layout="stack"
      >
        <ShowcaseRow label={p("activeStates.labels.step1")}>
          <Steps active={0} steps={activeStateSteps} />
        </ShowcaseRow>
        <ShowcaseRow label={p("activeStates.labels.step2")}>
          <Steps active={1} steps={activeStateSteps} />
        </ShowcaseRow>
        <ShowcaseRow label={p("activeStates.labels.step3")}>
          <Steps active={2} steps={activeStateSteps} />
        </ShowcaseRow>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
