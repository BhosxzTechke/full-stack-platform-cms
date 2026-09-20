import { type ReactNode } from "react";
import { BarChart2, Clock, File, Layers } from "lucide-react";
import { Icon } from "./Icon";
import { Badge } from "./Badge";

function CardShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-md border border-neutral-200 bg-white p-4 shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function CourseCard({
  initial,
  title,
  description,
  level,
  duration,
  moduleCount,
}: {
  initial: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  moduleCount: number;
}) {
  return (
    <CardShell>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-neutral-900 text-sm font-semibold text-white">
        {initial}
      </div>
      <h3 className="text-heading-3 font-medium text-neutral-900">{title}</h3>
      <p className="mt-1 text-body text-neutral-500">{description}</p>
      <div className="mt-4 flex items-center gap-4 text-small text-neutral-500">
        <span className="flex items-center gap-1">
          <Icon icon={BarChart2} size={14} />
          {level}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon={Clock} size={14} />
          {duration}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon={Layers} size={14} />
          {moduleCount} modules
        </span>
      </div>
    </CardShell>
  );
}

export function LessonCard({
  kind,
  label,
  title,
  description,
  meta,
  action,
}: {
  kind: "video" | "lesson";
  label: string;
  title: string;
  description: string;
  meta: string;
  action: ReactNode;
}) {
  return (
    <CardShell>
      <Badge variant={kind}>{kind}</Badge>
      <h3 className="mt-2 text-heading-3 font-medium text-neutral-900">{title}</h3>
      <p className="mt-1 text-body text-neutral-500">{description}</p>
      <div className="mt-4 flex items-center justify-between text-small text-neutral-500">
        <span>
          {label} &middot; {meta}
        </span>
        {action}
      </div>
    </CardShell>
  );
}

export function ResourceCard({
  title,
  description,
  fileMeta,
}: {
  title: string;
  description: string;
  fileMeta: string;
}) {
  return (
    <CardShell className="flex items-start gap-3">
      <Icon icon={File} size={20} className="mt-0.5 shrink-0 text-neutral-500" />
      <div className="flex-1">
        <h3 className="text-heading-3 font-medium text-neutral-900">{title}</h3>
        <p className="mt-1 text-body text-neutral-500">{description}</p>
        <span className="mt-2 block text-small text-neutral-500">{fileMeta}</span>
      </div>
    </CardShell>
  );
}
