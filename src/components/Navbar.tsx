"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { useAuth } from "../lib/auth-context";

function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, loading, authing, loginWithGoogle, logout } = useAuth();

  const nav = useMemo(
    () => [
      { href: "/explore", label: "Explore" },
      { href: "/organizer", label: "Organizer" },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Liquid glass bar */}
      <div className="relative border-b border-white/20 bg-white/20 backdrop-blur-xl supports-[backdrop-filter]:bg-white/25">
        {/* faint light sweep */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(255,255,255,0.5),transparent_40%),radial-gradient(120%_120%_at_100%_0%,rgba(255,255,255,0.35),transparent_35%)]" />
        {/* hairline gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-2xl px-2 py-1 transition-transform duration-300 ease-out hover:-translate-y-[1px]"
          >
            <Logo className="h-5 w-5 text-sky-500 transition-colors duration-300 group-hover:text-sky-600" />
            <span className="text-sm font-extrabold tracking-tight text-slate-900">
              TripMosaic<span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">+</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-2 md:flex">
            <ul className="flex items-center gap-1 rounded-2xl border border-white/30 bg-white/20 px-1.5 py-1 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]">
              {nav.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cx(
                        "relative rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-300",
                        "hover:text-slate-900 hover:shadow-[0_0_0_9999px_rgba(255,255,255,0.12)_inset] hover:backdrop-blur-xl",
                        active
                          ? "text-slate-900 bg-white/45 shadow-[0_0_0_9999px_rgba(255,255,255,0.18)_inset]"
                          : "text-slate-700/90"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Auth area */}
            <div className="ml-2">
              {loading ? (
                <div className="h-9 w-24 animate-pulse rounded-xl bg-white/40 backdrop-blur-xs" />
              ) : user ? (
                <UserMenu
                  user={{ name: user.displayName || user.email || "You", photo: user.photoURL || "" }}
                  onLogout={logout}
                />
              ) : (
                <button
                  onClick={loginWithGoogle}
                  disabled={authing}
                  className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-60"
                >
                  {authing ? "Opening…" : "Login with Google"}
                </button>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/30 text-slate-800 backdrop-blur-xl transition hover:bg-white/40 md:hidden"
          >
            <Burger open={open} />
          </button>
        </nav>

        {/* Mobile drawer */}
        <div
          className={cx(
            "md:hidden overflow-hidden border-t border-white/25 bg-white/30 backdrop-blur-xl transition-[max-height] duration-500",
            open ? "max-h-72" : "max-h-0"
          )}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 space-y-2">
            <div className="flex flex-col gap-1">
              {nav.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cx(
                      "rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-white/50",
                      active ? "bg-white/60 text-slate-900" : "text-slate-800"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Auth area */}
            <div className="pt-1">
              {loading ? (
                <div className="h-10 w-full animate-pulse rounded-xl bg-white/40" />
              ) : user ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/30 bg-white/40 p-3 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.photoURL || ""} name={user.displayName || user.email || "You"} />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {user.displayName || user.email || "You"}
                      </div>
                      <div className="text-xs text-slate-600">Organizer / Traveler</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="rounded-lg border border-white/40 bg-white/40 px-3 py-1.5 text-sm font-medium text-slate-800 backdrop-blur-xl transition hover:bg-white/60"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  disabled={authing}
                  className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-60"
                >
                  {authing ? "Opening…" : "Login with Google"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function UserMenu({
  user,
  onLogout,
}: {
  user: { name: string; photo: string };
  onLogout: () => Promise<void>;
}) {
  return (
    <div className="relative group">
      <div className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/30 px-2 py-1 backdrop-blur-xl transition hover:bg-white/45">
        <Avatar src={user.photo} name={user.name} />
        <span className="hidden text-sm font-medium text-slate-900 sm:inline">{user.name}</span>
      </div>

      {/* glass dropdown */}
      <div className="invisible absolute right-0 mt-2 w-56 translate-y-1 rounded-2xl border border-white/30 bg-white/60 p-2 text-sm shadow-xl backdrop-blur-xl opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <Link
          href="/organizer"
          className="block rounded-xl px-3 py-2 text-slate-800 transition hover:bg-white/70"
        >
          Organizer Dashboard
        </Link>
        <Link
          href="/explore"
          className="block rounded-xl px-3 py-2 text-slate-800 transition hover:bg-white/70"
        >
          Explore Trips
        </Link>
        <button
          onClick={onLogout}
          className="mt-1 w-full rounded-xl px-3 py-2 text-left font-medium text-red-600 transition hover:bg-red-50/80"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function Avatar({ src, name }: { src?: string; name: string }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      className="h-8 w-8 rounded-full object-cover ring-1 ring-white/40"
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sky-200 to-emerald-200 text-[11px] font-bold text-slate-700 ring-1 ring-white/40">
      {initials}
    </div>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <div className="relative h-4 w-5">
      <span
        className={cx(
          "absolute left-0 top-0 h-0.5 w-5 rounded-full bg-slate-800 transition-all",
          open ? "translate-y-2 rotate-45" : ""
        )}
      />
      <span
        className={cx(
          "absolute left-0 top-2 h-0.5 w-5 rounded-full bg-slate-800 transition-all",
          open ? "opacity-0" : "opacity-100"
        )}
      />
      <span
        className={cx(
          "absolute left-0 top-4 h-0.5 w-5 rounded-full bg-slate-800 transition-all",
          open ? "-translate-y-2 -rotate-45" : ""
        )}
      />
    </div>
  );
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <path
        fill="url(#lg)"
        d="M12 2c5.5 0 10 4.5 10 10v4a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-4C2 6.5 6.5 2 12 2Zm0 3.2a1 1 0 0 0-1 1V9H7.2a1 1 0 1 0 0 2H11v3.8a1 1 0 1 0 2 0V11h3.8a1 1 0 1 0 0-2H13V6.2a1 1 0 0 0-1-1Z"
      />
    </svg>
  );
}
    