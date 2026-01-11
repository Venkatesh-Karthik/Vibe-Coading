"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
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

interface Activity {
  id: string;
  place: string;
  time: string;
  cost: string;
  notes: string;
}

interface Day {
  id: string;
  dayNumber: number;
  activities: Activity[];
}

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isYou: boolean;
}

export default function DynamicPlannerPage() {
  const [days, setDays] = useState<Day[]>([
    {
      id: "day1",
      dayNumber: 1,
      activities: [
        {
          id: "act1",
          place: "Airport Pickup",
          time: "10:00 AM",
          cost: "₹500",
          notes: "Terminal 2",
        },
        {
          id: "act2",
          place: "Hotel Check-in",
          time: "12:00 PM",
          cost: "₹0",
          notes: "Grand Plaza Hotel",
        },
        {
          id: "act3",
          place: "City Tour",
          time: "3:00 PM",
          cost: "₹1,200",
          notes: "Visit main landmarks",
        },
      ],
    },
    {
      id: "day2",
      dayNumber: 2,
      activities: [
        {
          id: "act4",
          place: "Beach Visit",
          time: "9:00 AM",
          cost: "₹300",
          notes: "Pack sunscreen",
        },
        {
          id: "act5",
          place: "Lunch at Seaside",
          time: "1:00 PM",
          cost: "₹800",
          notes: "Fresh seafood",
        },
      ],
    },
  ]);

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

  const handleAddDay = () => {
    const newDay: Day = {
      id: `day${days.length + 1}`,
      dayNumber: days.length + 1,
      activities: [],
    };
    setDays([...days, newDay]);
  };

  const handleDeleteDay = (dayId: string) => {
    setDays(days.filter((d) => d.id !== dayId));
  };

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

          {days.map((day, index) => (
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
                  <h3 className="font-bold text-slate-900">Day {day.dayNumber}</h3>
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
                    className="p-3 rounded-xl bg-white/60 space-y-1"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-sm text-slate-900">
                        {activity.place}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{activity.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{activity.cost}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">{activity.notes}</p>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-sm font-medium hover:border-sky-400 hover:text-sky-600 transition-colors"
              >
                + Add Activity
              </motion.button>
            </motion.div>
          ))}
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
