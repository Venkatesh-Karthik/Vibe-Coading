"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CloudRain, Sun, Thermometer, Loader2, Cloud } from "lucide-react";
import type { Trip } from "@/types/database";
import { getTripDuration } from "@/lib/trips";
import { getWeatherByCity, getWeatherIconUrl, type WeatherData } from "@/lib/weather";
import { useCountdown } from "@/hooks/useCountdown";
import { getTripActivityCount } from "@/lib/activities";
import NextActivityWidget from "./NextActivityWidget";

interface OverviewTabProps {
  trip: Trip;
  memberCount?: number;
}

export default function OverviewTab({ trip, memberCount = 1 }: OverviewTabProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(false);
  const [activityCount, setActivityCount] = useState<number | null>(null);

  const status = trip.status || 'planning';

  // Determine countdown target based on trip status
  const countdownTarget = status === 'planning' 
    ? trip.start_date 
    : status === 'active' 
      ? trip.end_date 
      : null;

  // Use the countdown hook
  const timeRemaining = useCountdown(countdownTarget);

  // Fetch weather data for destination
  useEffect(() => {
    async function fetchWeather() {
      if (!trip.destination) {
        setWeather(null);
        return;
      }

      setWeatherLoading(true);
      setWeatherError(false);
      
      try {
        const weatherData = await getWeatherByCity(trip.destination);
        setWeather(weatherData);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setWeather(null);
        setWeatherError(true);
      } finally {
        setWeatherLoading(false);
      }
    }

    fetchWeather();
    
    // Refresh weather data every 10 minutes
    const refreshInterval = setInterval(fetchWeather, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [trip.destination]);

  // Fetch activity count
  useEffect(() => {
    async function fetchActivityCount() {
      const count = await getTripActivityCount(trip.id);
      setActivityCount(count);
    }

    fetchActivityCount();
  }, [trip.id]);

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
            ) : timeRemaining.isComplete ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">⏰</div>
                <p className="text-slate-600">
                  {status === "planning" ? "Trip starting soon!" : "No countdown available"}
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

            {weatherLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              </div>
            ) : weather ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {weather.icon ? (
                      <img 
                        src={getWeatherIconUrl(weather.icon)} 
                        alt={weather.condition}
                        className="h-12 w-12"
                      />
                    ) : (
                      <Sun className="h-12 w-12 text-amber-500" />
                    )}
                    <div className="text-5xl font-bold text-slate-900">{weather.temp}°</div>
                  </div>
                  <div className="text-lg text-slate-700 font-medium mb-1 capitalize">
                    {weather.condition}
                  </div>
                  <div className="text-sm text-slate-500">{weather.cityName || trip.destination}</div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-slate-600">High: {weather.high}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-slate-600">Low: {weather.low}°C</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Cloud className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-600 text-sm mb-1">
                  {weatherError ? "Unable to load weather data" : "Weather information unavailable"}
                </p>
                <p className="text-xs text-slate-500">
                  {!weatherError && "Configure OpenWeather API key to enable weather features"}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Next Planned Activity Widget */}
        <NextActivityWidget trip={trip} />
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
          <div className="text-2xl font-bold gradient-text">
            {activityCount !== null ? activityCount : '-'}
          </div>
          <div className="text-sm text-slate-600">Activities</div>
        </div>
      </motion.div>
    </div>
  );
}
