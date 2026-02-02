"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Coins, Calendar } from "lucide-react";
import { useNextPlannedActivity } from "@/hooks/useNextPlannedActivity";
import type { Trip } from "@/types/database";

interface NextActivityWidgetProps {
  trip: Trip;
}

export default function NextActivityWidget({ trip }: NextActivityWidgetProps) {
  const { activity, loading, error } = useNextPlannedActivity(trip.id, trip.start_date);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
          <Calendar className="h-5 w-5 text-sky-500" />
          Next Planned Activity
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse text-slate-600">Loading activity...</div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    console.error("Error loading next activity:", error);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel p-6"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
        <Calendar className="h-5 w-5 text-sky-500" />
        Next Planned Activity
      </h2>

      {activity ? (
        <div className="space-y-4">
          {/* Activity Title */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">{activity.title}</h3>
            {activity.notes && (
              <p className="text-sm text-slate-600">{activity.notes}</p>
            )}
          </div>

          {/* Activity Details */}
          <div className="space-y-2">
            {activity.location && (
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="h-4 w-4 text-sky-500 flex-shrink-0" />
                <span className="text-sm">{activity.location}</span>
              </div>
            )}

            {activity.time && (
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="h-4 w-4 text-sky-500 flex-shrink-0" />
                <span className="text-sm">
                  {activity.day_number && `Day ${activity.day_number} at `}
                  {activity.time}
                </span>
              </div>
            )}

            {activity.cost !== null && activity.cost !== undefined && activity.cost > 0 && (
              <div className="flex items-center gap-2 text-slate-700">
                <Coins className="h-4 w-4 text-sky-500 flex-shrink-0" />
                <span className="text-sm">₹{activity.cost.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Activity Badge */}
          <div className="pt-2">
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-sky-500 to-blue-500 text-white">
              Coming Up Next
            </span>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="text-center py-8">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-600 mb-2">No upcoming activities</p>
          <p className="text-sm text-slate-500">
            Add activities to your trip planner to see what's coming up next
          </p>
        </div>
      )}
    </motion.div>
  );
}
