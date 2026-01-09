"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Menu, X, LogOut, User } from "lucide-react";
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
      { href: "/organizer/new", label: "Organizer" },
      { href: "/join", label: "Join Trip" },
    ],
    []
  );

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
    >
      {/* Main Nav Bar */}
      <nav className="glass-panel px-6 py-3 flex items-center justify-between gap-4 w-full max-w-5xl">
        {/* Brand */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-2xl px-2 py-1 transition-transform duration-300 ease-out hover:-translate-y-[1px] flex-shrink-0 whitespace-nowrap"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
            <Globe2 className="relative h-6 w-6 text-sky-500 transition-colors duration-300 group-hover:text-sky-600" />
          </div>
          <span className="text-sm font-extrabold tracking-tight text-slate-900">
            TripMosaic<span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">+</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 md:flex flex-1 justify-end">
          <ul className="flex items-center gap-1 rounded-2xl border border-white/30 bg-white/20 px-1.5 py-1 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]">
            {nav.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cx(
                      "relative rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-300",
                      "hover:text-slate-900 hover:bg-white/30",
                      active
                        ? "text-slate-900 bg-white/45 shadow-[0_0_0_9999px_rgba(255,255,255,0.18)_inset]"
                        : "text-slate-700/90"
                    )}
                  >
                    <motion.span
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-x-2 -bottom-0.5 h-0.5 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                      />
                    )}
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={loginWithGoogle}
                disabled={authing}
                className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/40 disabled:opacity-60"
              >
                {authing ? "Opening…" : "Login with Google"}
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/30 text-slate-800 backdrop-blur-xl transition hover:bg-white/40 md:hidden"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-4 right-4 md:hidden mt-2 glass-panel overflow-hidden max-w-5xl mx-auto"
          >
            <div className="px-4 py-3 space-y-2">
              <div className="flex flex-col gap-1">
                {nav.map((item, idx) => {
                  const active = pathname?.startsWith(item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cx(
                          "rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-white/50 block",
                          active ? "bg-white/60 text-slate-900" : "text-slate-800"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Auth area */}
              <div className="pt-1">
                {loading ? (
                  <div className="h-10 w-full animate-pulse rounded-xl bg-white/40" />
                ) : user ? (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/30 bg-white/40 p-3 backdrop-blur-xl"
                  >
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
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={loginWithGoogle}
                    disabled={authing}
                    className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-60"
                  >
                    {authing ? "Opening…" : "Login with Google"}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
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
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/30 px-2 py-1 backdrop-blur-xl transition hover:bg-white/45 cursor-pointer"
      >
        <Avatar src={user.photo} name={user.name} />
        <span className="hidden text-sm font-medium text-slate-900 sm:inline">{user.name}</span>
      </motion.div>

      {/* glass dropdown */}
      <div className="invisible absolute right-0 mt-2 w-56 translate-y-1 rounded-2xl border border-white/30 bg-white/60 p-2 text-sm shadow-xl backdrop-blur-xl opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <Link
          href="/organizer/new"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-800 transition hover:bg-white/70"
        >
          <User className="h-4 w-4" />
          Organizer Dashboard
        </Link>
        <Link
          href="/explore"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-800 transition hover:bg-white/70"
        >
          <Globe2 className="h-4 w-4" />
          Explore Trips
        </Link>
        <button
          onClick={onLogout}
          className="mt-1 w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left font-medium text-red-600 transition hover:bg-red-50/80"
        >
          <LogOut className="h-4 w-4" />
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
      className="h-8 w-8 rounded-full object-cover ring-2 ring-white/40"
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sky-200 to-emerald-200 text-[11px] font-bold text-slate-700 ring-2 ring-white/40">
      {initials}
    </div>
  );
}
