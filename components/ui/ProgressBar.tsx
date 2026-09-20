export function ProgressBar({ value, showLabel = true }: { value: number; showLabel?: boolean }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-primary-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel ? (
        <span className="shrink-0 text-sm text-neutral-500">{clamped}% complete</span>
      ) : null}
    </div>
  );
}
