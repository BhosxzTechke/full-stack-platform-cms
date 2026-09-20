import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import { Icon } from "./Icon";

type Status = "in-progress" | "completed" | "now-playing" | "locked";

const statusConfig: Record<Status, { icon: typeof Circle; label: string; className: string }> = {
  "in-progress": { icon: Circle, label: "In Progress", className: "text-neutral-500" },
  completed: { icon: CheckCircle2, label: "Completed", className: "text-primary-500" },
  "now-playing": { icon: PlayCircle, label: "Now Playing", className: "text-primary-500" },
  locked: { icon: Lock, label: "Locked", className: "text-neutral-300" },
};

export function StatusIndicator({ status }: { status: Status }) {
  const { icon, label, className } = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
      <Icon icon={icon} size={16} />
      {label}
    </span>
  );
}
