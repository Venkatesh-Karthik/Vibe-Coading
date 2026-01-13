"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Share2 } from "lucide-react";
import type { Trip } from "@/types/database";
import { formatDate } from "@/utils/tripHelpers";
import { getTripDuration } from "@/lib/trips";
import ShareTripModal from "./ShareTripModal";

interface TripHeaderProps {
  trip: Trip;
  memberCount?: number;
}

export default function TripHeader({ trip, memberCount = 1 }: TripHeaderProps) {
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const statusColors = {
    planning: "text-amber-600 bg-amber-100",
    active: "text-emerald-600 bg-emerald-100",
    completed: "text-sky-600 bg-sky-100",
  };

  const status = trip.status || 'planning';
  const days = getTripDuration(trip.start_date, trip.end_date);

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
              {trip.title}
            </h1>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            {trip.destination && (
              <button
                onClick={() => router.push(`/trip/${trip.id}/destination`)}
                className="flex items-center gap-1.5 hover:text-sky-600 transition-colors cursor-pointer group"
                title="View destination details"
              >
                <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium group-hover:underline">{trip.destination}</span>
              </button>
            )}
            {trip.start_date && trip.end_date ? (
              <button
                onClick={() => router.push(`/trip/${trip.id}/itinerary`)}
                className="flex items-center gap-1.5 hover:text-sky-600 transition-colors cursor-pointer group"
                title="View full itinerary"
              >
                <Calendar className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm group-hover:underline">
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)} ({days} {days === 1 ? 'day' : 'days'})
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span className="text-sm text-slate-400">Dates TBD</span>
              </div>
            )}
            <button
              onClick={() => router.push(`/trip/${trip.id}/members`)}
              className="flex items-center gap-1.5 hover:text-sky-600 transition-colors cursor-pointer group"
              title="View trip members"
            >
              <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm group-hover:underline">{memberCount} {memberCount === 1 ? 'traveler' : 'travelers'}</span>
            </button>
          </div>
        </div>

        {/* Trip Code */}
        {trip.join_code && (
          <div className="text-center md:text-right">
            <div className="text-xs text-slate-500 mb-1">Trip Code</div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-mono font-bold text-slate-900 bg-white/60 px-4 py-2 rounded-lg">
                {trip.join_code}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareModal(true)}
                className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition"
                title="Share trip"
              >
                <Share2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareTripModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        tripCode={trip.join_code || ''}
        tripTitle={trip.title}
        tripId={trip.id}
      />
    </motion.div>
  );
}
