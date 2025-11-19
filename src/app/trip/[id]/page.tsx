"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import dynamic from "next/dynamic";
const Expenses = dynamic(() => import("@/components/Expenses"), { ssr: false });
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import {
    GoogleMap,
    Marker,
    Polyline,
    useJsApiLoader,
} from "@react-google-maps/api";

type TripDoc = {
    title: string;
    city?: string;
    cover?: string | null;
    start_date?: string;
    end_date?: string;
};

type Item = {
    id: string;
    title: string;
    day_index?: number;
    lat: number;
    lng: number;
    address?: string;
    notes?: string;
    start_time?: string;
    end_time?: string;
};

const MAP_H = 360;

export default function TripPage() {
    const params = useParams<{ id: string }>();
    const tripId = params.id;

    const [trip, setTrip] = useState<TripDoc | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    // Load Google Maps JS
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
    });

    // Firestore listeners: trip doc + itinerary items
    useEffect(() => {
        const unsubTrip = onSnapshot(doc(db, "trips", tripId), (snap) => {
            setTrip((snap.exists() ? (snap.data() as TripDoc) : null));
        });

        const q = query(
            collection(db, "trip_items", tripId, "items"),
            orderBy("day_index", "asc")
        );
        const unsubItems = onSnapshot(
            q,
            (snap) => {
                setItems(
                    snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Item[]
                );
                setLoading(false);
            },
            () => setLoading(false)
        );

        return () => {
            unsubTrip();
            unsubItems();
        };
    }, [tripId]);

    // Map path (ordered by day_index then insertion)
    const path = useMemo(
        () =>
            items
                .filter((i) => typeof i.lat === "number" && typeof i.lng === "number")
                .map((i) => ({ lat: i.lat, lng: i.lng })),
        [items]
    );

    const center = path[0] ?? { lat: 20.5937, lng: 78.9629 }; // India fallback

    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        {trip?.title ?? "Trip"}
                    </h1>
                    <p className="text-slate-600">
                        {trip?.city ?? "—"}{" "}
                        {trip?.start_date && trip?.end_date
                            ? `• ${trip.start_date} → ${trip.end_date}`
                            : ""}
                    </p>
                </div>
                <Link
                    href="/explore"
                    className="text-sm underline"
                >
                    Back to Explore
                </Link>
            </div>

            {/* Map + Day list */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white shadow p-4">
                    <h3 className="font-semibold mb-2">Itinerary Map</h3>
                    <div
                        className="w-full rounded-xl overflow-hidden border"
                        style={{ height: MAP_H }}
                    >
                        {isLoaded ? (
                            <GoogleMap
                                mapContainerStyle={{ width: "100%", height: "100%" }}
                                center={center}
                                zoom={path.length ? 12 : 5}
                            >
                                {path.map((p, i) => (
                                    <Marker key={i} position={p} label={`${i + 1}`} />
                                ))}
                                {path.length >= 2 && (
                                    <Polyline path={path} options={{ strokeOpacity: 0.9 }} />
                                )}
                            </GoogleMap>
                        ) : (
                            <div className="h-full grid place-items-center text-slate-500">
                                Loading map…
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl bg-white shadow p-4">
                    <h3 className="font-semibold mb-3">Day Plan</h3>

                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-12 rounded-lg bg-slate-100 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <p className="text-slate-600">
                            No itinerary items yet. Ask the organizer to add places from the
                            Organizer dashboard.
                        </p>
                    ) : (
                        <ol className="space-y-3">
                            {items.map((it, i) => (
                                <li
                                    key={it.id}
                                    className="p-3 rounded-lg border hover:bg-slate-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">
                                            {i + 1}. {it.title ?? "Untitled place"}
                                        </div>
                                        {it.day_index != null && (
                                            <span className="text-xs text-slate-600">
                                                Day {it.day_index}
                                            </span>
                                        )}
                                    </div>
                                    {it.address && (
                                        <div className="text-xs text-slate-600">
                                            {it.address}
                                        </div>
                                    )}
                                    {(it.start_time || it.end_time) && (
                                        <div className="text-xs text-slate-500 mt-1">
                                            {it.start_time ?? "—"} – {it.end_time ?? "—"}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>

            {/* Cover preview + metadata */}
            {trip?.cover && (
                <div className="mt-6 rounded-2xl overflow-hidden shadow">
                    <img
                        src={trip.cover}
                        alt="Trip cover"
                        className="w-full max-h-[360px] object-cover"
                    />
                </div>
            )}

            {/* Expenses Tracker */}
            <div className="mt-6">
                <Expenses tripId={tripId} />
            </div>

        </main>
    );
}
