"use client";

import Link from "next/link";

/* ----------------------------- Inline SVG Icons ---------------------------- */

function IconCompass(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm4.6 6.4-3.2 7.2a1 1 0 0 1-.5.5l-7.2 3.2a.75.75 0 0 1-1-.99l3.2-7.21a1 1 0 0 1 .5-.5L16 7.01a.75.75 0 0 1 .6 1.39ZM9.5 12.5a1.5 1.5 0 1 0 2-2 1.5 1.5 0 0 0-2 2Z"
        opacity=".85"
      />
    </svg>
  );
}

function IconWallet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M20 7h-1V6a2 2 0 0 0-2-2H6a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h12a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Zm-3 10H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11Zm3-3h-2v-5h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1Z"
        opacity=".9"
      />
      <circle cx="18.5" cy="12.5" r="1" fill="currentColor" />
    </svg>
  );
}

function IconCamera(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M9 4h6l1.3 2H20a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h3.7L9 4Zm3 13a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
        opacity=".9"
      />
      <circle cx="12" cy="12.5" r="3" fill="currentColor" opacity=".65" />
      <circle cx="18" cy="9" r="1" fill="currentColor" opacity=".7" />
    </svg>
  );
}

function IconChat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6.6l-4.3 3.2A1 1 0 0 1 7 19.6V17H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        opacity=".9"
      />
      <rect x="6.5" y="8" width="11" height="1.8" rx=".9" fill="currentColor" opacity=".6" />
      <rect x="6.5" y="11" width="7.5" height="1.8" rx=".9" fill="currentColor" opacity=".6" />
    </svg>
  );
}

/* ---------------------------------- Page ---------------------------------- */

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-56px)]">
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_50%_-10%,#93c5fd_0%,#6ee7b7_30%,#60a5fa_60%,transparent_100%)] opacity-25" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="rounded-3xl bg-gradient-to-r from-sky-400 via-emerald-400 to-blue-500 p-[1px] shadow-xl">
            <div className="rounded-3xl bg-white">
              <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_.95fr] items-center">
                {/* Left copy */}
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                    Plan. Travel. <span className="text-sky-600">Relive.</span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                    Discover curated trips, build day-wise itineraries, split expenses, and relive
                    memories together — all in one place.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/organizer/new"
                      className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-800"
                    >
                      Start as Organizer
                    </Link>
                    <Link
                      href="/explore"
                      className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Explore Trips
                    </Link>
                    <Link
                      href="/join"
                      className="inline-flex items-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                    >
                      Join with TripCode
                    </Link>
                  </div>
                </div>

                {/* Right visual: clean mock “app preview” */}
                <div className="relative hidden lg:block">
                  <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-sky-300 via-indigo-200 to-emerald-200 blur-2xl opacity-70" />
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
                    {/* Header bar */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-3 w-24 rounded bg-slate-200" />
                      <div className="flex gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      </div>
                    </div>
                    {/* Fake cards grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <PreviewTile title="Itinerary" Icon={IconCompass} />
                      <PreviewTile title="Expenses" Icon={IconWallet} />
                      <PreviewTile title="Memories" Icon={IconCamera} />
                      <PreviewTile title="Chat" Icon={IconChat} />
                    </div>
                  </div>
                </div>
                {/* /Right visual */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<IconCompass className="h-6 w-6 text-sky-600" />}
            title="Dynamic Planner"
            text="Drag-and-drop day cards, live map, and comments per item."
          />
          <FeatureCard
            icon={<IconWallet className="h-6 w-6 text-emerald-600" />}
            title="Collaborative Expenses"
            text="Log shared costs and see balances with one-click “Settle Up”."
          />
          <FeatureCard
            icon={<IconCamera className="h-6 w-6 text-indigo-600" />}
            title="Memory Wall"
            text="Upload photos & videos and highlight top moments from the trip."
          />
        </div>
      </section>
    </main>
  );
}

/* ----------------------------- UI Subcomponents ---------------------------- */

function PreviewTile({
  title,
  Icon,
}: {
  title: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <div className="h-3 w-20 rounded bg-slate-200" />
      </div>
      <div className="mt-3 h-20 rounded-md bg-slate-50 ring-1 ring-inset ring-slate-100" />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="mt-3 text-xs font-medium text-slate-500 opacity-0 transition group-hover:opacity-100">
        Learn more →
      </div>
    </div>
  );
}
