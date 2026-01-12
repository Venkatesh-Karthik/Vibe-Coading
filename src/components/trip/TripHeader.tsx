"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { MockTrip } from "@/utils/mockData";
import { getDaysDiff, formatDate } from "@/utils/tripHelpers";

interface TripHeaderProps {
  trip: MockTrip;
}

export default function TripHeader({ trip }: TripHeaderProps) {
  const statusColors = {
    planning: "text-amber-600 bg-amber-100",
    active: "text-emerald-600 bg-emerald-100",
    completed: "text-sky-600 bg-sky-100",
  };

  const days = getDaysDiff(trip.startDate, trip.endDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel p-6 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              {trip.name}
            </h1>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[trip.status]}`}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{trip.destination}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({days} days)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span className="text-sm">{trip.travelers} travelers</span>
            </div>
          </div>
        </div>

        {/* Trip Code */}
        {trip.tripCode && (
          <div className="text-center md:text-right">
            <div className="text-xs text-slate-500 mb-1">Trip Code</div>
            <div className="text-lg font-mono font-bold text-slate-900 bg-white/60 px-4 py-2 rounded-lg">
              {trip.tripCode}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
