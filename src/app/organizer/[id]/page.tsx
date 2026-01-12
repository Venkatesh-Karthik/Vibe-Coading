"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import {
  useJsApiLoader,
  Autocomplete,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Item = {
  id: string;
  title: string;
  day_id: string;
  day_number: number;
  lat: number | null;
  lng: number | null;
  location?: string;
  order_index?: number;
};

function SortableItem({
  item,
  onDelete,
}: {
  item: Item;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 rounded-lg border bg-white hover:bg-slate-50 flex items-start justify-between gap-3"
    >
      <div>
        <div className="font-medium">{item.title}</div>
        <div className="text-xs text-slate-600">
          Day {item.day_number} • {item.location ?? (item.lat && item.lng ? `${item.lat}, ${item.lng}` : 'No location')}
        </div>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="text-xs px-2 py-1 rounded bg-red-600 text-white"
      >
        Delete
      </button>
    </li>
  );
}

export default function OrganizerEditorPage() {
  const params = useParams<{ id: string }>();
  const tripId = params.id;

  // Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // List items
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Load activities from Supabase
  useEffect(() => {
    loadActivities();
    
    // Set up real-time subscription
    const channel = supabase
      .channel(`trip-${tripId}-activities`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities',
          filter: `day_id=in.(select id from itinerary_days where trip_id=eq.${tripId})`
        },
        () => {
          loadActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId]);

  async function loadActivities() {
    try {
      // Get itinerary days for this trip
      const { data: days, error: daysError } = await supabase
        .from('itinerary_days')
        .select('*')
        .eq('trip_id', tripId)
        .order('day_number', { ascending: true });

      if (daysError) {
        console.error('Error loading itinerary days:', daysError);
        setLoading(false);
        return;
      }

      if (!days || days.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      // Get activities for all days
      const dayIds = days.map(d => d.id);
      const { data: activities, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .in('day_id', dayIds)
        .order('created_at', { ascending: true });

      if (activitiesError) {
        console.error('Error loading activities:', activitiesError);
        setLoading(false);
        return;
      }

      // Map activities to items format
      const mappedItems: Item[] = (activities || []).map((activity, idx) => {
        const day = days.find(d => d.id === activity.day_id);
        return {
          id: activity.id,
          title: activity.title,
          day_id: activity.day_id!,
          day_number: day?.day_number || 1,
          lat: activity.lat,
          lng: activity.lng,
          location: activity.location,
          order_index: idx,
        };
      });

      setItems(mappedItems);
      setLoading(false);
    } catch (error) {
      console.error('Error loading activities:', error);
      setLoading(false);
    }
  }

  // Add via Places Autocomplete
  const [day, setDay] = useState<number>(1);
  const [auto, setAuto] = useState<google.maps.places.Autocomplete | null>(null);
  const [adding, setAdding] = useState(false);

  async function addPlace() {
    if (!auto) return;
    const p = auto.getPlace();
    const loc = p.geometry?.location;
    if (!loc || !p.name) return;

    setAdding(true);
    try {
      // Get or create itinerary day for this day number
      let { data: existingDay, error: dayError } = await supabase
        .from('itinerary_days')
        .select('*')
        .eq('trip_id', tripId)
        .eq('day_number', day)
        .single();

      if (dayError && dayError.code !== 'PGRST116') {
        console.error('Error checking itinerary day:', dayError);
        return;
      }

      if (!existingDay) {
        const { data: newDay, error: createError } = await supabase
          .from('itinerary_days')
          .insert({
            trip_id: tripId,
            day_number: day,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating itinerary day:', createError);
          return;
        }
        existingDay = newDay;
      }

      // Add activity
      const { error: activityError } = await supabase
        .from('activities')
        .insert({
          day_id: existingDay.id,
          title: p.name,
          location: p.formatted_address ?? null,
          lat: loc.lat(),
          lng: loc.lng(),
        });

      if (activityError) {
        console.error('Error creating activity:', activityError);
      }
    } finally {
      setAdding(false);
    }
  }

  // Drag to reorder (within the same day list)
  const sensors = useSensors(useSensor(PointerSensor));
  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    // Reorder in local state
    const activeId = String(active.id);
    const overId = String(over.id);
    const oldIndex = items.findIndex((i) => i.id === activeId);
    const newIndex = items.findIndex((i) => i.id === overId);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Note: For proper persistence, you'd need to add an order_index column
    // to the activities table and update it here
  }

  // Delete
  async function removeItem(id: string) {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting activity:', error);
    }
  }

  // Map path
  const path = useMemo(
    () =>
      items
        .filter((i) => typeof i.lat === "number" && typeof i.lng === "number")
        .map((i) => ({ lat: i.lat!, lng: i.lng! })),
    [items]
  );
  const center = path[0] ?? { lat: 20.5937, lng: 78.9629 };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Organizer • Edit Itinerary</h1>
        <Link href={`/trip/${tripId}`} className="text-sm underline">
          View Trip
        </Link>
      </div>

      {/* Add place */}
      <section className="mt-6 rounded-2xl bg-white p-4 shadow">
        <h3 className="font-semibold mb-3">Add Place</h3>
        {isLoaded ? (
          <div className="grid md:grid-cols-[1fr,140px,120px] gap-3">
            <Autocomplete onLoad={(a) => setAuto(a)} onPlaceChanged={() => {}}>
              <input
                placeholder="Search a place (Google Places)"
                className="w-full border rounded px-3 py-2"
              />
            </Autocomplete>
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="border rounded px-3 py-2"
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Day {i + 1}
                </option>
              ))}
            </select>
            <button
              onClick={addPlace}
              disabled={adding}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
            >
              {adding ? "Adding…" : "Add to Itinerary"}
            </button>
          </div>
        ) : (
          <div className="text-slate-600">Loading Google Places…</div>
        )}
      </section>

      {/* Map + List */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white shadow p-4">
          <h3 className="font-semibold mb-2">Map Preview</h3>
          <div className="w-full h-[360px] rounded-xl overflow-hidden border">
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
          <h3 className="font-semibold mb-3">Day Plan (drag to reorder)</h3>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-slate-600">
              No items yet — add places above to build the itinerary.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <ol className="space-y-3">
                  {items.map((it) => (
                    <SortableItem key={it.id} item={it} onDelete={removeItem} />
                  ))}
                </ol>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <div className="mt-6 text-sm text-slate-600">
        Tip: open this page and the public <Link className="underline" href={`/trip/${tripId}`}>Trip page</Link> side by side to see real-time updates.
      </div>
    </main>
  );
}
