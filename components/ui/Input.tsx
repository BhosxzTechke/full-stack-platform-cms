import { type InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { Icon } from "./Icon";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  shortcut?: string;
};

export function Input({ shortcut, className, ...props }: InputProps) {
  return (
    <div className="relative flex h-11 items-center rounded-md border border-neutral-200 bg-white px-4 focus-within:border-primary-400">
      <Icon icon={Search} size={16} className="mr-2 shrink-0 text-neutral-500" />
      <input
        className={`h-full flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 outline-none ${className ?? ""}`}
        {...props}
      />
      {shortcut ? (
        <span className="ml-2 shrink-0 rounded border border-neutral-200 px-1.5 py-0.5 text-xs text-neutral-500">
          {shortcut}
        </span>
      ) : null}
    </div>
  );
}
