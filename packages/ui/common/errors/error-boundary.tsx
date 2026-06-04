"use client";

import {
  Component,
  useCallback,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, Copy, Home, RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib";
import Button from "@/components/common/buttons";
import { cn } from "@/lib";

function formatErrorText(error: Error): string {
  if (error.stack) return error.stack;
  if (error.message) return error.message;
  return String(error);
}

export type ErrorFallbackProps = {
  error: Error;
  reset: () => void;
};

type ErrorHandlerProps = {
  children: ReactNode;
  fallback?: (props: ErrorFallbackProps) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Reset the boundary when any of these values change (e.g. route pathname). */
  resetKeys?: readonly unknown[];
  className?: string;
};

type ErrorHandlerState = {
  error: Error | null;
};

function CopyableErrorDetails({ error }: { error: Error }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const errorText = formatErrorText(error);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [errorText]);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="outlined"
          severity="secondary"
          size="sm"
          leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
          label={copied ? t("common.copied") : t("common.copy")}
          onClick={() => void handleCopy()}
        />
      </div>
      <pre
        tabIndex={0}
        className={cn(
          "max-h-48 cursor-text overflow-auto rounded-lg border border-border bg-muted/50 p-4 text-start text-xs wrap-break-word whitespace-pre-wrap text-foreground select-text",
        )}
      >
        {errorText}
      </pre>
    </div>
  );
}

function DefaultErrorFallback({ error, reset }: ErrorFallbackProps) {
  const { t } = useLanguage();

  return (
    <div
      role="alert"
      className="flex min-h-[min(24rem,50vh)] w-full flex-col items-center justify-center gap-6 bg-background p-8 text-foreground"
    >
      <div className="flex flex-col items-center gap-3 text-center text-destructive">
        <AlertTriangle className="size-12" strokeWidth={1.5} aria-hidden />
        <h1 className="text-xl font-semibold">
          {t("errors.somethingWentWrong")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("errors.errorDescription")}
        </p>
      </div>

      <CopyableErrorDetails error={error} />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          variant="contained"
          severity="primary"
          leftIcon={<RotateCcw size={18} />}
          label={t("errors.tryAgain")}
          onClick={reset}
        />
        <Button
          type="button"
          variant="outlined"
          severity="secondary"
          leftIcon={<Home size={18} />}
          label={t("errors.goHome")}
          asChild
        >
          <Link to="/" onClick={reset} />
        </Button>
      </div>
    </div>
  );
}

export class ErrorHandler extends Component<
  ErrorHandlerProps,
  ErrorHandlerState
> {
  state: ErrorHandlerState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorHandlerState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorHandler]", error, errorInfo.componentStack);
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorHandlerProps): void {
    const { error } = this.state;
    const { resetKeys } = this.props;
    if (!error || !resetKeys?.length) return;

    const prevKeys = prevProps.resetKeys ?? [];
    const hasChanged = resetKeys.some((key, index) => key !== prevKeys[index]);
    if (hasChanged) {
      this.reset();
    }
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error) {
      const fallbackProps: ErrorFallbackProps = { error, reset: this.reset };
      const { fallback, className } = this.props;
      const content = fallback ? (
        fallback(fallbackProps)
      ) : (
        <DefaultErrorFallback {...fallbackProps} />
      );
      return <div className={className}>{content}</div>;
    }

    return this.props.children;
  }
}
