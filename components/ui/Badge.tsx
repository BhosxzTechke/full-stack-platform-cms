import { type ReactNode } from "react";

type BadgeVariant = "video" | "lesson" | "popular" | "eyebrow";

const variantClasses: Record<BadgeVariant, string> = {
  video: "bg-neutral-900 text-white rounded-xs",
  lesson: "bg-primary-100 text-primary-500 rounded-xs",
  popular: "bg-primary-500 text-white rounded-xs",
  eyebrow: "bg-primary-100 text-primary-500 rounded-full",
};

export function Badge({ variant, children }: { variant: BadgeVariant; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
