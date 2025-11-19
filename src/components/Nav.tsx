import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
              V
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:inline">
              Vibe Coading
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/explore"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/features"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              About
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            href="/join"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
