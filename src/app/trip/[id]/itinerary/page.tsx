"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus, Clock, DollarSign, MapPin, Utensils, Camera, Car, Hotel } from "lucide-react";
import Footer from "@/components/Footer";
import { mockActivities, getTripById } from "@/utils/mockData";

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
  const tripId = params?.id;
  const trip = tripId ? getTripById(tripId) : null;

  const [activities] = useState(mockActivities);
  const [selectedDay, setSelectedDay] = useState(1);

  // Group activities by day
  const activitiesByDay = activities.reduce((acc, activity) => {
    if (!acc[activity.day]) {
      acc[activity.day] = [];
    }
    acc[activity.day].push(activity);
    return acc;
  }, {} as Record<number, typeof activities>);

  const totalDays = trip 
    ? Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 5;

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel p-8">
          <p className="text-slate-600">Trip not found</p>
        </div>
      </div>
    );
  }

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
                  const Icon = categoryIcons[activity.category];
                  const colorClass = categoryColors[activity.category];
                  
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
                              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                <MapPin className="h-4 w-4" />
                                <span>{activity.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-slate-900">
                                ₹{activity.cost}
                              </div>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-slate-700 capitalize">
                                {activity.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{activity.startTime} - {activity.endTime}</span>
                            </div>
                          </div>

                          {activity.notes && (
                            <p className="text-sm text-slate-600 bg-white/40 rounded-lg p-3">
                              {activity.notes}
                            </p>
                          )}

                          <div className="mt-4 flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white/80 font-medium text-slate-700 transition"
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white/80 font-medium text-slate-700 transition"
                            >
                              View on Map
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 font-medium text-red-600 transition"
                            >
                              Delete
                            </motion.button>
                          </div>
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
              <div className="text-2xl font-bold gradient-text">{activities.length}</div>
              <div className="text-sm text-slate-600">Total Activities</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold gradient-text">
                ₹{activities.reduce((sum, a) => sum + a.cost, 0)}
              </div>
              <div className="text-sm text-slate-600">Total Cost</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{totalDays}</div>
              <div className="text-sm text-slate-600">Days</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold gradient-text">
                {Object.keys(activitiesByDay).length}
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
