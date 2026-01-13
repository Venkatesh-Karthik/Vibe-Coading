"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Map } from "lucide-react";
import TripCard from "../../components/trip/TripCard";
import Footer from "../../components/Footer";
import { getPublicTrips, getTripMemberCount } from "../../lib/trips";
import type { Trip } from "@/types/database";

type TripWithCount = Trip & { member_count: number };

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "upcoming">("recent");
  const [trips, setTrips] = useState<TripWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch public trips
  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      try {
        const { data } = await getPublicTrips();
        
        // Fetch member counts for all trips
        const tripsWithCounts = await Promise.all(
          data.map(async (trip) => {
            const memberCount = await getTripMemberCount(trip.id);
            return {
              ...trip,
              member_count: memberCount,
            };
          })
        );
        
        setTrips(tripsWithCounts);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    let filtered = trips;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (trip) =>
          trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.destination?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "upcoming") {
      filtered.sort((a, b) => {
        const dateA = a.start_date ? new Date(a.start_date).getTime() : Infinity;
        const dateB = b.start_date ? new Date(b.start_date).getTime() : Infinity;
        return dateA - dateB;
      });
    }

    return filtered;
  }, [trips, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel p-8">
          <div className="animate-pulse text-slate-600">Loading trips...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore{" "}
              <span className="gradient-text">Trips</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover amazing trips curated by fellow travelers. Find your next adventure!
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="glass-panel p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search trips or destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="recent">Recent</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-slate-600">
            Showing <span className="font-semibold">{filteredTrips.length}</span> {filteredTrips.length === 1 ? 'trip' : 'trips'}
          </div>

          {/* Trips Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map((trip, index) => (
                <TripCard 
                  key={trip.id} 
                  trip={trip} 
                  memberCount={trip.member_count}
                  delay={index * 0.1} 
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-12 text-center"
            >
              <Map className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-2">
                {searchQuery ? "No trips found matching your search" : "No public trips available yet"}
              </p>
              <p className="text-slate-500 text-sm mb-6">
                {searchQuery 
                  ? "Try adjusting your search criteria"
                  : "Be the first to share your trip with the community!"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="btn-secondary"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

  );
}
