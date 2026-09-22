import { CourseCard } from "@/components/ui/Card";
import { NavBar } from "@/components/ui/NavBar";
import { CategoryFilter, CoursesPagination } from "@/components/ui/CourseFilters";
import { getCategories, getCourses } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";
import { formatDurationSeconds, formatLevel, sumDurations } from "@/lib/courseFormat";

const PAGE_SIZE = 9;

export default async function CoursesPage({ searchParams }: PageProps<"/courses">) {
  const { category: categoryParam, page: pageParam } = await searchParams;
  const selectedCategory = typeof categoryParam === "string" ? categoryParam : "";
  const requestedPage = typeof pageParam === "string" ? Number(pageParam) : 1;

  const [courses, categories] = await Promise.all([getCourses(), getCategories()]);

  const filteredCourses = selectedCategory
    ? courses.filter((course) => course.category?.slug === selectedCategory)
    : courses;

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, requestedPage || 1), totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagedCourses = filteredCourses.slice(pageStart, pageStart + PAGE_SIZE);

  const cards = pagedCourses.map((course) => {
    const durationSeconds = sumDurations(
      course.modules?.flatMap((courseModule) => courseModule.lessons?.map((lesson) => lesson.duration) ?? []) ?? []
    );

    return {
      href: `/courses/${course.slug}`,
      coverImageUrl: urlFor(course.coverImage).width(80).height(80).url(),
      coverImageAlt: course.coverImage.alt,
      title: course.title,
      description: course.summary,
      level: formatLevel(course.level),
      duration: formatDurationSeconds(durationSeconds),
      moduleCount: course.modules?.length ?? 0,
    };
  });

  return (
    <div className="min-h-screen bg-cream">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-display-2 font-bold text-neutral-900">All Courses</h1>
          <div className="w-full sm:w-56">
            <CategoryFilter
              categories={categories.map((c) => ({ slug: c.slug ?? "", title: c.title }))}
              selected={selectedCategory}
            />
          </div>
        </div>

        {cards.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((course) => (
              <CourseCard key={course.href} {...course} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-body text-neutral-500">
            No courses in this category yet.
          </p>
        )}

        {totalPages > 1 ? (
          <div className="mt-10 flex justify-center">
            <CoursesPagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
