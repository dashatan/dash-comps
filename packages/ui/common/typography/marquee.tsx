import { cn } from "@/lib/utils";
import ReactMarquee, { MarqueeProps } from "react-fast-marquee";
import { useResizeDetector } from "react-resize-detector";

export default function Marquee(props: MarqueeProps) {
  const { ref: containerRef, width: cw } = useResizeDetector();
  const { ref: textRef, width: tw } = useResizeDetector();
  const slide = cw && tw && tw > cw;

  return (
    <div
      {...props}
      ref={containerRef}
      className={cn(
        "flex h-10 w-full items-center overflow-hidden px-2 whitespace-nowrap",
        "relative cursor-default rounded-md transition-all",
        props.className,
      )}
    >
      {slide ? (
        <ReactMarquee direction="right" className="dir-ltr" delay={2}>
          <span className="flex items-center pe-10">{props.children}</span>
        </ReactMarquee>
      ) : (
        props.children
      )}
      <div ref={textRef} className="absolute opacity-0">
        {props.children}
      </div>
    </div>
  );
}
