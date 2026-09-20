import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Icon } from "./Icon";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-small text-neutral-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-neutral-900">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-neutral-900" : undefined}>{item.label}</span>
            )}
            {!isLast ? <Icon icon={ChevronRight} size={14} /> : null}
          </span>
        );
      })}
    </nav>
  );
}
