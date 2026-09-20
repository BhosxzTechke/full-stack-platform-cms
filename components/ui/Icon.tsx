import { type LucideIcon } from "lucide-react";

type IconProps = {
  icon: LucideIcon;
  variant?: "outline" | "filled";
  size?: number;
  className?: string;
};

/**
 * lucide-react ships one (outline) icon set; "filled" fakes a solid
 * style by filling the same glyph, since there is no separate solid set.
 */
export function Icon({ icon: IconComponent, variant = "outline", size = 24, className }: IconProps) {
  if (variant === "filled") {
    return (
      <IconComponent
        size={size}
        strokeWidth={0}
        fill="currentColor"
        className={className}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    />
  );
}
