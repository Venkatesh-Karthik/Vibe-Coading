"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Calendar, Users, DollarSign, Map } from "lucide-react";
import TripCard from "../../components/trip/TripCard";
import Footer from "../../components/Footer";
import { mockTrips, getTripsByStatus } from "../../utils/mockData";
import { useAuth } from "../../lib/auth-context";

type FilterStatus = "all" | "planning" | "active" | "completed";

export default function OrganizerPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const [filter, setFilter] = useState<FilterStatus>("all");

  // In real app, filter by user's created trips
  const allTrips = mockTrips;
  
  const filteredTrips = filter === "all" 
    ? allTrips 
    : getTripsByStatus(filter);

  const stats = {
    totalTrips: allTrips.length,
    totalTravelers: allTrips.reduce((sum, t) => sum + t.travelers, 0),
    totalSpend: allTrips.reduce((sum, t) => sum + t.budget, 0),
    planningTrips: getTripsByStatus("planning").length,
    activeTrips: getTripsByStatus("active").length,
    completedTrips: getTripsByStatus("completed").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel p-8">
          <div className="animate-pulse text-slate-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 max-w-md text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Organizer Dashboard</h2>
          <p className="text-slate-600 mb-6">
            Login to access your organizer dashboard and manage your trips.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={loginWithGoogle}
            className="btn-primary"
          >
            Login with Google
          </motion.button>
        </motion.div>
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
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="gradient-text">My Trips</span>
              </h1>
              <p className="text-slate-600">
                Manage and organize your travel adventures
              </p>
            </div>
            <Link href="/organizer/new">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create New Trip
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-sky-100">
                  <Map className="h-6 w-6 text-sky-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {stats.totalTrips}
              </div>
              <div className="text-sm text-slate-600">Total Trips</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-emerald-100">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {stats.totalTravelers}
              </div>
              <div className="text-sm text-slate-600">Total Travelers</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-purple-100">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                ₹{(stats.totalSpend / 1000).toFixed(0)}k
              </div>
              <div className="text-sm text-slate-600">Total Budget</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-amber-100">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {stats.activeTrips}
              </div>
              <div className="text-sm text-slate-600">Active Trips</div>
            </motion.div>
          </div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-2 inline-flex rounded-2xl mb-8"
          >
            {(["all", "planning", "active", "completed"] as FilterStatus[]).map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                  filter === status
                    ? "bg-white/70 text-slate-900 shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && (
                  <span className="ml-2 text-xs">
                    ({status === "planning" && stats.planningTrips}
                    {status === "active" && stats.activeTrips}
                    {status === "completed" && stats.completedTrips})
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Trips Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} delay={0.6 + index * 0.1} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-12 text-center"
            >
              <p className="text-slate-600 text-lg mb-4">No trips found</p>
              <Link href="/organizer/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                >
                  Create Your First Trip
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
