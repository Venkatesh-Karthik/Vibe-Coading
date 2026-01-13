"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  CloudRain,
  Loader2,
} from "lucide-react";
import { getTripById } from "@/lib/trips";
import { getWeatherByCity, getWeatherIconUrl, type WeatherData } from "@/lib/weather";
import type { Trip } from "@/types/database";
import Footer from "@/components/Footer";

export default function DestinationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tripId = params.id;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!tripId) return;

      setLoading(true);
      try {
        const { data, error } = await getTripById(tripId);

        if (error || !data) {
          console.error("Error fetching trip:", error);
          setTrip(null);
        } else {
          const tripData: Trip = data;
          setTrip(tripData);

          // Fetch weather data if destination exists
          if (tripData.destination) {
            setWeatherLoading(true);
            const weatherData = await getWeatherByCity(tripData.destination);
            setWeather(weatherData);
            setWeatherLoading(false);
          }
        }
      } catch (err) {
        console.error("Error loading trip:", err);
        setTrip(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-sky-500" />
            <span className="text-slate-600">Loading destination...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!trip || !trip.destination) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel p-8 text-center">
          <p className="text-slate-600 mb-4">Destination information not available</p>
          <button onClick={() => router.back()} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getWeatherIcon = (condition: string) => {
    const icons: Record<string, any> = {
      Clear: Sun,
      Clouds: Cloud,
      Rain: CloudRain,
      Drizzle: CloudRain,
      Thunderstorm: CloudRain,
      Snow: Cloud,
      Mist: Cloud,
      Smoke: Cloud,
      Haze: Cloud,
      Dust: Cloud,
      Fog: Cloud,
      Sand: Cloud,
      Ash: Cloud,
      Squall: Wind,
      Tornado: Wind,
    };
    return icons[condition] || Cloud;
  };

  const WeatherIcon = weather ? getWeatherIcon(weather.condition) : Cloud;

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Trip</span>
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-8 w-8 text-sky-500" />
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="gradient-text">{trip.destination}</span>
              </h1>
            </div>
            <p className="text-slate-600">
              Destination information for {trip.title}
            </p>
          </motion.div>

          {/* Weather Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Cloud className="h-5 w-5 text-sky-500" />
              Current Weather
            </h2>

            {weatherLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              </div>
            ) : weather ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Main Weather Info */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <WeatherIcon className="h-24 w-24 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-slate-900 mb-2">
                      {weather.temp}°C
                    </div>
                    <div className="text-xl text-slate-700 font-medium capitalize mb-1">
                      {weather.condition}
                    </div>
                    <div className="text-sm text-slate-600 capitalize">
                      {weather.description}
                    </div>
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/40 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-slate-600">High</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {weather.high}°C
                    </div>
                  </div>

                  <div className="bg-white/40 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-slate-600">Low</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {weather.low}°C
                    </div>
                  </div>

                  <div className="bg-white/40 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-slate-600">Humidity</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {weather.humidity}%
                    </div>
                  </div>

                  <div className="bg-white/40 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Wind</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {weather.windSpeed} km/h
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Cloud className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 mb-2">
                  Weather information unavailable
                </p>
                <p className="text-sm text-slate-500">
                  Configure OpenWeather API key to enable weather features
                </p>
              </div>
            )}
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <MapPin className="h-5 w-5 text-sky-500" />
              Location
            </h2>

            <div className="relative w-full h-96 bg-slate-200 rounded-xl overflow-hidden">
              {/* Embedded Google Maps */}
              <iframe
                title="Destination Map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=${
                  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
                }&q=${encodeURIComponent(trip.destination)}`}
                allowFullScreen
              />
            </div>

            {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Configure Google Maps API key to display the map
                </p>
              </div>
            )}
          </motion.div>

          {/* Local Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-slate-900">
              About {trip.destination}
            </h2>

            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed">
                {trip.description || `${trip.destination} is an amazing destination with rich culture, beautiful landscapes, and unforgettable experiences waiting for you. Start planning your activities and make the most of your visit!`}
              </p>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-white/40 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Getting Around</h3>
                  <p className="text-sm text-slate-600">
                    Research local transportation options before you arrive. Consider public transit, ride-sharing, or rental vehicles based on your itinerary.
                  </p>
                </div>

                <div className="bg-white/40 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Local Tips</h3>
                  <p className="text-sm text-slate-600">
                    Check local customs, language basics, and currency exchange rates. Planning ahead will help you have a smoother experience.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
