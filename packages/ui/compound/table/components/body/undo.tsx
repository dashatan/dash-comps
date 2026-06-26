import Button from "@/components/common/buttons";
import { useLanguage } from "@/lib";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  message?: string;
  timer?: number;
  onUndo?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export default function Undo(props: Props) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex items-center justify-between gap-2 overflow-hidden rounded-md bg-gray-900 p-4">
      <span className="font-semibold text-gray-100">{props.message}</span>
      <div className="flex items-center gap-2">
        {props.onUndo && (
          <Button
            variant="text"
            label={t("common.undo")}
            onClick={props.onUndo}
          />
        )}
        {props.onDelete && (
          <Button
            variant="text"
            label={t("common.delete")}
            severity="danger"
            onClick={props.onDelete}
          />
        )}
        {props.onClose && (
          <X
            className="w-10 cursor-pointer text-gray-100"
            onClick={props.onClose}
          />
        )}
        {props.timer && (
          <div
            className="bg-primary-400 absolute bottom-0 left-0 h-1 transition-all ease-linear"
            style={{
              width: mounted ? "100%" : 0,
              transitionDuration: `${props.timer}ms`,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}
