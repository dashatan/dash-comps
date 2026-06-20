"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/common/buttons";
import { highlightCode } from "@/features/catalog/lib/highlight-code";
import { cn } from "@/lib";

type CodePreviewProps = {
  code: string;
  filename?: string;
  language?: string;
  copyLabel?: string;
  copiedLabel?: string;
  maxHeight?: string;
  className?: string;
};

export function CodePreview({
  code,
  filename,
  language = "tsx",
  copyLabel = "Copy",
  copiedLabel = "Copied",
  maxHeight = "36rem",
  className,
}: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const lines = useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);
  const displayName = filename ?? `example.${language}`;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const html = await highlightCode(code, language);
        if (!cancelled) {
          setHighlightedHtml(html);
        }
      } catch {
        if (!cancelled) {
          setHighlightedHtml(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div
      dir="ltr"
      className={cn(
        "code-preview overflow-hidden rounded-lg border text-xs shadow-sm",
        className,
      )}
    >
      <div className="code-preview-chrome flex h-8 items-center justify-between gap-2 px-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            {displayName}
          </span>
          <span className="shrink-0 rounded border border-border px-1.5 py-px font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
            {language}
          </span>
        </div>
        <Button
          type="button"
          variant="text"
          severity="muted"
          size="sm"
          className="h-6 shrink-0 px-1.5 text-[11px]"
          aria-label={copied ? copiedLabel : copyLabel}
          leftIcon={
            copied ? (
              <Check className="size-3 text-success" />
            ) : (
              <Copy className="size-3" />
            )
          }
          onClick={handleCopy}
        >
          <span className="sr-only">{copied ? copiedLabel : copyLabel}</span>
        </Button>
      </div>

      <div className="code-preview-editor flex" style={{ maxHeight }}>
        <div
          aria-hidden
          className="code-preview-gutter shrink-0 py-2 ps-2.5 pe-3 font-mono tabular-nums select-none"
        >
          {lines.map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>
        <div className="code-preview-code min-w-0 flex-1 py-2 pe-3">
          {highlightedHtml ? (
            <div
              className="[&_.shiki]:m-0 [&_.shiki]:bg-transparent [&_.shiki]:p-0"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <pre className="font-mono">
              <code>{code}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
