import usePlateSignals from "@/components/compound/license-plate/context/usePlateSignals";
import { getPlateForegroundColorVariable } from "@/components/compound/license-plate/utils/color-classes";
import { lettersColorCodes } from "@/components/compound/license-plate/utils/letters";
import { cn } from "@/lib";
import { PlateValue } from "@/components/compound/license-plate/types";
import { colors } from "@/components/compound/license-plate/components/letters-box";
import IranPlateIcon from "@/components/common/icons/iran-plate";
import { usePlateClipboardActions } from "@/components/compound/license-plate/hooks";
import { normalizePlateValueToCarLocalValue } from "@/components/compound/license-plate/utils";

export default function PlateCard({
  value,
  className,
}: {
  value: PlateValue | undefined;
  className?: string;
}) {
  const { letters } = usePlateSignals();
  const { p1, p2, p3, p4, p5, p6, p7, p8 } = value || {};
  const letter = letters?.find((x) => x.name === p3 || x.id === Number(p3));
  const colorCode = lettersColorCodes.find(
    (x) => x.letter === letter?.name,
  )?.colorCode;
  const bg =
    colorCode && colors[colorCode] ? colors[colorCode] : "bg-white text-black";
  const foregroundVariable = getPlateForegroundColorVariable(colorCode);

  const { handleCopy } = usePlateClipboardActions(
    normalizePlateValueToCarLocalValue(value),
  );

  return (
    <div
      className={cn(
        "flex h-12 max-w-fit min-w-fit cursor-copy overflow-hidden rounded-md border text-base font-extrabold select-none dir-ltr",
        bg,
        className,
      )}
      onClick={(e) => {
        handleCopy(e);
      }}
    >
      <div
        className={cn(
          "flex h-full w-8 flex-col items-start justify-center gap-1 bg-plate-flag px-1 pt-1 pb-1.5 text-left text-white",
        )}
      >
        <img src="/iran-flag.png" alt="Iran flag" className="w-10/12" />
        <div className="flex flex-col pe-1 text-[6px] leading-loose font-bold">
          <span className="flex h-[6px]">I.R.</span>
          <span className="flex h-[6px]">IRAN</span>
        </div>
      </div>

      <PlateCardPart value={`${p1 || "*"}${p2 || "*"}`} />

      <PlateCardPart value={letter?.name || p3 || "*"} className={bg} />

      <PlateCardPart value={`${p4 || "*"}${p5 || "*"}${p6 || "*"}`} />

      <div className={cn("flex h-full w-10 border-r")}>
        <div className="flex h-full w-full flex-col items-center justify-between gap-0.5 py-1.5">
          <div className="">
            <IranPlateIcon
              color={foregroundVariable}
              className={cn("h-1.5 w-7 **:stroke-2")}
            />
          </div>
          <span className="">{`${p7 || "*"}${p8 || "*"}`}</span>
        </div>
      </div>
    </div>
  );
}

function PlateCardPart({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-10 items-center justify-center border-r",
        className,
      )}
    >
      {value}
    </div>
  );
}
