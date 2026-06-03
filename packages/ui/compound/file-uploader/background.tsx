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
      <div className="bg-muted/15 z-2 flex size-36 items-center justify-center rounded-full border">
        <div className="bg-muted/15 flex size-28 items-center justify-center rounded-full border">
          <div className="bg-muted/15 flex size-20 items-center justify-center rounded-full border">
            <UploadCloudIcon className="text-muted-foreground" size={40} />
          </div>
        </div>
      </div>
    </div>
  );
}
export function UploadingBackgroundImage(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "bg-primary/10 z-1 flex size-44 items-center justify-center rounded-full",
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        props.className,
      )}
    >
      <div className="bg-primary/10 z-2 flex size-36 animate-pulse items-center justify-center rounded-full">
        <div className="bg-primary/10 z-2 flex size-28 items-center justify-center rounded-full">
          <div className="bg-primary/10 z-2 flex size-20 items-center justify-center rounded-full">
            <UploadCloudIcon className="text-primary" size={40} />
          </div>
        </div>
      </div>
      <div className="bg-primary/10 absolute z-1 size-36 animate-ping rounded-full" />
    </div>
  );
}
export function UploadErrorBackgroundImage(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "bg-error/10 z-1 flex size-44 items-center justify-center rounded-full",
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        props.className,
      )}
    >
      <div className="bg-error/10 z-2 flex size-36 items-center justify-center rounded-full">
        <div className="bg-error/10 z-2 flex size-28 items-center justify-center rounded-full">
          <div className="bg-error/10 z-2 flex size-20 items-center justify-center rounded-full">
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
        "bg-success/10 z-1 flex size-44 items-center justify-center rounded-full",
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        props.className,
      )}
    >
      <div className="bg-success/10 z-2 flex size-36 items-center justify-center rounded-full">
        <div className="bg-success/10 z-2 flex size-28 items-center justify-center rounded-full">
          <div className="bg-success/10 z-2 flex size-20 items-center justify-center rounded-full">
            <UploadCloudIcon className="text-success" size={40} />
          </div>
        </div>
      </div>
    </div>
  );
}
