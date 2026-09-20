import Link from "next/link";
import { Bell } from "lucide-react";
import { Icon } from "./Icon";

export function NavBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 px-6">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-xs bg-primary-500 text-sm font-bold text-white">
            V
          </span>
          <span className="text-heading-3 font-semibold text-neutral-900">Vertex</span>
        </Link>
        <nav className="flex items-center gap-4 overflow-x-auto text-body whitespace-nowrap text-neutral-700 sm:gap-6">
          <Link href="/courses" className="hover:text-neutral-900">
            Courses
          </Link>
          <Link href="/my-learning" className="hover:text-neutral-900">
            My Learning
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100"
        >
          <Icon icon={Bell} size={18} />
        </button>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-500">
          V
        </span>
      </div>
    </header>
  );
}
