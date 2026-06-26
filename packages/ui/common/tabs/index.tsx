"use client";

import { cn } from "@/lib";
// import { useRouter, useSearchParams } from "next/navigation";
import {
  ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import Tabs from "./tab";

export type TabbedContentTab = {
  name: string;
  header: ReactNode;
  content: ReactNode;
  hideDivider?: boolean;
  sideElements?: ReactNode;
};

export type TabbedContentProps = {
  tabs?: TabbedContentTab[];
  defaultActiveTab?: number;
  /** When set, replaces the URL if `tab` is missing (e.g. `?tab=overall`). */
  defaultTab?: string;
  /** Keep inactive tab panels mounted (hidden) to preserve state and avoid refetches. */
  keepMounted?: boolean;
  enableScroll?: boolean;
  className?: {
    container?: string;
    tabs?: string;
    tab?: string;
    slider?: string;
    content?: string;
    header?: string;
  };
  onChange?: (index: number) => void;
  disabled?: boolean;
  sideElements?: ReactNode;
  headerElements?: ReactNode;
};

export function TabbedContent(props: TabbedContentProps) {
  const [active, setActive] = useState(props.defaultActiveTab || 0);
  const [isRtl, setIsRtl] = useState(false);
  const activeTab = props.tabs?.[active];
  // const router = useRouter();
  // const searchParams = useSearchParams();
  const enableScroll = props.enableScroll ?? false;

  useEffect(() => {
    setIsRtl(document.documentElement.dir === "rtl");
  }, []);

  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams);
  //   const urlTab = params.get("tab");
  //   if (!urlTab && props.defaultTab) {
  //     params.set("tab", props.defaultTab);
  //     router.replace(`?${params.toString()}`, { scroll: false });
  //     return;
  //   }
  //   const index = props.tabs?.findIndex((item) => item.name === urlTab) ?? -1;
  //   if (index >= 0) {
  //     setActive((current) => (current === index ? current : index));
  //   }
  // }, [searchParams, props.tabs, props.defaultTab, router]);

  const handleTabClick = useCallback(
    (_e: React.MouseEvent, index: number) => {
      if (props.disabled || index === active) return;

      startTransition(() => {
        setActive(index);
        props.onChange?.(index);
      });

      // const tabName = props.tabs?.[index]?.name;
      // if (tabName && searchParams.get("tab") !== tabName) {
      //   const params = new URLSearchParams(searchParams);
      //   params.set("tab", tabName);
      //   router.replace(`?${params.toString()}`, { scroll: false });
      // }
    },
    [active, props.disabled, props.onChange, props.tabs],
  );

  const tabCount = props.tabs?.length ?? 0;

  return (
    <div className={cn("flex flex-full flex-col", props.className?.container)}>
      <div className="flex h-20 shrink-0 items-center justify-between gap-4 px-4">
        <Tabs
          tabs={props.tabs?.map((tab) => ({
            name: tab.name,
            content: tab.header,
          }))}
          activeTab={active}
          onTabClick={handleTabClick}
          disabled={props.disabled}
          enableScroll={enableScroll}
          className={{
            container: props.className?.tabs,
            tab: props.className?.tab,
            slider: props.className?.slider,
            scrollContainer: undefined,
          }}
        />
        {props.sideElements}
        {activeTab?.sideElements}
      </div>
      {!activeTab?.hideDivider && (
        <div className="h-px w-full shrink-0 bg-border" />
      )}
      {props.headerElements && (
        <div className={cn("shrink-0", props.className?.header)}>
          {props.headerElements}
        </div>
      )}
      <div
        className={cn(
          "relative flex-full overflow-hidden",
          !props.keepMounted && "overflow-auto",
          props.className?.content,
        )}
      >
        {props.keepMounted && tabCount > 0 ? (
          <div
            className="absolute inset-0 flex min-h-0 transition-transform duration-100 ease-out"
            style={{
              transform: `translateX(${(isRtl ? active : -active) * 100}%)`,
            }}
          >
            {props.tabs?.map((tab, index) => (
              <div
                key={tab.name ?? index}
                className={cn(
                  "flex h-full w-full max-w-full shrink-0 flex-col",
                  index === active ? "overflow-auto" : "overflow-hidden",
                  index !== active && "pointer-events-none",
                )}
                aria-hidden={index !== active}
              >
                <div className="flex flex-full flex-col">{tab.content}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-full flex-col overflow-auto">
            {activeTab?.content}
          </div>
        )}
      </div>
    </div>
  );
}

export default TabbedContent;
