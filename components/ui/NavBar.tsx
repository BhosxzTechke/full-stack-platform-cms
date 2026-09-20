import Link from "next/link";

export function NavBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 px-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-xs bg-primary-500 text-sm font-bold text-white">
          V
        </span>
        <span className="text-heading-3 font-semibold text-neutral-900">Vertex</span>
      </Link>
      <nav className="flex items-center gap-6 text-body text-neutral-700">
        <Link href="/courses" className="hover:text-neutral-900">
          Courses
        </Link>
        <Link href="/my-learning" className="hover:text-neutral-900">
          My Learning
        </Link>
      </nav>
    </header>
  );
}
