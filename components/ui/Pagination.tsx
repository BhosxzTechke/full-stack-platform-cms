"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "./Icon";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}) {
  const pages = new Set<number>([1, 2, 3, totalPages]);

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-sm text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
        aria-label="Previous page"
      >
        <Icon icon={ChevronLeft} size={16} />
      </button>

      {Array.from(pages)
        .sort((a, b) => a - b)
        .map((page, index, arr) => {
          const prev = arr[index - 1];
          const showEllipsis = prev !== undefined && page - prev > 1;

          return (
            <span key={page} className="flex items-center gap-1.5">
              {showEllipsis ? <span className="px-1 text-neutral-300">&hellip;</span> : null}
              <button
                type="button"
                onClick={() => onPageChange?.(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-sm ${
                  page === currentPage
                    ? "bg-primary-500 text-white"
                    : "text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {page}
              </button>
            </span>
          );
        })}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-sm text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
        aria-label="Next page"
      >
        <Icon icon={ChevronRight} size={16} />
      </button>
    </nav>
  );
}
