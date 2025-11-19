"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../lib/auth-context";

function makeTripCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function NewTripPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [baseCost, setBaseCost] = useState<number | "">("");
  const [isSaving, setSaving] = useState(false);

  async function createTrip(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    if (!title.trim() || !destination.trim() || !startDate || !endDate) {
      alert("Please fill all required fields.");
      return;
    }

    setSaving(true);
    try {
      const tripCode = makeTripCode();
      const docRef = await addDoc(collection(db, "trips"), {
        title: title.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        baseCost: baseCost === "" ? null : Number(baseCost),
        code: tripCode,
        ownerId: user.uid,
        ownerName: user.displayName || user.email || "Organizer",
        members: [
          {
            uid: user.uid,
            name: user.displayName || user.email || "Organizer",
            role: "organizer",
            joinedAt: serverTimestamp(),
          },
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        analytics: { participants: 1, revenue: 0, ratings: [] as number[] },
        // optional empty shells
        itinerary: [], // [{day:1, items:[{place, notes, time}]}]
      });

      router.push(`/trip/${docRef.id}`); // go to the trip page
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto p-6">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Create a Trip</h1>
        <p className="mb-4 text-slate-600">
          You need to login as an organizer before creating a trip.
        </p>
        <button
          onClick={loginWithGoogle}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-extrabold tracking-tight mb-1">Create a Trip</h1>
      <p className="text-slate-600 mb-6">
        Add basic details now. You can edit itinerary, expenses, and members later.
      </p>

      <form onSubmit={createTrip} className="space-y-5 rounded-2xl bg-white p-6 shadow">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Trip Title<span className="text-red-500">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Goa Weekend Getaway"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Destination<span className="text-red-500">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Goa, India"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Start Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              End Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Approx. Base Cost (per person)
          </label>
          <input
            type="number"
            min={0}
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 3500"
            value={baseCost}
            onChange={(e) => setBaseCost(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {isSaving ? "Creating…" : "Create Trip"}
          </button>
        </div>
      </form>
    </div>
  );
}
