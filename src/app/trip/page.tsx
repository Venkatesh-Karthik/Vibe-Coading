import Link from "next/link";

export default function TripIndexPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-sky-50 to-slate-50">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Trip Details</h1>
        <p className="text-slate-600 mb-6">
          Please select a specific trip to view its details.
        </p>
        <Link
          href="/explore"
          className="inline-block px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold rounded-xl shadow hover:shadow-lg transition"
        >
          Explore Destinations
        </Link>
      </div>
    </main>
  );
}
