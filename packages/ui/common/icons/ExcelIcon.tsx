export default function ExcelIcon({
  className,
  color,
}: {
  className?: string;
  color?: string;
}) {
  // Extract color from className if no color prop is provided
  const extractColorFromClassName = (
    className?: string,
  ): string | undefined => {
    if (!className) return undefined;

    // Common color patterns in className
    const colorPatterns = [
      /text-(\w+)/, // text-red, text-blue, etc.
      /bg-(\w+)/, // bg-red, bg-blue, etc.
      /border-(\w+)/, // border-red, border-blue, etc.
      /fill-(\w+)/, // fill-red, fill-blue, etc.
      /stroke-(\w+)/, // stroke-red, stroke-blue, etc.
    ];

    for (const pattern of colorPatterns) {
      const match = className.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return undefined;
  };

  // Use provided color or extract from className
  const iconColor =
    color || extractColorFromClassName(className) || "var(--color-icon)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
    >
      <g
        id="Group_30175"
        data-name="Group 30175"
        transform="translate(-880 -216)"
      >
        <rect
          id="Rectangle_14325"
          data-name="Rectangle 14325"
          width="24"
          height="24"
          transform="translate(880 216)"
          fill="none"
        />
        <g
          id="Group_30156"
          data-name="Group 30156"
          transform="translate(1.563 -6.438)"
        >
          <path
            id="Path_2416"
            data-name="Path 2416"
            d="M11.639,23.85l-1.425-2.661a2.3,2.3,0,0,1-.167-.547h-.023a4.115,4.115,0,0,1-.191.57L8.4,23.85H6.182l2.636-4.085L6.407,15.679H8.674l1.182,2.45a4.166,4.166,0,0,1,.248.69h.022q.069-.239.26-.712L11.7,15.679h2.077L11.3,19.73l2.55,4.119H11.639Z"
            transform="translate(876.112 214.545)"
            fill={iconColor}
          />
          <path
            id="Path_2417"
            data-name="Path 2417"
            d="M29,22.632h7.963a.439.439,0,0,0,.442-.434V7.434A.439.439,0,0,0,36.963,7H29"
            transform="translate(863.469 219.48)"
            fill="none"
            stroke={iconColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.5"
          />
          <line
            id="Line_684"
            data-name="Line 684"
            x2="2.919"
            transform="translate(892.444 239.41)"
            fill="none"
            stroke={iconColor}
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.5"
          />
          <line
            id="Line_685"
            data-name="Line 685"
            x2="2.919"
            transform="translate(896.135 239.41)"
            fill="none"
            stroke={iconColor}
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.5"
          />
          <line
            id="Line_686"
            data-name="Line 686"
            x2="2.919"
            transform="translate(892.444 236.505)"
            fill="none"
            stroke={iconColor}
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.5"
          />
          <line
            id="Line_687"
            data-name="Line 687"
            x2="2.919"
            transform="translate(896.135 236.505)"
            fill="none"
            stroke={iconColor}
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.5"
          />
          <line
            id="Line_688"
            data-name="Line 688"
            x2="2.919"
            transform="translate(892.444 232.148)"
            fill="none"
            stroke={iconColor}
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.5"
          />
          <line
            id="Line_689"
            data-name="Line 689"
            x2="2.919"
            transform="translate(896.135 232.148)"
            fill="none"
            stroke={iconColor}
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.5"
          />
          <line
            id="Line_690"
            data-name="Line 690"
            x2="2.919"
            transform="translate(892.444 229.243)"
            fill="none"
            stroke={iconColor}
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.5"
          />
          <line
            id="Line_691"
            data-name="Line 691"
            x2="2.919"
            transform="translate(896.135 229.243)"
            fill="none"
            stroke={iconColor}
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.5"
          />
          <g
            id="Group_6072"
            data-name="Group 6072"
            transform="translate(880 224)"
          >
            <path
              id="Path_2418"
              data-name="Path 2418"
              d="M1,3.319V19.556l12.386,2.319V1Z"
              transform="translate(-1 -1)"
              fill="none"
              stroke={iconColor}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              strokeWidth="1.5"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
