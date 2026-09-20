import { Star } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { CourseCard } from "@/components/ui/Card";
import { NavBar } from "@/components/ui/NavBar";

const courses = [
  {
    logo: "N",
    logoClassName: "bg-neutral-900",
    title: "Next.js for Production",
    description: "Build scalable, high-performance web applications with Next.js.",
    level: "Intermediate",
    duration: "18h 24m",
    moduleCount: 12,
  },
  {
    logo: "🐳",
    logoClassName: "bg-white border border-neutral-200 text-lg",
    title: "Docker Essentials",
    description: "Containerize applications and streamline your development workflow.",
    level: "Beginner",
    duration: "10h 12m",
    moduleCount: 8,
  },
  {
    logo: "TS",
    logoClassName: "bg-[#3178c6]",
    title: "TypeScript Deep Dive",
    description: "Go beyond the basics and write safer, more expressive code.",
    level: "Intermediate",
    duration: "14h 36m",
    moduleCount: 10,
  },
];

const barHeights = [40, 64, 96, 56, 80, 120, 32, 72, 104, 48];

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-cream">
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
            <Input placeholder="Ask anything about your learning..." shortcut="⌘K" />
          </div>
        </section>

        <section className="border-t border-neutral-200 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-display-2 font-bold text-neutral-900">All Courses</h2>
            <Button variant="text" trailingIcon="arrow-right">
              View all courses
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.title} {...course} />
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
