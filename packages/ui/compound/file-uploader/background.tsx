import { cn } from "@/lib";
import { UploadCloudIcon } from "lucide-react";

export default function UploadBackgroundImage(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      className={cn(
        "z-1 flex size-44 items-center justify-center rounded-full border",
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "bg-muted/15",
        props.className,
      )}
    >
      <div className="z-2 flex size-36 items-center justify-center rounded-full border bg-muted/15">
        <div className="flex size-28 items-center justify-center rounded-full border bg-muted/15">
          <div className="flex size-20 items-center justify-center rounded-full border bg-muted/15">
            <UploadCloudIcon className="text-muted-foreground" size={40} />
          </div>
        </div>
      </div>
    </div>
  );
}
export function UploadingBackgroundImage(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      className={cn(
        "z-1 flex size-44 items-center justify-center rounded-full bg-primary/10",
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        props.className,
      )}
    >
      <div className="z-2 flex size-36 animate-pulse items-center justify-center rounded-full bg-primary/10">
        <div className="z-2 flex size-28 items-center justify-center rounded-full bg-primary/10">
          <div className="z-2 flex size-20 items-center justify-center rounded-full bg-primary/10">
            <UploadCloudIcon className="text-primary" size={40} />
          </div>
        </div>
      </div>
      <div className="absolute z-1 size-36 animate-ping rounded-full bg-primary/10" />
    </div>
  );
}
export function UploadErrorBackgroundImage(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      className={cn(
        "z-1 flex size-44 items-center justify-center rounded-full bg-error/10",
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        props.className,
      )}
    >
      <div className="z-2 flex size-36 items-center justify-center rounded-full bg-error/10">
        <div className="z-2 flex size-28 items-center justify-center rounded-full bg-error/10">
          <div className="z-2 flex size-20 items-center justify-center rounded-full bg-error/10">
            <UploadCloudIcon className="text-error" size={40} />
          </div>
        </div>
      </div>
    </div>
  );
}
export function UploadSuccessBackgroundImage(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      className={cn(
        "z-1 flex size-44 items-center justify-center rounded-full bg-success/10",
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        props.className,
      )}
    >
      <div className="z-2 flex size-36 items-center justify-center rounded-full bg-success/10">
        <div className="z-2 flex size-28 items-center justify-center rounded-full bg-success/10">
          <div className="z-2 flex size-20 items-center justify-center rounded-full bg-success/10">
            <UploadCloudIcon className="text-success" size={40} />
          </div>
        </div>
      </div>
    </div>
  );
}
