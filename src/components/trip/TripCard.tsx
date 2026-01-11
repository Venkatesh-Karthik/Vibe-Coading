"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { MockTrip } from "@/utils/mockData";

interface TripCardProps {
  trip: MockTrip;
  delay?: number;
}

export default function TripCard({ trip, delay = 0 }: TripCardProps) {
  const statusColors = {
    planning: "text-amber-600 bg-amber-100",
    active: "text-emerald-600 bg-emerald-100",
    completed: "text-sky-600 bg-sky-100",
  };

  const getDaysDiff = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const days = getDaysDiff(trip.startDate, trip.endDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="glass-panel overflow-hidden group cursor-pointer"
    >
      <Link href={`/trip/${trip.id}`}>
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
          {trip.coverImage && (
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-purple-400/20" />
          )}
          {/* Status Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[trip.status]}`}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:gradient-text transition-all">
            {trip.name}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span>{trip.destination}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{days} days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{trip.travelers} travelers</span>
            </div>
          </div>

          {/* Trip Types */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {trip.type.slice(0, 2).map((type) => (
              <span
                key={type}
                className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-slate-700"
              >
                {type}
              </span>
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 text-center rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-semibold"
          >
            View Trip
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
