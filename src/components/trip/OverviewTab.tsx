"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CloudRain, Sun, Thermometer } from "lucide-react";
import type { Trip } from "@/types/database";
import { getTripDuration } from "@/lib/trips";

interface OverviewTabProps {
  trip: Trip;
  memberCount?: number;
}

export default function OverviewTab({ trip, memberCount = 1 }: OverviewTabProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const status = trip.status || 'planning';

  // Calculate time remaining or time since
  useEffect(() => {
    if (!trip.start_date || !trip.end_date) {
      setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const calculateTime = () => {
      const now = new Date();
      const startDate = new Date(trip.start_date!);
      const endDate = new Date(trip.end_date!);

      let targetDate: Date;
      if (status === "planning") {
        targetDate = startDate;
      } else if (status === "active") {
        targetDate = endDate;
      } else {
        // Completed - show 0
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [trip.start_date, trip.end_date, status]);

  // Mock weather data (can be replaced with real API later)
  const mockWeather = {
    temp: 28,
    condition: "Sunny",
    high: 32,
    low: 24,
  };

  const getCountdownLabel = () => {
    if (status === "planning") return "Time until departure";
    if (status === "active") return "Time remaining";
    return "Trip completed";
  };

  const days = getTripDuration(trip.start_date, trip.end_date);

  return (
    <div className="space-y-6">
      {/* Trip Description */}
      {trip.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <h2 className="text-xl font-semibold mb-3 text-slate-900">About This Trip</h2>
          <p className="text-slate-600 leading-relaxed">{trip.description}</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Countdown Timer */}
        {trip.start_date && trip.end_date && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Clock className="h-5 w-5 text-sky-500" />
              {getCountdownLabel()}
            </h2>

            {status === "completed" ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-slate-600">
                  This trip was completed on {new Date(trip.end_date).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Days", value: timeRemaining.days },
                  { label: "Hours", value: timeRemaining.hours },
                  { label: "Minutes", value: timeRemaining.minutes },
                  { label: "Seconds", value: timeRemaining.seconds },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="bg-white/60 rounded-xl p-3 mb-2">
                      <div className="text-2xl md:text-3xl font-bold gradient-text">
                        {item.value.toString().padStart(2, "0")}
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{item.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Weather Widget */}
        {trip.destination && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <CloudRain className="h-5 w-5 text-sky-500" />
              Weather at Destination
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-12 w-12 text-amber-500" />
                  <div className="text-5xl font-bold text-slate-900">{mockWeather.temp}°</div>
                </div>
                <div className="text-lg text-slate-700 font-medium mb-1">{mockWeather.condition}</div>
                <div className="text-sm text-slate-500">{trip.destination}</div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-slate-600">High: {mockWeather.high}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-slate-600">Low: {mockWeather.low}°C</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass-panel p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{memberCount}</div>
          <div className="text-sm text-slate-600">{memberCount === 1 ? 'Traveler' : 'Travelers'}</div>
        </div>
        <div className="glass-panel p-4 text-center">
          <div className="text-2xl font-bold gradient-text">
            {days > 0 ? days : 'TBD'}
          </div>
          <div className="text-sm text-slate-600">Days</div>
        </div>
        <div className="glass-panel p-4 text-center">
          <div className="text-2xl font-bold gradient-text">
            {trip.budget ? `₹${trip.budget.toLocaleString()}` : 'TBD'}
          </div>
          <div className="text-sm text-slate-600">Budget</div>
        </div>
        <div className="glass-panel p-4 text-center">
          <div className="text-2xl font-bold gradient-text">-</div>
          <div className="text-sm text-slate-600">Activities</div>
        </div>
      </motion.div>
    </div>
  );
}
