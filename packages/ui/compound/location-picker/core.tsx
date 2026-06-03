"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/common/overlay/dialog";
import { LocationPickerTrigger } from "@/components/compound/location-picker/comps/trigger";
import { LocationPickerDialogBody } from "@/components/compound/location-picker/comps/dialog-body";
import { LocationPickerCoreProps } from "@/components/compound/location-picker/types";

/** Isolated location picker — no react-hook-form. */
export function LocationPickerCore({
  committed,
  initialRouting,
  onCommit,
  onCommittedChange,
  dateHint,
  label,
  width,
  className,
  labelContainerProps,
}: LocationPickerCoreProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <LocationPickerTrigger
        committed={committed}
        onCommittedChange={onCommittedChange}
        label={label}
        width={width}
        labelContainerProps={labelContainerProps}
      />
      {open && (
        <DialogContent className="h-11/12 w-11/12">
          <LocationPickerDialogBody
            key={JSON.stringify(committed)}
            initialFilters={committed}
            initialRouting={initialRouting}
            dateHint={dateHint}
            onCommit={onCommit}
            onClose={() => setOpen(false)}
            contentClassName={className?.content}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
