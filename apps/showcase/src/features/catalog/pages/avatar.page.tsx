import { useState, type ReactNode } from "react";
import { User } from "lucide-react";
import {
  Avatar,
  AvatarGroup,
  UserAvatar,
  type AvatarSeverity,
  type AvatarShape,
} from "@/components/common/avatar";
import {
  showcaseAvatarImages,
  showcaseAvatarMembers,
  showcaseAvatarPresetSizes,
  showcaseAvatarSeverities,
  showcaseAvatarShapes,
  showcaseAvatarStatuses,
} from "@/features/catalog/data/avatar-samples";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

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
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function LabeledAvatar({
  label,
  detail,
  children,
}: {
  label: string;
  detail?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5">
      {children}
      <div className="text-center">
        <p className="text-sm font-medium">{label}</p>
        {detail ? (
          <p className="text-xs text-muted-foreground">{detail}</p>
        ) : null}
      </div>
    </div>
  );
}

export function AvatarPage() {
  const p = useShowcasePage("avatar");
  const [clicks, setClicks] = useState(0);

  return (
    <CatalogPageShell slug="avatar">
      <ShowcaseSection
        title={p("withPhoto.title")}
        description={p("withPhoto.description")}
      >
        <LabeledAvatar label={p("withPhoto.sara")} detail="lg">
          <Avatar
            user={{ first_name: "Sara", last_name: "Ahmadi", username: "sara" }}
            src={showcaseAvatarImages.sara}
            size="lg"
            alt={p("withPhoto.sara")}
          />
        </LabeledAvatar>
        <LabeledAvatar label={p("withPhoto.ali")} detail="lg">
          <Avatar
            user={{ first_name: "Ali", last_name: "Hosseini", username: "ali" }}
            src={showcaseAvatarImages.ali}
            size="lg"
            alt={p("withPhoto.ali")}
          />
        </LabeledAvatar>
        <LabeledAvatar label={p("withPhoto.mina")} detail="lg">
          <Avatar
            user={{
              first_name: "Mina",
              last_name: "Rahmani",
              username: "mina",
            }}
            src={showcaseAvatarImages.mina}
            size="lg"
            alt={p("withPhoto.mina")}
          />
        </LabeledAvatar>
        <LabeledAvatar label={p("withPhoto.reza")} detail="lg">
          <Avatar
            user={{ first_name: "Reza", last_name: "Karimi", username: "reza" }}
            src={showcaseAvatarImages.reza}
            size="lg"
            alt={p("withPhoto.reza")}
          />
        </LabeledAvatar>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("presetSizes.title")}
        description={p("presetSizes.description")}
        layout="stack"
      >
        <ShowcaseRow label={p("presetSizes.photoRow")}>
          {showcaseAvatarPresetSizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-1">
              <Avatar
                user={{ first_name: "Sara", username: "sara" }}
                src={showcaseAvatarImages.sara}
                size={size}
              />
              <span className="text-xs text-muted-foreground">{size}</span>
            </div>
          ))}
        </ShowcaseRow>
        <ShowcaseRow label={p("presetSizes.initialsRow")}>
          {showcaseAvatarPresetSizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-1">
              <Avatar
                user={{ first_name: "Reza", last_name: "Karimi" }}
                size={size}
              />
              <span className="text-xs text-muted-foreground">{size}</span>
            </div>
          ))}
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("customSizes.title")}
        description={p("customSizes.description")}
      >
        <Avatar
          user={{ first_name: "Sara", username: "sara" }}
          src={showcaseAvatarImages.sara}
          size="5rem"
        />
        <Avatar
          user={{ first_name: "Ali", username: "ali" }}
          src={showcaseAvatarImages.ali}
          size={72}
        />
        <Avatar
          user={{ first_name: "Reza", last_name: "Karimi" }}
          size="3.5rem"
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("shapes.title")}
        description={p("shapes.description")}
      >
        {showcaseAvatarShapes.map((shape: AvatarShape) => (
          <LabeledAvatar key={shape} label={p(`shapes.${shape}`)} detail="lg">
            <Avatar
              user={{ first_name: "Sara", username: "sara" }}
              src={showcaseAvatarImages.sara}
              size="lg"
              shape={shape}
            />
          </LabeledAvatar>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("severities.title")}
        description={p("severities.description")}
      >
        {showcaseAvatarSeverities.map((severity: AvatarSeverity) => (
          <LabeledAvatar key={severity} label={severity}>
            <Avatar
              user={{ first_name: severity, username: severity }}
              size="lg"
              severity={severity}
            />
          </LabeledAvatar>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("initials.title")}
        description={p("initials.description")}
      >
        <LabeledAvatar label={p("initials.single")} detail="S">
          <Avatar
            user={{ first_name: "Sara", last_name: "Ahmadi" }}
            size="lg"
            initials="single"
          />
        </LabeledAvatar>
        <LabeledAvatar label={p("initials.dual")} detail="SA">
          <Avatar
            user={{ first_name: "Sara", last_name: "Ahmadi" }}
            size="lg"
            initials="dual"
          />
        </LabeledAvatar>
        <LabeledAvatar label={p("initials.username")} detail="G">
          <Avatar user={{ username: "guest" }} size="lg" initials="single" />
        </LabeledAvatar>
        <LabeledAvatar label={p("initials.default")} detail="U">
          <Avatar size="lg" />
        </LabeledAvatar>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("autoSeverity.title")}
        description={p("autoSeverity.description")}
      >
        {showcaseAvatarMembers.slice(0, 5).map((member) => (
          <Avatar
            key={member.user.username}
            user={member.user}
            src={"src" in member ? member.src : undefined}
            size="lg"
            autoSeverity
            initials="dual"
          />
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("status.title")}
        description={p("status.description")}
      >
        {showcaseAvatarStatuses.map((status) => (
          <LabeledAvatar key={status} label={p(`status.${status}`)}>
            <Avatar
              user={{ first_name: "Sara", username: "sara" }}
              src={showcaseAvatarImages.sara}
              size="lg"
              status={status}
              border="background"
            />
          </LabeledAvatar>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("borders.title")}
        description={p("borders.description")}
      >
        <ShowcaseRow label={p("borders.none")}>
          <Avatar
            user={{ first_name: "Sara", username: "sara" }}
            src={showcaseAvatarImages.sara}
            size="lg"
            border="none"
          />
          <Avatar
            user={{ first_name: "Reza", last_name: "Karimi" }}
            size="lg"
            border="none"
          />
        </ShowcaseRow>
        <ShowcaseRow label={p("borders.default")}>
          <Avatar
            user={{ first_name: "Ali", username: "ali" }}
            src={showcaseAvatarImages.ali}
            size="lg"
            border="default"
          />
          <Avatar
            user={{ first_name: "Mina", username: "mina" }}
            size="lg"
            border="default"
            severity="secondary"
          />
        </ShowcaseRow>
        <ShowcaseRow label={p("borders.ring")}>
          <Avatar
            user={{ first_name: "Mina", username: "mina" }}
            src={showcaseAvatarImages.mina}
            size="lg"
            border="ring"
          />
          <Avatar
            user={{ first_name: "Ali", username: "ali" }}
            size="lg"
            border="ring"
            severity="primary"
          />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("loading.title")}
        description={p("loading.description")}
      >
        <Avatar
          user={{ first_name: "Sara", username: "sara" }}
          src={showcaseAvatarImages.sara}
          size="2xl"
          loading
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("imageError.title")}
        description={p("imageError.description")}
      >
        <Avatar
          user={{ first_name: "Reza", last_name: "Karimi", username: "reza" }}
          src="/avatars/missing-photo.jpg"
          size="lg"
          initials="dual"
          severity="warning"
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("iconFallback.title")}
        description={p("iconFallback.description")}
      >
        <Avatar size="lg" icon={User} severity="info" />
        <Avatar size="lg" icon={User} severity="primary" shape="rounded" />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("interactive.title")}
        description={p("interactive.description")}
      >
        <Avatar
          user={{ first_name: "Sara", username: "sara" }}
          src={showcaseAvatarImages.sara}
          size="2xl"
          interactive
          onClick={() => setClicks((count) => count + 1)}
        />
        <p className="text-sm text-muted-foreground">
          {p("interactive.clicks", { count: clicks })}
        </p>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("disabled.title")}
        description={p("disabled.description")}
      >
        <Avatar
          user={{ first_name: "Ali", username: "ali" }}
          src={showcaseAvatarImages.ali}
          size="lg"
          disabled
        />
        <Avatar
          user={{ first_name: "Guest", username: "guest" }}
          size="lg"
          disabled
          severity="muted"
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("avatarGroup.title")}
        description={p("avatarGroup.description")}
        layout="stack"
      >
        <ShowcaseRow label={p("avatarGroup.overlap")}>
          <AvatarGroup max={5} size="md" border="background">
            {showcaseAvatarMembers.map((member) => (
              <Avatar
                key={member.user.username}
                user={member.user}
                src={"src" in member ? member.src : undefined}
                initials="dual"
                autoSeverity
              />
            ))}
          </AvatarGroup>
        </ShowcaseRow>
        <ShowcaseRow label={p("avatarGroup.gap")}>
          <AvatarGroup spacing="gap" size="md">
            {showcaseAvatarMembers.slice(0, 4).map((member) => (
              <Avatar
                key={member.user.username}
                user={member.user}
                src={"src" in member ? member.src : undefined}
                border="default"
              />
            ))}
          </AvatarGroup>
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("userAvatarCompat.title")}
        description={p("userAvatarCompat.description")}
      >
        <UserAvatar
          user={{ first_name: "Sara", username: "sara" }}
          avatar={showcaseAvatarImages.sara}
          size={48}
          showBorder
        />
        <UserAvatar
          user={{ first_name: "Reza", last_name: "Karimi" }}
          size={48}
        />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
