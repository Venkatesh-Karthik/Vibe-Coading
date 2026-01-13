"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Clock, DollarSign, MapPin, Utensils, Camera, Car, Hotel, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { getTripById } from "@/lib/trips";
import type { Trip, ItineraryDay, Activity } from "@/types/database";

type DayWithActivities = ItineraryDay & {
  activities: Activity[];
};

const categoryIcons = {
  food: Utensils,
  sightseeing: Camera,
  transport: Car,
  hotel: Hotel,
  activity: MapPin,
};

const categoryColors = {
  food: "from-orange-400 to-orange-500",
  sightseeing: "from-purple-400 to-purple-500",
  transport: "from-blue-400 to-blue-500",
  hotel: "from-emerald-400 to-emerald-500",
  activity: "from-pink-400 to-pink-500",
};

export default function ItineraryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tripId = params?.id;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<DayWithActivities[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    async function fetchData() {
      if (!tripId) return;

      setLoading(true);
      try {
        // Fetch trip data
        const { data: tripData, error: tripError } = await getTripById(tripId);
        if (tripError || !tripData) {
          console.error("Error fetching trip:", tripError);
          setTrip(null);
          setLoading(false);
          return;
        }
        setTrip(tripData);

        // Fetch itinerary days with activities
        const { data: daysData, error: daysError } = await supabase
          .from("itinerary_days")
          .select(`
            *,
            activities (*)
          `)
          .eq("trip_id", tripId)
          .order("day_number", { ascending: true });

        if (daysError) {
          console.error("Error fetching itinerary days:", daysError);
          setDays([]);
        } else {
          // Type cast is safe here because we're selecting with a join
          setDays((daysData || []) as DayWithActivities[]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tripId]);

  const totalDays = trip?.start_date && trip?.end_date
    ? Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 5;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-sky-500" />
            <span className="text-slate-600">Loading itinerary...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel p-8 text-center">
          <p className="text-slate-600 mb-4">Trip not found</p>
          <button onClick={() => router.push("/explore")} className="btn-secondary">
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  // Group activities by day number
  const activitiesByDay: Record<number, Activity[]> = {};
  days.forEach((day) => {
    activitiesByDay[day.day_number] = day.activities || [];
  });

  // Calculate total activities and cost
  const allActivities = days.flatMap((d) => d.activities || []);
  const totalCost = allActivities.reduce((sum, a) => sum + (a.cost || 0), 0);

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="gradient-text">Itinerary</span>
                </h1>
                <p className="text-slate-600">Plan your day-by-day adventure</p>
              </div>
              <div className="flex gap-3">
                <Link href={`/trip/${tripId}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary text-sm"
                  >
                    Back to Trip
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-sm"
                >
                  Export PDF
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Day Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 overflow-x-auto"
          >
            <div className="glass-panel p-2 inline-flex gap-2 min-w-full md:min-w-0">
              {Array.from({ length: totalDays }).map((_, index) => {
                const day = index + 1;
                const dayActivities = activitiesByDay[day] || [];
                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDay(day)}
                    className={`px-6 py-3 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                      selectedDay === day
                        ? "bg-white/70 text-slate-900 shadow"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div>Day {day}</div>
                    {dayActivities.length > 0 && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {dayActivities.length} activities
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Activities Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Add Activity Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full glass-panel p-6 flex items-center justify-center gap-3 hover:bg-white/60 transition"
            >
              <Plus className="h-5 w-5 text-sky-500" />
              <span className="font-medium text-slate-700">Add Activity for Day {selectedDay}</span>
            </motion.button>

            {/* Activities List */}
            {activitiesByDay[selectedDay] && activitiesByDay[selectedDay].length > 0 ? (
              <div className="space-y-4">
                {activitiesByDay[selectedDay].map((activity, index) => {
                  // Use default 'activity' category - in future could be enhanced with category detection
                  const category: keyof typeof categoryIcons = 'activity';
                  const Icon = categoryIcons[category];
                  const colorClass = categoryColors[category];
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="glass-panel p-6 hover:shadow-lg transition"
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                {activity.title}
                              </h3>
                              {activity.location && (
                                <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{activity.location}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              {activity.cost !== null && (
                                <div className="text-sm font-semibold text-slate-900">
                                  ₹{activity.cost}
                                </div>
                              )}
                            </div>
                          </div>

                          {activity.time && (
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{activity.time}</span>
                              </div>
                            </div>
                          )}

                          {activity.notes && (
                            <p className="text-sm text-slate-600 bg-white/40 rounded-lg p-3">
                              {activity.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-panel p-12 text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 text-lg mb-2">No activities planned for Day {selectedDay}</p>
                <p className="text-slate-500 text-sm mb-4">
                  Add activities to build your perfect itinerary
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Add First Activity
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{allActivities.length}</div>
              <div className="text-sm text-slate-600">Total Activities</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold gradient-text">
                ₹{totalCost.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">Total Cost</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{totalDays}</div>
              <div className="text-sm text-slate-600">Days</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold gradient-text">
                {days.length}
              </div>
              <div className="text-sm text-slate-600">Planned Days</div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
