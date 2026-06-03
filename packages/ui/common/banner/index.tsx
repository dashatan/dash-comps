import { cn } from "@/lib";
import { ComponentPropsWithoutRef, CSSProperties } from "react";

type BannerImage = string | { src: string };

export type BannerProps = ComponentPropsWithoutRef<"div"> & {
  image?: BannerImage;
  imageSize?: CSSProperties["backgroundSize"];
  imagePositionY?: CSSProperties["backgroundPositionY"];
};

function resolveImageSrc(image?: BannerImage) {
  if (!image) return undefined;
  return typeof image === "string" ? image : image.src;
}

export default function Banner({
  className,
  children,
  image,
  imageSize = "30%",
  imagePositionY = "50%",
  ...props
}: BannerProps) {
  const imageSrc = resolveImageSrc(image);

  return (
    <div
      className={cn(
        "text-banner-foreground relative overflow-hidden rounded-md",
        "[&>*:not([data-banner-decor])]:relative [&>*:not([data-banner-decor])]:z-1",
        className,
      )}
      {...props}
    >
      {children}
      {imageSrc && (
        <div
          data-banner-decor
          aria-hidden
          className="bg-banner pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: imageSize,
            backgroundPositionY: imagePositionY,
            backgroundBlendMode: "multiply",
            backgroundRepeat: "no-repeat",
            opacity: "var(--banner-bg-opacity)",
          }}
        />
      )}
    </div>
  );
}
