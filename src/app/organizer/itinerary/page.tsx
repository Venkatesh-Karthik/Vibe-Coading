"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  Clock,
  MapPin,
  DollarSign,
  ExternalLink,
  Download,
  Send,
} from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// Mock data types
interface Activity {
  id: string;
  place: string;
  time: string;
  description: string;
  cost: number;
  bookingLink?: string;
  lat?: number;
  lng?: number;
}

interface Day {
  id: string;
  dayNumber: number;
  date: string;
  activities: Activity[];
}

// Mock initial data
const mockInitialDays: Day[] = [
  {
    id: "day-1",
    dayNumber: 1,
    date: "2024-03-15",
    activities: [
      {
        id: "act-1-1",
        place: "Taj Mahal",
        time: "09:00 AM",
        description: "Visit the iconic Taj Mahal at sunrise",
        cost: 1050,
        bookingLink: "https://example.com/taj",
        lat: 27.1751,
        lng: 78.0421,
      },
      {
        id: "act-1-2",
        place: "Agra Fort",
        time: "12:00 PM",
        description: "Explore the historic Agra Fort",
        cost: 650,
        lat: 27.1795,
        lng: 78.0211,
      },
      {
        id: "act-1-3",
        place: "Lunch at Pinch of Spice",
        time: "02:00 PM",
        description: "Authentic Mughlai cuisine",
        cost: 1200,
        lat: 27.1767,
        lng: 78.0081,
      },
    ],
  },
  {
    id: "day-2",
    dayNumber: 2,
    date: "2024-03-16",
    activities: [
      {
        id: "act-2-1",
        place: "Fatehpur Sikri",
        time: "10:00 AM",
        description: "Day trip to the abandoned Mughal city",
        cost: 610,
        lat: 27.0945,
        lng: 77.6661,
      },
      {
        id: "act-2-2",
        place: "Mehtab Bagh",
        time: "05:00 PM",
        description: "Sunset view of Taj Mahal from across the river",
        cost: 50,
        lat: 27.1791,
        lng: 78.0467,
      },
    ],
  },
];

export default function ItineraryDashboard() {
  const [days, setDays] = useState<Day[]>(mockInitialDays);
  const [selectedDayId, setSelectedDayId] = useState<string>(days[0].id);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    place: "",
    time: "",
    description: "",
    cost: "",
    bookingLink: "",
  });

  // Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const selectedDay = days.find((d) => d.id === selectedDayId) || days[0];

  // Day management
  const addNewDay = () => {
    const newDay: Day = {
      id: `day-${days.length + 1}`,
      dayNumber: days.length + 1,
      date: new Date(
        new Date(days[days.length - 1].date).getTime() + 86400000
      ).toISOString().split("T")[0],
      activities: [],
    };
    setDays([...days, newDay]);
    setSelectedDayId(newDay.id);
  };

  const deleteDay = (dayId: string) => {
    if (days.length === 1) {
      alert("Cannot delete the last day!");
      return;
    }
    const newDays = days.filter((d) => d.id !== dayId);
    setDays(newDays);
    if (selectedDayId === dayId) {
      setSelectedDayId(newDays[0].id);
    }
  };

  const duplicateDay = (dayId: string) => {
    const dayToDuplicate = days.find((d) => d.id === dayId);
    if (!dayToDuplicate) return;

    const newDay: Day = {
      id: `day-${Date.now()}`,
      dayNumber: days.length + 1,
      date: new Date(
        new Date(days[days.length - 1].date).getTime() + 86400000
      ).toISOString().split("T")[0],
      activities: dayToDuplicate.activities.map((act) => ({
        ...act,
        id: `act-${Date.now()}-${Math.random()}`,
      })),
    };
    setDays([...days, newDay]);
  };

  // Activity management
  const addActivity = () => {
    if (!newActivity.place || !newActivity.time) {
      alert("Please fill in place and time");
      return;
    }

    const activity: Activity = {
      id: `act-${Date.now()}`,
      place: newActivity.place,
      time: newActivity.time,
      description: newActivity.description,
      cost: parseFloat(newActivity.cost) || 0,
      bookingLink: newActivity.bookingLink || undefined,
    };

    setDays(
      days.map((d) =>
        d.id === selectedDayId
          ? { ...d, activities: [...d.activities, activity] }
          : d
      )
    );

    setNewActivity({
      place: "",
      time: "",
      description: "",
      cost: "",
      bookingLink: "",
    });
    setShowAddModal(false);
  };

  const deleteActivity = (activityId: string) => {
    setDays(
      days.map((d) =>
        d.id === selectedDayId
          ? {
              ...d,
              activities: d.activities.filter((a) => a.id !== activityId),
            }
          : d
      )
    );
  };

  const reorderActivities = (newOrder: Activity[]) => {
    setDays(
      days.map((d) =>
        d.id === selectedDayId ? { ...d, activities: newOrder } : d
      )
    );
  };

  const mapCenter =
    selectedDay.activities.length > 0 && selectedDay.activities[0].lat
      ? { lat: selectedDay.activities[0].lat, lng: selectedDay.activities[0].lng! }
      : { lat: 20.5937, lng: 78.9629 };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/organizer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Organizer
            </motion.button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="gradient-text">Day-wise Itinerary</span>
              </h1>
              <p className="text-slate-600 mt-2">
                Plan your trip day by day with drag-and-drop activities
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Export to PDF - Coming Soon!")}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Published to all travelers!")}
                className="btn-primary flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Publish
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-[280px,1fr,360px] gap-6">
          {/* Left Sidebar - Days List */}
          <div className="glass-panel p-6 h-fit lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Days</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={addNewDay}
                className="p-2 rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-200"
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>

            <div className="space-y-2">
              {days.map((day) => (
                <motion.div
                  key={day.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDayId(day.id)}
                  className={`p-4 rounded-xl cursor-pointer transition ${
                    selectedDayId === day.id
                      ? "bg-gradient-to-r from-sky-400 to-emerald-400 text-white shadow-lg"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">Day {day.dayNumber}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateDay(day.id);
                        }}
                        className={`p-1 rounded ${
                          selectedDayId === day.id
                            ? "hover:bg-white/20"
                            : "hover:bg-slate-100"
                        }`}
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      {days.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDay(day.id);
                          }}
                          className={`p-1 rounded ${
                            selectedDayId === day.id
                              ? "hover:bg-white/20"
                              : "hover:bg-slate-100"
                          }`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    className={`text-xs ${
                      selectedDayId === day.id
                        ? "text-white/90"
                        : "text-slate-600"
                    }`}
                  >
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      selectedDayId === day.id
                        ? "text-white/90"
                        : "text-slate-500"
                    }`}
                  >
                    {day.activities.length} activities
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Center - Main Editor */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Day {selectedDay.dayNumber}
                </h2>
                <p className="text-sm text-slate-600">
                  {new Date(selectedDay.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Activity
              </motion.button>
            </div>

            {/* Timeline */}
            {selectedDay.activities.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No activities yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  Click "Add Activity" to start planning
                </p>
              </div>
            ) : (
              <Reorder.Group
                axis="y"
                values={selectedDay.activities}
                onReorder={reorderActivities}
                className="space-y-4"
              >
                {selectedDay.activities.map((activity, index) => (
                  <Reorder.Item key={activity.id} value={activity}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/60 rounded-xl p-4 cursor-grab active:cursor-grabbing border border-white/40"
                    >
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="p-2 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-lg text-white font-bold">
                            {index + 1}
                          </div>
                          <GripVertical className="h-4 w-4 text-slate-400 mt-2" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-slate-900 text-lg">
                                {activity.place}
                              </h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {activity.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />₹
                                  {activity.cost}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteActivity(activity.id)}
                              className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {activity.description && (
                            <p className="text-sm text-slate-600 mt-2">
                              {activity.description}
                            </p>
                          )}

                          {activity.bookingLink && (
                            <a
                              href={activity.bookingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 mt-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Booking Link
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </div>

          {/* Right Panel - Map */}
          <div className="glass-panel p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Map View
            </h3>
            <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/40">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={mapCenter}
                  zoom={12}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                  }}
                >
                  {selectedDay.activities.map((activity, index) =>
                    activity.lat && activity.lng ? (
                      <Marker
                        key={activity.id}
                        position={{ lat: activity.lat, lng: activity.lng }}
                        label={{
                          text: `${index + 1}`,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    ) : null
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500">
                  Loading map...
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {selectedDay.activities.filter((a) => a.lat && a.lng).length} of{" "}
              {selectedDay.activities.length} activities mapped
            </p>
          </div>
        </div>

        {/* Add Activity Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Add Activity
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Place Name *
                  </label>
                  <input
                    type="text"
                    value={newActivity.place}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, place: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="e.g., Taj Mahal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={newActivity.time}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, time: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="Brief description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={newActivity.cost}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, cost: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Booking Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={newActivity.bookingLink}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        bookingLink: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addActivity}
                  className="flex-1 btn-primary"
                >
                  Add Activity
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
