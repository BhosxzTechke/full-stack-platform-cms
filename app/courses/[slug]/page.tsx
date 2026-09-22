import { notFound } from "next/navigation";
import { BarChart2, Clock, Layers, Users } from "lucide-react";
import { getCourseBySlug } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { NavBar } from "@/components/ui/NavBar";
import { ModuleAccordion } from "@/components/ui/ModuleAccordion";
import { getLearningOutcomeIcon } from "@/lib/learningOutcomeIcons";
import { formatCompactCount, formatDurationSeconds, formatLevel, sumDurations } from "@/lib/courseFormat";

export default async function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const modules = course.modules.map((courseModule) => {
    const lessons = courseModule.lessons ?? [];
    const durationSeconds = sumDurations(lessons.map((lesson) => lesson.duration));

    return {
      key: courseModule._key,
      title: courseModule.title,
      summary: courseModule.summary,
      duration: formatDurationSeconds(durationSeconds),
      lessons,
    };
  });

  const totalDurationSeconds = sumDurations(
    modules.flatMap((courseModule) => courseModule.lessons.map((lesson) => lesson.duration))
  );
  const totalDuration = formatDurationSeconds(totalDurationSeconds);

  const firstLesson = modules[0]?.lessons[0];
  const startHref = firstLesson ? `/courses/${course.slug}/lessons/${firstLesson.slug}` : "#";

  return (
    <div className="min-h-screen bg-cream">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "All Courses", href: "/courses" },
            { label: course.title },
          ]}
        />

        <section className="mt-6 flex flex-col gap-8 lg:flex-row">
          <div className="w-full max-w-xs shrink-0 overflow-hidden rounded-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlFor(course.coverImage).width(600).height(600).url()}
              alt={course.coverImage.alt}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="flex-1">
            {course.popular ? <Badge variant="popular">Popular</Badge> : null}
            <h1 className="mt-4 text-display-1 font-bold text-neutral-900">{course.title}</h1>
            <p className="mt-4 max-w-xl text-body-lg text-neutral-500">{course.summary}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-body text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Icon icon={BarChart2} size={16} />
                {formatLevel(course.level)}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon icon={Clock} size={16} />
                {totalDuration}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon icon={Layers} size={16} />
                {modules.length} modules
              </span>
              {course.studentCount ? (
                <span className="flex items-center gap-1.5">
                  <Icon icon={Users} size={16} />
                  {formatCompactCount(course.studentCount)} students
                </span>
              ) : null}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <ButtonLink href={startHref} variant="primary" trailingIcon="arrow-right" className="px-6">
                Start Course
              </ButtonLink>
              <Button variant="tertiary" leadingIcon="bookmark">
                Bookmark
              </Button>
            </div>
          </div>
        </section>

        {course.learningOutcomes && course.learningOutcomes.length > 0 ? (
          <section className="mt-12 rounded-md border border-neutral-200 bg-white p-6">
            <h2 className="text-heading-1 font-semibold text-neutral-900">What you&apos;ll learn</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {course.learningOutcomes.map((outcome) => (
                <div
                  key={outcome._key}
                  className="rounded-sm border border-neutral-200 p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary-100 text-primary-500">
                    <Icon icon={getLearningOutcomeIcon(outcome.icon)} size={20} />
                  </span>
                  <h3 className="mt-3 text-heading-3 font-medium text-neutral-900">{outcome.title}</h3>
                  <p className="mt-1 text-body text-neutral-500">{outcome.description}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12 pb-28">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-1 font-semibold text-neutral-900">Course Content</h2>
            <span className="text-body text-neutral-500">
              {modules.length} modules &middot; {totalDuration}
            </span>
          </div>
          <ModuleAccordion courseSlug={course.slug} modules={modules} />
        </section>
      </main>

      <div className="sticky bottom-0 border-t border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex-1">
            <p className="text-body font-medium text-neutral-900">Your Progress</p>
            <div className="mt-2 max-w-xs">
              <ProgressBar value={0} />
            </div>
          </div>
          <ButtonLink href={startHref} variant="primary" trailingIcon="arrow-right">
            Start Course
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
