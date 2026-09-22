import { Star } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { CourseCard } from "@/components/ui/Card";
import { NavBar } from "@/components/ui/NavBar";
import { getCourses } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";
import { formatDurationSeconds, formatLevel, sumDurations } from "@/lib/courseFormat";

const barHeights = [40, 64, 96, 56, 80, 120, 32, 72, 104, 48];

// Homepage grid prefers popular courses (a curation call, not stored
// data — the reference's 3 cards were placeholder content), filling any
// remaining slots from the rest so the grid always shows 3 when possible.
function pickFeaturedCourses<T extends { popular: boolean | null }>(courses: T[]): T[] {
  const popular = courses.filter((course) => course.popular);
  const rest = courses.filter((course) => !course.popular);
  return [...popular, ...rest].slice(0, 3);
}

export default async function Home() {
  const courses = await getCourses();
  const featuredCourses = pickFeaturedCourses(courses).map((course) => {
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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-cream">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        <section className="flex flex-col items-center px-4 py-20 text-center sm:py-28">
          <Badge variant="eyebrow">Intelligent Learning</Badge>
          <h1 className="mt-6 max-w-3xl text-display-1 font-bold text-neutral-900 sm:text-[3.5rem] sm:leading-[1.1]">
            Search your learning in plain English.
          </h1>
          <p className="mt-5 max-w-xl text-body-lg text-neutral-500">
            Vertex understands what you want to learn and finds the exact lessons across all your
            courses.
          </p>
          <Button variant="primary" trailingIcon="arrow-right" className="mt-8">
            Explore Courses
          </Button>
          <div className="mt-10 w-full max-w-xl">
            <Input
              aria-label="Search your learning"
              placeholder="Ask anything about your learning..."
              shortcut="⌘K"
            />
          </div>
        </section>

        <section className="border-t border-neutral-200 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-display-2 font-bold text-neutral-900">All Courses</h2>
            <ButtonLink href="/courses" variant="text" trailingIcon="arrow-right">
              View all courses
            </ButtonLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.href} {...course} />
            ))}
          </div>
        </section>

        <div className="flex items-center justify-center gap-3 border-t border-neutral-200 py-10">
          <Icon icon={Star} size={16} className="text-primary-500" />
          <p className="text-body text-neutral-500">New courses and lessons added every week.</p>
        </div>
      </main>

      <div
        aria-hidden
        className="flex h-40 items-end justify-center gap-3 px-4 sm:gap-4"
      >
        {barHeights.map((height, index) => (
          <div
            key={index}
            className="w-8 rounded-t-sm sm:w-12"
            style={{
              height,
              background: "linear-gradient(to top, var(--color-primary-500), transparent)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
