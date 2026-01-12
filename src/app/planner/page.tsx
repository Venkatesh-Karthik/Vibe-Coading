"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  GripVertical,
  MapPin,
  Clock,
  DollarSign,
  MessageCircle,
  Send,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/lib/auth";
import type { Activity, ItineraryDay } from "@/types/database";

interface DayWithActivities extends ItineraryDay {
  activities: Activity[];
}

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isYou: boolean;
}

// Mock tripId - in production, this would come from URL params or context
const MOCK_TRIP_ID = "demo-trip-123";

export default function DynamicPlannerPage() {
  const { user } = useSupabaseAuth();
  const [days, setDays] = useState<DayWithActivities[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg1",
      user: "Sarah",
      text: "Should we add more time for the beach?",
      timestamp: "10:30 AM",
      isYou: false,
    },
    {
      id: "msg2",
      user: "You",
      text: "Yes, let's extend it by an hour!",
      timestamp: "10:32 AM",
      isYou: true,
    },
    {
      id: "msg3",
      user: "Mike",
      text: "Don't forget to book the boat tour",
      timestamp: "10:35 AM",
      isYou: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  // Load itinerary from Supabase
  useEffect(() => {
    loadItinerary();
  }, []);

  async function loadItinerary() {
    try {
      setLoading(true);
      setError(null);

      const { data: daysData, error: daysError } = await supabase
        .from("itinerary_days")
        .select(`
          *,
          activities (*)
        `)
        .eq("trip_id", MOCK_TRIP_ID)
        .order("day_number", { ascending: true });

      if (daysError) throw daysError;

      setDays((daysData as DayWithActivities[]) || []);
    } catch (err) {
      console.error("Error loading itinerary:", err);
      setError(err instanceof Error ? err.message : "Failed to load itinerary");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddDay() {
    try {
      const nextDayNumber = days.length > 0 ? Math.max(...days.map(d => d.day_number)) + 1 : 1;

      const { data, error } = await supabase
        .from("itinerary_days")
        .insert({
          trip_id: MOCK_TRIP_ID,
          day_number: nextDayNumber,
        } as any)
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setDays([...days, { ...(data as any), activities: [] } as DayWithActivities]);
    } catch (err) {
      console.error("Error adding day:", err);
      alert("Failed to add day");
    }
  }

  async function handleDeleteDay(dayId: string) {
    try {
      const { error } = await supabase
        .from("itinerary_days")
        .delete()
        .eq("id", dayId);

      if (error) throw error;

      // Remove from local state
      setDays(days.filter((d) => d.id !== dayId));
    } catch (err) {
      console.error("Error deleting day:", err);
      alert("Failed to delete day");
    }
  }

  async function handleAddActivity(dayId: string) {
    try {
      const { data, error } = await supabase
        .from("activities")
        .insert({
          day_id: dayId,
          title: "New Activity",
          time: "12:00 PM",
          cost: 0,
          notes: "",
        } as any)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setDays(
        days.map((day) =>
          day.id === dayId
            ? { ...day, activities: [...day.activities, data as Activity] }
            : day
        )
      );
    } catch (err) {
      console.error("Error adding activity:", err);
      alert("Failed to add activity");
    }
  }

  async function handleDeleteActivity(activityId: string, dayId: string) {
    try {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", activityId);

      if (error) throw error;

      // Update local state
      setDays(
        days.map((day) =>
          day.id === dayId
            ? {
                ...day,
                activities: day.activities.filter((a) => a.id !== activityId),
              }
            : day
        )
      );
    } catch (err) {
      console.error("Error deleting activity:", err);
      alert("Failed to delete activity");
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: `msg${messages.length + 1}`,
        user: "You",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isYou: true,
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading itinerary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-rose-600">Error: {error}</p>
            <button
              onClick={loadItinerary}
              className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pt-24 px-4 pb-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Dynamic Planner</h1>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-6">
        {/* Left Panel - Days */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Days</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddDay}
              className="p-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          {days.length === 0 ? (
            <div className="glass-panel p-4 text-center text-slate-600">
              <p>No days yet. Click + to add one!</p>
            </div>
          ) : (
            days.map((day, index) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
                    <h3 className="font-bold text-slate-900">Day {day.day_number}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteDay(day.id)}
                    className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Activities */}
                <div className="space-y-2">
                  {day.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 rounded-xl bg-white/60 space-y-1 group relative"
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-semibold text-sm text-slate-900">
                          {activity.title || activity.location || "Untitled Activity"}
                        </p>
                        <button
                          onClick={() => handleDeleteActivity(activity.id, day.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-100 text-rose-600 transition-all"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{activity.time || "TBD"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>₹{activity.cost || 0}</span>
                        </div>
                      </div>
                      {activity.notes && (
                        <p className="text-xs text-slate-500">{activity.notes}</p>
                      )}
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddActivity(day.id)}
                  className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-sm font-medium hover:border-sky-400 hover:text-sky-600 transition-colors"
                >
                  + Add Activity
                </motion.button>
              </motion.div>
            ))
          )}
        </div>

        {/* Center Panel - Map */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel h-[600px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-emerald-100">
              {/* Mock Map Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-[20%] left-[30%] w-32 h-32 bg-sky-400 rounded-full blur-3xl" />
                <div className="absolute top-[50%] left-[60%] w-40 h-40 bg-emerald-400 rounded-full blur-3xl" />
                <div className="absolute top-[70%] left-[20%] w-36 h-36 bg-sky-300 rounded-full blur-3xl" />
              </div>

              {/* Location Pins */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-[25%] left-[35%]"
              >
                <div className="relative">
                  <MapPin className="h-8 w-8 text-rose-500 fill-rose-500 drop-shadow-lg" />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap glass-panel px-3 py-1 text-xs font-medium">
                    City Tour
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-[60%] left-[65%]"
              >
                <div className="relative">
                  <MapPin className="h-8 w-8 text-sky-600 fill-sky-600 drop-shadow-lg" />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap glass-panel px-3 py-1 text-xs font-medium">
                    Beach
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute top-[75%] left-[25%]"
              >
                <div className="relative">
                  <MapPin className="h-8 w-8 text-emerald-600 fill-emerald-600 drop-shadow-lg" />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap glass-panel px-3 py-1 text-xs font-medium">
                    Seaside Restaurant
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <button className="glass-panel p-2 hover:bg-white/60 transition-colors">
                <Plus className="h-4 w-4 text-slate-700" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Panel - Chat */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel h-[600px] flex flex-col"
          >
            <div className="p-4 border-b border-slate-200/50">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-sky-600" />
                <h3 className="font-bold text-slate-900">Team Chat</h3>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${
                    message.isYou ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isYou
                        ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white"
                        : "bg-white/60 text-slate-900"
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1 opacity-80">
                      {message.user}
                    </p>
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <span className="text-xs text-slate-500 mt-1">
                    {message.timestamp}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-xl bg-white/60 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="p-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
