"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Calendar, TrendingUp, Edit } from "lucide-react";
import Footer from "../../components/Footer";
import { useAuth } from "../../lib/auth-context";

type TabType = "joined" | "created" | "wishlist";

export default function ProfilePage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("joined");

  // Mock user stats
  const userStats = {
    countriesVisited: 8,
    citiesExplored: 24,
    totalTrips: 12,
    daysTraveled: 156,
    memberSince: "January 2023",
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
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          <p className="text-slate-600 mb-6">
            Login to view your profile and travel stats.
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
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/40">
                  {user.user_metadata?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.name || user.email || "User"}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sky-200 to-emerald-200 flex items-center justify-center text-4xl font-bold text-slate-700">
                      {(user.user_metadata?.name || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {user.user_metadata?.name || user.email || "Traveler"}
                  </h1>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg hover:bg-white/50 transition"
                  >
                    <Edit className="h-4 w-4 text-slate-600" />
                  </motion.button>
                </div>
                <p className="text-slate-600 mb-1">{user.email}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500 justify-center md:justify-start">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {userStats.memberSince}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Travel Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-1">
                {userStats.countriesVisited}
              </div>
              <div className="text-sm text-slate-600 flex items-center justify-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Countries
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6 text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-1">
                {userStats.citiesExplored}
              </div>
              <div className="text-sm text-slate-600 flex items-center justify-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                Cities
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-6 text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-1">
                {userStats.totalTrips}
              </div>
              <div className="text-sm text-slate-600 flex items-center justify-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Total Trips
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-6 text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-1">
                {userStats.daysTraveled}
              </div>
              <div className="text-sm text-slate-600">Days Traveled</div>
            </motion.div>
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-2 inline-flex rounded-2xl mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("joined")}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "joined"
                  ? "bg-white/70 text-slate-900 shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Trips Joined
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("created")}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "created"
                  ? "bg-white/70 text-slate-900 shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Trips Created
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("wishlist")}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "wishlist"
                  ? "bg-white/70 text-slate-900 shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Wishlist
            </motion.button>
          </motion.div>

          {/* Placeholder for trips - Profile trip management is under development */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-panel p-12 text-center"
          >
            <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Trip Management Coming Soon
            </h3>
            <p className="text-slate-600 mb-6">
              View and manage your trips from the{" "}
              <a href="/organizer" className="text-sky-600 hover:text-sky-700 font-medium">
                Organizer Dashboard
              </a>
              .
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
