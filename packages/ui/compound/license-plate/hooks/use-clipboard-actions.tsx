import { useCallback } from "react";
import { CarPlateInputValue, PlateValue } from "../types";
import { normalizeCarToPlateValue, normalizePlateValueToCar } from "../utils";
import { X } from "lucide-react";
import { toast } from "@/components/common/sonner";
import { useLanguage } from "@/lib";

// Clipboard state tracked via localStorage only

/**
 * Local clipboard storage utilities
 */
const LOCAL_CLIPBOARD_KEY = "rahdari_local_clipboard";

const saveToLocalClipboard = (text: string): void => {
  try {
    localStorage.setItem(LOCAL_CLIPBOARD_KEY, text);
    console.log("Data saved to local clipboard storage");
  } catch (error) {
    console.error("Failed to save to local clipboard:", error);
  }
};

const getFromLocalClipboard = (): string | null => {
  try {
    const data = localStorage.getItem(LOCAL_CLIPBOARD_KEY);
    return data;
  } catch (error) {
    console.error("Failed to read from local clipboard:", error);
    return null;
  }
};

const clearLocalClipboard = (): void => {
  try {
    localStorage.removeItem(LOCAL_CLIPBOARD_KEY);
    console.log("Local clipboard cleared");
  } catch (error) {
    console.error("Failed to clear local clipboard:", error);
  }
};

/**
 * Check if clipboard read is available and request permission if needed
 */
export const checkClipboardPermission = async (): Promise<boolean> => {
  if (!navigator.clipboard || !window.isSecureContext) {
    return false;
  }

  try {
    const permission = await navigator.permissions.query({
      name: "clipboard-read" as PermissionName,
    });
    return permission.state === "granted" || permission.state === "prompt";
  } catch {
    return false;
  }
};

/**
 * Professional clipboard utilities with fallbacks
 */
export const useClipboardActions = () => {
  const writeToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        // Always save to local storage as backup
        saveToLocalClipboard(text);

        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          console.log("Data copied to system clipboard and local storage");
          return true;
        } else {
          // Fallback for older browsers or non-secure contexts
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand("copy");
          document.body.removeChild(textArea);

          if (successful) {
            console.log(
              "Data copied to system clipboard (fallback) and local storage",
            );
          } else {
            console.log(
              "Data saved to local storage only (system clipboard failed)",
            );
          }

          return successful;
        }
      } catch (err) {
        console.error("Clipboard write failed:", err);
        console.log("Data saved to local storage only");
        return false;
      }
    },
    [],
  );

  const readFromClipboard = useCallback(async (): Promise<string | null> => {
    try {
      const permission = await checkClipboardPermission();
      console.log("Reading from clipboard", permission);

      if (navigator.clipboard && window.isSecureContext && permission) {
        // Check if we have permission to read clipboard
        const permission = await navigator.permissions.query({
          name: "clipboard-read" as PermissionName,
        });

        if (permission.state === "denied") {
          console.warn(
            "Clipboard read permission denied by user, trying local storage...",
          );
          return getFromLocalClipboard();
        }

        if (permission.state === "prompt") {
          // Permission will be requested when we call readText()
          console.log("Requesting clipboard read permission...");
        }

        try {
          const clipboardText = await navigator.clipboard.readText();
          console.log("Successfully read from system clipboard");
          return clipboardText;
        } catch (clipboardError) {
          console.warn(
            "System clipboard read failed, trying local storage...",
            clipboardError,
          );
          return getFromLocalClipboard();
        }
      } else {
        // Fallback - we can't read clipboard in non-secure contexts
        console.warn(
          "Clipboard read not available in this context. Trying local storage...",
        );
        return getFromLocalClipboard();
      }
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          console.warn(
            "Clipboard read permission denied by user, trying local storage...",
          );
          return getFromLocalClipboard();
        } else if (err.name === "NotFoundError") {
          console.warn("No clipboard data available, trying local storage...");
          return getFromLocalClipboard();
        } else {
          console.error(
            "Clipboard read failed:",
            err.message,
            "trying local storage...",
          );
          return getFromLocalClipboard();
        }
      } else {
        console.error("Clipboard read failed:", err, "trying local storage...");
        return getFromLocalClipboard();
      }
    }
  }, []);

  const clearClipboard = useCallback((): void => {
    clearLocalClipboard();
  }, []);

  return {
    writeToClipboard,
    readFromClipboard,
    clearClipboard,
  };
};

/**
 * Hook for plate-specific clipboard actions
 */
export const usePlateClipboardActions = (
  localValues?: CarPlateInputValue,
  setLocalValues?: (values?: CarPlateInputValue) => void,
  setColorCode?: (code: string | undefined) => void,
  onChange?: (val?: PlateValue) => void,
  disabled?: boolean,
  readonly?: boolean,
) => {
  const { writeToClipboard, readFromClipboard, clearClipboard } =
    useClipboardActions();
  const { t } = useLanguage();

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const plateValue = normalizeCarToPlateValue(localValues);
      if (disabled || readonly) return;
      const emptyPlateValue = Object.values(plateValue).every(
        (val) => val === "" || val === undefined,
      );
      if (emptyPlateValue) return;
      const plateString = JSON.stringify(plateValue);
      if (!plateString.trim()) return;
      const success = await writeToClipboard(plateString);
      if (success) {
        toast.info(t("plate.plateCopied"));
      }
      if (!success) {
        console.warn("Failed to copy to clipboard");
      }
    },
    [
      disabled,
      readonly,
      localValues,
      writeToClipboard,
      normalizeCarToPlateValue,
    ],
  );

  const handlePaste = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled || readonly) return;

      const text = await readFromClipboard();
      if (!text) {
        console.log("No clipboard data available or permission denied");
        toast.error(t("plate.platePasteFailed"));
        return;
      }

      try {
        const val = JSON.parse(text) as PlateValue;
        setLocalValues?.(normalizePlateValueToCar(val));
        onChange?.(val);
      } catch (parseError) {
        console.log("Failed to parse clipboard data:", parseError);
        toast.error(t("plate.platePasteFailed"));
      }
    },
    [
      disabled,
      readonly,
      readFromClipboard,
      setLocalValues,
      setColorCode,
      onChange,
    ],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled || readonly) return;

      setLocalValues?.(undefined);
      setColorCode?.(undefined);
      onChange?.(undefined);

      // Also clear the local clipboard storage
      clearClipboard();
    },
    [
      disabled,
      readonly,
      setLocalValues,
      setColorCode,
      onChange,
      clearClipboard,
    ],
  );

  const buttons = [
    {
      icon: <X size={16} className="text-foreground" />,
      onClick: handleClear,
      tooltip: "Clear",
    },
    // { icon: <Copy size={12} className='text-foreground' />, onClick: handleCopy, tooltip: 'Copy' },
    // { icon: <Clipboard size={12} className='text-foreground' />, onClick: handlePaste, tooltip: 'Paste' },
  ];

  return {
    handleCopy,
    handlePaste,
    handleClear,
    buttons,
  };
};
