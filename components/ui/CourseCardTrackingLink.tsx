"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { type ReactNode } from "react";

export function CourseCardTrackingLink({
  href,
  courseId,
  source,
  children,
}: {
  href: string;
  courseId: string;
  source: "home" | "catalog";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block"
      onClick={() => posthog.capture("course_selected", { course_id: courseId, source })}
    >
      {children}
    </Link>
  );
}
