import React from "react";

interface PlusMinusIconProps {
  toggled: boolean;
  size?: number;
  className?: string;
}

const PlusMinusIcon: React.FC<PlusMinusIconProps> = ({
  toggled,
  size = 18,
  className,
}) => {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        position: "relative",
      }}
    >
      <span
        className="absolute top-1/2 left-1/2 h-0.5 w-2/3 rounded bg-sidebar-icon transition-all duration-300 ease-in-out"
        style={{
          transform: toggled
            ? "translate(-50%, -50%) rotate(0deg)"
            : "translate(-50%, -50%) rotate(180deg)",
        }}
      />
      <span
        className={`absolute top-1/2 left-1/2 h-0.5 w-2/3 rounded bg-sidebar-icon transition-all duration-300 ease-in-out ${
          toggled ? "scale-x-0 opacity-0" : ""
        }`}
        style={{
          transform: toggled
            ? "translate(-50%, -50%) rotate(0deg) scaleX(0)"
            : "translate(-50%, -50%) rotate(90deg)",
          opacity: toggled ? 0 : 1,
        }}
      />
    </span>
  );
};

export default PlusMinusIcon;
