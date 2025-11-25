"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export default function JoinByCodePage() {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function join() {
    setMsg(null);
    if (!user) {
      setMsg("Please login with Google first (top right).");
      return;
    }
    if (!db) {
      setMsg("Firebase not configured. Please check environment variables.");
      return;
    }
    const clean = code.trim().toUpperCase();
    if (clean.length < 4) {
      setMsg("Enter a valid TripCode.");
      return;
    }
    setBusy(true);
    try {
      // find trip by trip_code
      const tripsQ = query(
        collection(db, "trips"),
        where("trip_code", "==", clean)
      );
      const snap = await getDocs(tripsQ);
      if (snap.empty) {
        setMsg("No trip found for that code.");
        return;
      }
      const t = snap.docs[0];
      const tripId = t.id;
      // write membership under /participants/{tripId}/users/{uid}
      const memberRef = doc(db, "participants", tripId, "users", user.uid);
      await setDoc(
        memberRef,
        {
          user_id: user.uid,
          display_name: user.displayName || user.email || "Traveler",
          photo_url: user.photoURL || null,
          role: "traveler",
          status: "approved",
          joined_at: Date.now(),
        },
        { merge: true }
      );
      setMsg(`Joined "${t.data().title}". You can open the trip now.`);
    } catch (e: unknown) {
      const error = e as { message?: string };
      setMsg(error?.message || "Failed to join trip.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">Join a Trip</h1>
      <p className="text-slate-600 mt-1">
        Enter the 6-character TripCode shared by the organizer.
      </p>

      <div className="mt-5 flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. AB23CD"
          className="flex-1 border rounded-lg px-3 py-2 uppercase tracking-widest"
        />
        <button
          onClick={join}
          disabled={busy}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
        >
          {busy ? "Joining…" : "Join"}
        </button>
      </div>

      {msg && (
        <div className="mt-3 text-sm text-slate-800 rounded border bg-white p-3">
          {msg}
        </div>
      )}

      <div className="mt-6 text-sm text-slate-600">
        Don&apos;t have a code?{" "}
        <Link href="/explore" className="underline">
          Explore public trips
        </Link>
        .
      </div>
    </main>
  );
}
