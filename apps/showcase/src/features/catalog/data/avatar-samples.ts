export const showcaseAvatarImages = {
  sara: "/avatars/sara.jpg",
  ali: "/avatars/ali.jpg",
  reza: "/avatars/reza.jpg",
  mina: "/avatars/mina.jpg",
  team: "/avatars/team.jpg",
} as const;

export const showcaseAvatarPresetSizes = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
] as const;

export const showcaseAvatarSeverities = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "muted",
] as const;

export const showcaseAvatarStatuses = [
  "online",
  "offline",
  "busy",
  "away",
] as const;

export const showcaseAvatarShapes = ["circle", "rounded", "square"] as const;

export const showcaseAvatarMembers = [
  {
    src: showcaseAvatarImages.sara,
    user: { first_name: "Sara", last_name: "Ahmadi", username: "sara" },
  },
  {
    src: showcaseAvatarImages.ali,
    user: { first_name: "Ali", last_name: "Hosseini", username: "ali" },
  },
  {
    src: showcaseAvatarImages.mina,
    user: { first_name: "Mina", last_name: "Rahmani", username: "mina" },
  },
  {
    src: showcaseAvatarImages.reza,
    user: { first_name: "Reza", last_name: "Karimi", username: "reza" },
  },
  {
    src: showcaseAvatarImages.team,
    user: { first_name: "Team", username: "team" },
  },
  {
    user: { first_name: "Neda", last_name: "Azimi", username: "neda" },
  },
  {
    user: { first_name: "Omid", last_name: "Shirazi", username: "omid" },
  },
] as const;
