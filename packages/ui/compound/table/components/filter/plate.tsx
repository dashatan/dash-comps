import PlateInput from "@/components/compound/license-plate";
import { FilterElementProps } from ".";
import { CarPlateInputValue } from "@/components/compound/license-plate/types";

export default function FilterPlateElement(props: FilterElementProps) {
  return (
    <div className="w-full px-2">
      <PlateInput
        type="car"
        className={{
          root: "h-10 w-44",
          car: {
            root: "rounded-[4px]",
            flag: {
              root: "flex w-auto flex-col justify-between px-1 pt-1 text-left",
              image: "min-w-4",
              text: "text-[6px]",
            },
            icon: "h-5 scale-[0.8]",
          },
          numberInput: "text-base",
          textInput: "text-base",
        }}
        defaultValue={props.defaultValue as CarPlateInputValue}
        onChange={(val) => val && props.onChange && props.onChange(val)}
      />
    </div>
  );
}
