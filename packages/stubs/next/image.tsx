import type { ImgHTMLAttributes } from "react";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
};

export default function Image({ src, alt, fill, width, height, style, ...rest }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={
        fill
          ? { ...style, position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
          : style
      }
      {...rest}
    />
  );
}
