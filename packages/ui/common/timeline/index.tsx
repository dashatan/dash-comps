import React from "react";

interface TimelineItem {
  time?: string;
  title?: string;
  version?: string;
  description?: string;
  changes?: string[];
  image?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

function Timeline({ items }: TimelineProps) {
  return (
    <div className="flex cursor-default flex-col items-center bg-gray-50">
      <div className="relative flex min-w-200 flex-col items-start pl-8">
        <div className="absolute bottom-0 start-28 top-0 w-0.5 bg-gray-300"></div>
        {items.map((item, index) => (
          <div key={index} className="relative my-8 ms-4 flex items-start">
            <div className="absolute start-0 ms-[3px]">
              <div className="flex items-start gap-2 dir-rtl">
                <div className="flex w-20 flex-col items-end">
                  <span className="text-sm font-semibold text-gray-500">{item.time}</span>
                  <div className="flex h-8 w-20 items-center justify-center rounded-lg border border-primary-300 bg-primary-50 text-xs text-primary-600">
                    {`نسخه ${item.version}`}
                  </div>
                </div>
                <div className="mt-1 size-3 rounded-full bg-gray-400"></div>
              </div>
            </div>
            <div className="ms-32 flex flex-col gap-2">
              <span className="text-lg font-semibold">{item.version ? `توضیحات نسخه ${item.version}` : item.title}</span>
              <span className="font-semibold text-gray-600">{item.description}</span>
              <ul className="flex flex-col gap-2">
                {item.changes?.map((change, index) => (
                  <li key={index} className="flex items-center gap-4 font-semibold text-gray-500">
                    <div className="size-1 bg-gray-300" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
