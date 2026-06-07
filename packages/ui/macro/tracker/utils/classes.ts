import { classNames } from "@/utils";

export const polylineClassName = (color?: string) =>
  classNames({
    "stroke-red-400": color === "red",
    "stroke-green-400": color === "green",
    "stroke-blue-400": color === "blue",
    "stroke-yellow-400": color === "yellow",
    "stroke-white": color === "white",
    "stroke-black": color === "black",
    "stroke-gray-300": color === "silver",
    "stroke-teal-300": color === "teal",
    "stroke-orange-300": color === "orange",
    "stroke-lime-300": color === "lime",
    "stroke-pink-300": color === "pink",
    "stroke-indigo-300": color === "indigo",
    " stroke-gray-300": color === "gray",
  });
export const pointClassName = (color?: string) =>
  classNames({
    "stroke-red-800": color === "red",
    "stroke-green-800": color === "green",
    "stroke-blue-800": color === "blue",
    "stroke-yellow-800": color === "yellow",
    "stroke-white": color === "white",
    "stroke-black": color === "black",
    "stroke-gray-500": color === "silver",
    "stroke-teal-500": color === "teal",
    "stroke-orange-500": color === "orange",
    "stroke-lime-500": color === "lime",
    "stroke-pink-500": color === "pink",
    "stroke-indigo-500": color === "indigo",
    " stroke-gray-500": color === "gray",
  });
export const carIconClassName = (color?: string) =>
  classNames("absolute -top-1/2 -left-1/2", {
    "[&_svg>g>g>path]:fill-red-700": color === "red",
    "[&_svg>g>g>path]:fill-green-700": color === "green",
    "[&_svg>g>g>path]:fill-blue-700": color === "blue",
    "[&_svg>g>g>path]:fill-yellow-700": color === "yellow",
    "[&_svg>g>g>path]:fill-white": color === "white",
    "[&_svg>g>g>path]:fill-black": color === "black",
    "[&_svg>g>g>path]:fill-gray-700": color === "silver",
  });

export const actionButtonClassNames = classNames(
  "min-w-10 min-h-10 border border-gray-300 rounded-md bg-gray-50",
  "hover:bg-gray-100 flex justify-center items-center cursor-pointer",
);
