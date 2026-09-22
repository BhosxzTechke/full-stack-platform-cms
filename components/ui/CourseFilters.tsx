"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "./Select";
import { Pagination } from "./Pagination";

export function CategoryFilter({
  categories,
  selected,
}: {
  categories: { slug: string; title: string }[];
  selected: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
  }

  return (
    <Select
      aria-label="Filter by category"
      value={selected}
      onChange={(event) => handleChange(event.target.value)}
    >
      <option value="">All categories</option>
      {categories.map((category) => (
        <option key={category.slug} value={category.slug}>
          {category.title}
        </option>
      ))}
    </Select>
  );
}

export function CoursesPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
  }

  return (
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
  );
}
