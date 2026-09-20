import {
  Bell,
  Search,
  Play,
  FileText,
  Bookmark,
  BarChart2,
  Clock,
  User,
  ChevronRight,
} from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CourseCard, LessonCard, ResourceCard } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Pagination } from "@/components/ui/Pagination";
import { NavBar } from "@/components/ui/NavBar";

const primaryColors = [
  { name: "Primary 500", hex: "#F97316" },
  { name: "Primary 400", hex: "#FB923C" },
  { name: "Primary 300", hex: "#FDBA74" },
  { name: "Primary 200", hex: "#FED7AA" },
  { name: "Primary 100", hex: "#FFEEE5" },
];

const neutralColors = [
  { name: "Neutral 900", hex: "#0F172A" },
  { name: "Neutral 700", hex: "#33415A" },
  { name: "Neutral 500", hex: "#64748B" },
  { name: "Neutral 300", hex: "#CBD5E1" },
  { name: "Neutral 200", hex: "#E2E8F0" },
  { name: "Neutral 100", hex: "#F1F5F9" },
  { name: "Neutral 50", hex: "#FAFAFC" },
  { name: "White", hex: "#FFFFFF" },
];

const typeScale = [
  { style: "Display 1", font: "Playfair Display", size: "48 / 56", weight: "Bold", use: "Page titles" },
  { style: "Display 2", font: "Playfair Display", size: "36 / 44", weight: "Bold", use: "Section titles" },
  { style: "Heading 1", font: "Inter", size: "28 / 36", weight: "Semi Bold", use: "Card titles" },
  { style: "Heading 2", font: "Inter", size: "22 / 30", weight: "Semi Bold", use: "Sub section" },
  { style: "Heading 3", font: "Inter", size: "18 / 26", weight: "Medium", use: "Small titles" },
  { style: "Body Large", font: "Inter", size: "16 / 24", weight: "Regular", use: "Body copy" },
  { style: "Body", font: "Inter", size: "14 / 20", weight: "Regular", use: "Supporting text" },
  { style: "Small", font: "Inter", size: "12 / 16", weight: "Regular", use: "Captions, meta" },
];

const spacingScale = [4, 8, 12, 16, 24, 32, 40, 48, 64];

const radiusScale = [
  { name: "xs", px: "4px", className: "rounded-xs" },
  { name: "sm", px: "8px", className: "rounded-sm" },
  { name: "md", px: "12px", className: "rounded-md" },
  { name: "lg", px: "16px", className: "rounded-lg" },
  { name: "xl", px: "24px", className: "rounded-xl" },
  { name: "full", px: "circle", className: "rounded-full" },
];

const shadowScale = [
  { name: "Sm", value: "0 1px 2px 0", rgba: "rgba(15, 23, 42, 0.05)" },
  { name: "Md", value: "0 4px 12px -2px", rgba: "rgba(15, 23, 42, 0.08)" },
  { name: "Lg", value: "0 12px 24px -4px", rgba: "rgba(15, 23, 42, 0.10)" },
  { name: "Xl", value: "0 20px 40px -8px", rgba: "rgba(15, 23, 42, 0.12)" },
];

const outlineIcons = [Bell, Search, Play, FileText, Bookmark, BarChart2, Clock, User, ChevronRight];

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-neutral-200 py-10 first:border-t-0">
      <h2 className="mb-6 flex items-center gap-2 text-small font-semibold tracking-wide text-primary-500">
        <span>{number}</span>
        <span className="uppercase text-neutral-900">{title}</span>
      </h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="flex min-h-full flex-col bg-neutral-50">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        <div className="py-10">
          <p className="mb-2 text-small font-semibold uppercase tracking-wide text-primary-500">Vertex</p>
          <h1 className="text-display-1 font-bold text-neutral-900">Design System</h1>
          <p className="mt-3 max-w-xl text-body-lg text-neutral-500">
            A unified design language for the Vertex learning platform. Clean, modern and focused
            on clarity, consistency and intuitive learning experiences.
          </p>
        </div>

        <Section number="01" title="Colors">
          <p className="mb-3 text-body font-medium text-neutral-900">Primary</p>
          <div className="mb-6 flex flex-wrap gap-4">
            {primaryColors.map((color) => (
              <div key={color.name} className="w-28">
                <div
                  className="h-16 w-full rounded-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="mt-2 text-small text-neutral-900">{color.name}</p>
                <p className="text-small text-neutral-500">{color.hex}</p>
              </div>
            ))}
          </div>
          <p className="mb-3 text-body font-medium text-neutral-900">Neutral</p>
          <div className="flex flex-wrap gap-4">
            {neutralColors.map((color) => (
              <div key={color.name} className="w-28">
                <div
                  className="h-16 w-full rounded-sm border border-neutral-200"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="mt-2 text-small text-neutral-900">{color.name}</p>
                <p className="text-small text-neutral-500">{color.hex}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section number="02" title="Typography">
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
            <div>
              <p className="font-display text-5xl text-neutral-900">Ag</p>
              <p className="mt-2 text-body font-medium text-neutral-900">Playfair Display</p>
              <p className="text-small text-neutral-500">Elegant &middot; Readable &middot; Timeless</p>
            </div>
            <div>
              <p className="font-sans text-5xl text-neutral-900">Ag</p>
              <p className="mt-2 text-body font-medium text-neutral-900">Inter</p>
              <p className="text-small text-neutral-500">Clean &middot; Modern &middot; Highly legible</p>
            </div>
          </div>
        </Section>

        <Section number="03" title="Type Scale">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-body">
              <thead>
                <tr className="text-small uppercase text-neutral-500">
                  <th className="pb-2 pr-4">Style</th>
                  <th className="pb-2 pr-4">Font</th>
                  <th className="pb-2 pr-4">Size / Line Height</th>
                  <th className="pb-2 pr-4">Weight</th>
                  <th className="pb-2">Use</th>
                </tr>
              </thead>
              <tbody>
                {typeScale.map((row) => (
                  <tr key={row.style} className="border-t border-neutral-200">
                    <td className="py-2 pr-4 font-medium text-neutral-900">{row.style}</td>
                    <td className="py-2 pr-4 text-neutral-500">{row.font}</td>
                    <td className="py-2 pr-4 text-neutral-500">{row.size}</td>
                    <td className="py-2 pr-4 text-neutral-500">{row.weight}</td>
                    <td className="py-2 text-neutral-500">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section number="04" title="Spacing System">
          <p className="mb-4 text-small text-neutral-500">Base unit: 4px</p>
          <div className="flex flex-wrap items-end gap-4">
            {spacingScale.map((px) => (
              <div key={px} className="flex flex-col items-center gap-2">
                <div
                  className="rounded-xs bg-primary-100"
                  style={{ width: px, height: px }}
                />
                <p className="text-small text-neutral-500">{px}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section number="05" title="Radius & Shadows">
          <p className="mb-3 text-body font-medium text-neutral-900">Radius</p>
          <div className="mb-8 flex flex-wrap gap-6">
            {radiusScale.map((radius) => (
              <div key={radius.name} className="flex flex-col items-center gap-2">
                <div
                  className={`h-14 w-14 border border-neutral-200 bg-white ${radius.className}`}
                />
                <p className="text-small text-neutral-500">
                  {radius.px} ({radius.name})
                </p>
              </div>
            ))}
          </div>
          <p className="mb-3 text-body font-medium text-neutral-900">Shadows</p>
          <div className="flex flex-wrap gap-4">
            {shadowScale.map((shadow) => (
              <div
                key={shadow.name}
                className="w-40 rounded-sm bg-white p-4"
                style={{ boxShadow: `${shadow.value} ${shadow.rgba}` }}
              >
                <p className="text-body font-medium text-neutral-900">{shadow.name}</p>
                <p className="text-small text-neutral-500">
                  {shadow.value} {shadow.rgba}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section number="06" title="Icons">
          <p className="mb-3 text-body font-medium text-neutral-900">Outline Style</p>
          <div className="mb-6 flex flex-wrap gap-4">
            {outlineIcons.map((IconComponent, index) => (
              <div
                key={index}
                className="flex h-11 w-11 items-center justify-center rounded-sm border border-neutral-200 text-neutral-700"
              >
                <Icon icon={IconComponent} variant="outline" />
              </div>
            ))}
          </div>
          <p className="mb-3 text-body font-medium text-neutral-900">Filled Style</p>
          <div className="flex flex-wrap gap-4">
            {outlineIcons.map((IconComponent, index) => (
              <div
                key={index}
                className="flex h-11 w-11 items-center justify-center rounded-sm border border-neutral-200 text-neutral-900"
              >
                <Icon icon={IconComponent} variant="filled" />
              </div>
            ))}
          </div>
        </Section>

        <Section number="07" title="Buttons">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="text-small uppercase text-neutral-500">
                  <th className="pb-3 pr-4"></th>
                  <th className="pb-3 pr-4">Primary</th>
                  <th className="pb-3 pr-4">Secondary</th>
                  <th className="pb-3 pr-4">Tertiary</th>
                  <th className="pb-3">Text</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 pr-4 text-small text-neutral-500">Default</td>
                  <td className="py-3 pr-4">
                    <Button variant="primary">Get Started</Button>
                  </td>
                  <td className="py-3 pr-4">
                    <Button variant="secondary">Explore Courses</Button>
                  </td>
                  <td className="py-3 pr-4">
                    <Button variant="tertiary" trailingIcon="external-link">
                      View Lesson
                    </Button>
                  </td>
                  <td className="py-3">
                    <Button variant="text" trailingIcon="play">
                      Watch Video
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-small text-neutral-500">Disabled</td>
                  <td className="py-3 pr-4">
                    <Button variant="primary" disabled>
                      Get Started
                    </Button>
                  </td>
                  <td className="py-3 pr-4">
                    <Button variant="secondary" disabled>
                      Explore Courses
                    </Button>
                  </td>
                  <td className="py-3 pr-4">
                    <Button variant="tertiary" trailingIcon="external-link" disabled>
                      View Lesson
                    </Button>
                  </td>
                  <td className="py-3">
                    <Button variant="text" trailingIcon="play" disabled>
                      Watch Video
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-small text-neutral-500">
            Height: 44px (default) &middot; Radius: 12px &middot; Font: Inter Medium (14&ndash;16px)
          </p>
        </Section>

        <Section number="08" title="Inputs">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="max-w-sm">
              <p className="mb-2 text-small text-neutral-500">Search / Text Input</p>
              <Input placeholder="Search anything..." shortcut="⌘K" />
            </div>
            <div className="max-w-sm">
              <p className="mb-2 text-small text-neutral-500">Select</p>
              <Select defaultValue="most-relevant">
                <option value="most-relevant">Most Relevant</option>
                <option value="newest">Newest</option>
              </Select>
            </div>
          </div>
          <p className="mt-3 text-small text-neutral-500">
            Height: 44px &middot; Radius: 12px &middot; Border: 1px solid #E2E8F0 &middot; Focus: border color #FB923C
          </p>
        </Section>

        <Section number="09" title="Badges / Tags">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="mb-2 text-small text-neutral-500">Video</p>
              <Badge variant="video">Video</Badge>
            </div>
            <div>
              <p className="mb-2 text-small text-neutral-500">Lesson</p>
              <Badge variant="lesson">Lesson</Badge>
            </div>
            <div>
              <p className="mb-2 text-small text-neutral-500">Popular</p>
              <Badge variant="popular">Popular</Badge>
            </div>
          </div>
        </Section>

        <Section number="10" title="Status / Indicators">
          <div className="flex flex-wrap gap-6">
            <StatusIndicator status="in-progress" />
            <StatusIndicator status="completed" />
            <StatusIndicator status="now-playing" />
            <StatusIndicator status="locked" />
          </div>
        </Section>

        <Section number="11" title="Progress Bar">
          <div className="max-w-md">
            <ProgressBar value={35} />
          </div>
        </Section>

        <Section number="12" title="Cards">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CourseCard
              logo="N"
              title="Next.js for Production"
              description="Build scalable, high-performance web applications with Next.js."
              level="Intermediate"
              duration="18h 24m"
              moduleCount={12}
            />
            <LessonCard
              kind="video"
              title="Data Fetching in Server Components"
              description="Learn how to fetch data on the server using async/await and Next.js best practices."
              label="Lesson 5.1"
              meta="12:45"
              action={
                <Button variant="text" trailingIcon="play" className="h-auto p-0 text-xs">
                  Watch from 12:45
                </Button>
              }
            />
            <LessonCard
              kind="lesson"
              title="Data Fetching & Caching"
              description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
              label="Module 5"
              meta=""
              action={
                <Button variant="text" trailingIcon="external-link" className="h-auto p-0 text-xs">
                  View lesson
                </Button>
              }
            />
            <ResourceCard
              title="Caching and Revalidation Guide"
              description="Deep dive into Next.js caching strategies."
              fileMeta="PDF · 1.2 MB"
            />
          </div>
        </Section>

        <Section number="13" title="Navigation">
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-2 text-small text-neutral-500">Breadcrumbs</p>
              <Breadcrumbs
                items={[
                  { label: "All Courses", href: "/courses" },
                  { label: "Next.js for Production", href: "/courses/nextjs-for-production" },
                  { label: "Data Fetching & Caching" },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-small text-neutral-500">Pagination</p>
              <Pagination currentPage={1} totalPages={8} />
            </div>
          </div>
        </Section>

        <Section number="14" title="Principles">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-body font-medium text-neutral-900">Clarity First</p>
              <p className="mt-1 text-small text-neutral-500">
                Every element should communicate clearly.
              </p>
            </div>
            <div>
              <p className="text-body font-medium text-neutral-900">Consistency</p>
              <p className="mt-1 text-small text-neutral-500">
                Use components and patterns consistently across the platform.
              </p>
            </div>
            <div>
              <p className="text-body font-medium text-neutral-900">Focus &amp; Calm</p>
              <p className="mt-1 text-small text-neutral-500">
                Remove noise and help learners focus on what matters.
              </p>
            </div>
            <div>
              <p className="text-body font-medium text-neutral-900">Accessible</p>
              <p className="mt-1 text-small text-neutral-500">
                Design with accessibility and inclusivity in mind.
              </p>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
