"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import TripCard from "../../components/trip/TripCard";
import Footer from "../../components/Footer";
import { mockTrips, TripType } from "../../utils/mockData";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<TripType[]>([]);
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "upcoming">("recent");
  const [showFilters, setShowFilters] = useState(false);

  const tripTypes: TripType[] = ["Adventure", "Family", "Solo", "Group", "Romantic", "Luxury"];

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    let filtered = mockTrips.filter((trip) => trip.isPublic);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (trip) =>
          trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((trip) =>
        trip.type.some((t) => selectedTypes.includes(t))
      );
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    } else if (sortBy === "upcoming") {
      filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }
    // popular would need a popularity metric

    return filtered;
  }, [searchQuery, selectedTypes, sortBy]);

  const toggleType = (type: TripType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

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
                  <option value="popular">Popular</option>
                  <option value="upcoming">Upcoming</option>
                </select>

                {/* Toggle Filters */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/40 bg-white/50 hover:bg-white/70 transition"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  <span className="hidden sm:inline">Filters</span>
                  {selectedTypes.length > 0 && (
                    <span className="bg-sky-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedTypes.length}
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-white/40"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2 mr-2">
                      <Filter className="h-4 w-4" />
                      Trip Type:
                    </span>
                    {tripTypes.map((type) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleType(type)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          selectedTypes.includes(type)
                            ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white"
                            : "bg-white/60 text-slate-700 hover:bg-white/80"
                        }`}
                      >
                        {type}
                      </motion.button>
                    ))}
                    {selectedTypes.length > 0 && (
                      <button
                        onClick={() => setSelectedTypes([])}
                        className="ml-2 text-sm text-slate-500 hover:text-slate-700 underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-slate-600">
            Showing <span className="font-semibold">{filteredTrips.length}</span> trips
          </div>

          {/* Trips Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} delay={index * 0.1} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-12 text-center"
            >
              <p className="text-slate-600 text-lg mb-4">No trips found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTypes([]);
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
