import type { SVGProps } from "react";
import { ICON_PATHS, type IconName } from "@/src/components/common/icons/iconPaths";

export type { IconName };

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
      width="20"
      {...props}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
