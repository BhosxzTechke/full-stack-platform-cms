import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { ArrowRight, ExternalLink, PlayCircle } from "lucide-react";
import { Icon } from "./Icon";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";
type TrailingIcon = "external-link" | "play" | "arrow-right";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  trailingIcon?: TrailingIcon;
  children: ReactNode;
};

const trailingIcons = {
  "external-link": ExternalLink,
  play: PlayCircle,
  "arrow-right": ArrowRight,
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-400 disabled:bg-primary-200 disabled:text-white/70 px-4",
  secondary:
    "bg-white text-primary-500 border border-primary-500 hover:bg-primary-100 disabled:text-primary-200 disabled:border-primary-200 px-4",
  tertiary:
    "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 disabled:text-neutral-300 disabled:border-neutral-100 px-3",
  text:
    "bg-transparent text-neutral-900 hover:text-primary-500 disabled:text-neutral-300 px-0",
};

export function Button({
  variant = "primary",
  trailingIcon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const TrailingIconComponent = trailingIcon ? trailingIcons[trailingIcon] : null;

  return (
    <button
      disabled={disabled}
      className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className ?? ""}`}
      {...props}
    >
      {children}
      {TrailingIconComponent ? <Icon icon={TrailingIconComponent} size={16} /> : null}
    </button>
  );
}
