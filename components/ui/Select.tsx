import { type SelectHTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Icon } from "./Icon";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative flex h-11 items-center rounded-md border border-neutral-200 bg-white px-4 focus-within:border-primary-400">
      <select
        className={`h-full w-full appearance-none bg-transparent pr-6 text-sm text-neutral-900 outline-none ${className ?? ""}`}
        {...props}
      >
        {children}
      </select>
      <Icon
        icon={ChevronDown}
        size={16}
        className="pointer-events-none absolute right-4 text-neutral-500"
      />
    </div>
  );
}
