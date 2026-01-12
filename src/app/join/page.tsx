"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import Footer from "../../components/Footer";
import { mockTrips } from "../../utils/mockData";

export default function JoinByCodePage() {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [previewTrip, setPreviewTrip] = useState<typeof mockTrips[0] | null>(null);
  const [joinSuccess, setJoinSuccess] = useState(false);

  async function searchTrip() {
    setMsg(null);
    setPreviewTrip(null);
    
    const clean = code.trim().toUpperCase();
    if (clean.length < 4) {
      setMsg("Enter a valid TripCode.");
      return;
    }

    setBusy(true);
    try {
      // Try mock data first
      const mockTrip = mockTrips.find(t => t.tripCode === clean);
      if (mockTrip) {
        setPreviewTrip(mockTrip);
        setBusy(false);
        return;
      }

      // Query Supabase for trip with matching join_code
      const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .eq('join_code', clean)
        .limit(1);

      if (error) {
        console.error("Error searching trip:", error);
        setMsg("Failed to search trip. Please try again.");
        return;
      }

      if (!trips || trips.length === 0) {
        setMsg("No trip found for that code.");
        return;
      }
      
      const tripData = trips[0];
      
      // Get trip members count
      const { count } = await supabase
        .from('trip_members')
        .select('*', { count: 'exact', head: true })
        .eq('trip_id', tripData.id);

      setPreviewTrip({
        id: tripData.id,
        name: tripData.title || "Trip",
        destination: tripData.destination || "Unknown",
        startDate: tripData.start_date || "",
        endDate: tripData.end_date || "",
        coverImage: "",
        travelers: (count || 0) + 1, // +1 for organizer
        status: "planning",
        type: [],
        budget: 0,
        organizer: "Organizer",
        organizerId: tripData.organizer_id || "",
        description: "",
        isPublic: true,
        tripCode: clean,
      });
    } catch (e: unknown) {
      const error = e as { message?: string };
      setMsg(error?.message || "Failed to search trip.");
    } finally {
      setBusy(false);
    }
  }

  async function joinTrip() {
    if (!user) {
      setMsg("Please login with Google first (top right).");
      return;
    }
    
    if (!previewTrip) {
      setMsg("No trip selected.");
      return;
    }

    setBusy(true);
    try {
      // First, ensure user profile exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        // Create user profile if it doesn't exist
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email || "Traveler",
            email: user.email,
            photo: user.user_metadata?.avatar_url || null,
          });

        if (userError) {
          console.error("Error creating user profile:", userError);
        }
      }

      // Add user to trip_members
      const { error: memberError } = await supabase
        .from('trip_members')
        .insert({
          trip_id: previewTrip.id,
          user_id: user.id,
          role: 'member',
        });

      if (memberError) {
        if (memberError.code === '23505') {
          // Unique constraint violation - already a member
          setMsg("You are already a member of this trip!");
        } else {
          console.error("Error joining trip:", memberError);
          setMsg("Failed to join trip. Please try again.");
        }
        return;
      }
      
      setJoinSuccess(true);
      setMsg(`Successfully joined "${previewTrip.name}"!`);
    } catch (e: unknown) {
      const error = e as { message?: string };
      setMsg(error?.message || "Failed to join trip.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Join a Trip</span>
            </h1>
            <p className="text-slate-600 text-lg">
              Enter the trip code shared by the organizer to join the adventure
            </p>
          </motion.div>

          {/* Trip Code Input */}
          {!joinSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-8 mb-8"
            >
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Trip Code
              </label>
              <div className="flex gap-3">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. GOA2024"
                  disabled={busy}
                  className="flex-1 px-4 py-3 text-center text-2xl font-bold tracking-widest uppercase rounded-xl border-2 border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                  maxLength={8}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={searchTrip}
                  disabled={busy || code.length < 4}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy ? "Searching..." : "Search"}
                </motion.button>
              </div>

              {msg && !previewTrip && (
                <div className="mt-4 p-3 rounded-xl bg-white/60 text-sm text-slate-800">
                  {msg}
                </div>
              )}
            </motion.div>
          )}

          {/* Trip Preview */}
          {previewTrip && !joinSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel overflow-hidden mb-6"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-purple-400/20" />
              </div>

              {/* Trip Details */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {previewTrip.name}
                </h2>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-5 w-5" />
                    <span>{previewTrip.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-5 w-5" />
                    <span>{previewTrip.startDate} → {previewTrip.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="h-5 w-5" />
                    <span>{previewTrip.travelers} travelers</span>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-xl bg-sky-50/50 border border-sky-200">
                  <p className="text-sm text-slate-700">
                    <strong>Organized by:</strong> {previewTrip.organizer}
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={joinTrip}
                    disabled={busy}
                    className="flex-1 btn-primary"
                  >
                    {busy ? "Joining..." : "Join This Trip"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setPreviewTrip(null);
                      setCode("");
                      setMsg(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {joinSuccess && previewTrip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-12 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                <span className="gradient-text">Success!</span>
              </h2>
              <p className="text-slate-600 text-lg mb-8">
                You've joined "{previewTrip.name}"
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/trip/${previewTrip.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    View Trip Dashboard
                  </motion.button>
                </Link>
                <Link href="/explore">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary"
                  >
                    Explore More Trips
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Help Section */}
          {!joinSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center text-sm text-slate-600"
            >
              <p className="mb-2">Don't have a trip code?</p>
              <Link href="/explore" className="text-sky-600 hover:text-sky-700 font-medium">
                Explore public trips
              </Link>
              {" or "}
              <Link href="/organizer/new" className="text-sky-600 hover:text-sky-700 font-medium">
                create your own trip
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
