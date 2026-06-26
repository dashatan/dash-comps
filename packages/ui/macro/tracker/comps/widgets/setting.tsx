import { X } from "lucide-react";
import Switch from "@/components/micro/inputs/switch/switch";
import { useFormContext } from "react-hook-form";
import { TrackerState } from "@/components/macro/tracker/utils/types";
import {
  autoPaneMap,
  eventBasedPlay,
  filterIran,
  maxPaneZoom,
  playSpeedIncrement,
  showSettings,
  traceCount,
} from "@/components/macro/tracker";
import { useSignals } from "@preact/signals-react/runtime";
import FadeAble from "@/components/micro/containers/fadeable";
import { Divider } from "@/components/micro/divider";

export default function TrackerSetting() {
  useSignals();
  const { watch } = useFormContext<TrackerState>();
  const dates = watch("dates");

  return (
    <div className="flex w-80 animate-fade flex-col overflow-auto rounded-md bg-gray-50 p-4 animate-duration-300 dir-rtl">
      <div
        id="header"
        className="mb-4 flex h-10 w-full items-center justify-between border-b border-gray-200 pb-2"
      >
        <span className="flex h-6 items-start text-lg font-bold text-gray-500">
          تنظیمات
        </span>
        <div
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200"
          onClick={() => {
            showSettings.value = false;
          }}
        >
          <X className="w-5 text-gray-500" />
        </div>
      </div>

      <div id="body" className="flex flex-col gap-4">
        {/* -------------------------------- auto pane ------------------------------- */}
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold text-gray-500">
            اجرا بر اساس زمان:
          </span>
          <div className="flex w-20 items-center justify-center">
            <Switch
              active={!eventBasedPlay.value}
              onChange={(a) => {
                eventBasedPlay.value = !a;
              }}
            />
          </div>
        </div>
        <FadeAble isVisible={!eventBasedPlay.value}>
          <div className="flex w-full items-center justify-between gap-2 text-nowrap">
            <span className="flex-1 font-semibold text-gray-500">
              چند برابر کردن سرعت اجرا:
            </span>
            <input
              type="number"
              className="h-10 w-20 rounded-md border border-gray-300 px-2 text-gray-700"
              min={1}
              max={1000}
              value={playSpeedIncrement.value}
              onChange={(e) => {
                playSpeedIncrement.value = parseFloat(e.target.value);
              }}
              disabled={eventBasedPlay.value}
            />
          </div>
        </FadeAble>
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold text-gray-500">فیلتر ایران:</span>
          <div className="flex w-20 items-center justify-center">
            <Switch
              active={filterIran.value}
              onChange={(a) => {
                filterIran.value = a;
              }}
            />
          </div>
        </div>
        <Divider className="my-1" />
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold text-gray-500">
            جابه‌جایی نقشه با متحرک:
          </span>
          <div className="flex w-20 items-center justify-center">
            <Switch
              active={autoPaneMap.value}
              onChange={(a) => {
                autoPaneMap.value = a;
              }}
            />
          </div>
        </div>
        <FadeAble isVisible={autoPaneMap.value}>
          <div className="flex w-full items-center justify-between gap-2 text-nowrap">
            <span className="flex-1 font-semibold text-gray-500">
              حداکثر زوم در جابجایی:
            </span>
            <input
              type="number"
              className="h-10 w-20 rounded-md border border-gray-300 px-2 text-gray-700"
              min={1}
              max={20}
              value={maxPaneZoom.value}
              onChange={(e) => {
                maxPaneZoom.value = parseFloat(e.target.value);
              }}
              disabled={!autoPaneMap.value}
            />
          </div>
        </FadeAble>
        <Divider className="my-1" />
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold text-gray-500">تعداد دنباله ها:</span>
          <input
            min={0}
            max={1000}
            className="h-10 w-20 rounded-md border border-gray-300 px-2 text-gray-700"
            onChange={(e) => {
              traceCount.value = parseFloat(e.target.value);
            }}
            type="number"
            value={traceCount.value}
          />
        </div>
      </div>
    </div>
  );
}
