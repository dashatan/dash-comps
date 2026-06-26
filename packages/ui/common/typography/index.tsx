"use client";

import { cn } from "@/lib";

const inCommonClasses = "m-0 p-0 text-foreground cursor-default";

export function P(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >,
) {
  return (
    <p
      {...props}
      className={cn(inCommonClasses, "text-sm font-normal", props.className)}
    />
  );
}

export function H1(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >,
) {
  return (
    <h1
      {...props}
      className={cn(
        inCommonClasses,
        "text-3xl font-extrabold",
        props.className,
      )}
    />
  );
}

export function H2(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >,
) {
  return (
    <h2
      {...props}
      className={cn(inCommonClasses, "text-2xl font-bold", props.className)}
    />
  );
}

export function H3(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >,
) {
  return (
    <h3
      {...props}
      className={cn(inCommonClasses, "text-xl font-semibold", props.className)}
    />
  );
}

export function H4(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >,
) {
  return (
    <h4
      {...props}
      className={cn(inCommonClasses, "text-lg font-medium", props.className)}
    />
  );
}
