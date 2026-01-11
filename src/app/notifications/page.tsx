"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bell, Check, CheckCheck, Mail, DollarSign, MapPin, Camera, UserPlus } from "lucide-react";
import Footer from "../../components/Footer";
import { mockNotifications } from "../../utils/mockData";

const notificationIcons = {
  invite: Mail,
  expense: DollarSign,
  itinerary: MapPin,
  memory: Camera,
  join_request: UserPlus,
  approval: CheckCheck,
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="gradient-text">Notifications</span>
                </h1>
                <p className="text-slate-600">
                  Stay updated with your trips
                  {unreadCount > 0 && (
                    <span className="ml-2 text-sky-600 font-semibold">
                      ({unreadCount} unread)
                    </span>
                  )}
                </p>
              </div>
              {unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={markAllAsRead}
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all as read
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-2 inline-flex rounded-2xl mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                filter === "all"
                  ? "bg-white/70 text-slate-900 shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter("unread")}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                filter === "unread"
                  ? "bg-white/70 text-slate-900 shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-2 bg-sky-500 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </motion.button>
          </motion.div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-12 text-center"
            >
              <Bell className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600 text-lg mb-2">No notifications</p>
              <p className="text-slate-500 text-sm">
                {filter === "unread" 
                  ? "You're all caught up! Check back later for updates."
                  : "When you have notifications, they'll appear here."}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif, index) => {
                const Icon = notificationIcons[notif.type];
                
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className={`glass-panel p-5 hover:shadow-lg transition ${
                      !notif.read ? "bg-sky-50/30 border-l-4 border-sky-500" : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        !notif.read 
                          ? "bg-gradient-to-br from-sky-400 to-emerald-400" 
                          : "bg-white/60"
                      }`}>
                        <Icon className={`h-6 w-6 ${!notif.read ? "text-white" : "text-slate-600"}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 font-medium mb-1">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                          <span>{notif.time}</span>
                          {!notif.read && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-sky-600 font-medium">
                                <div className="w-2 h-2 rounded-full bg-sky-500" />
                                New
                              </span>
                            </>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {notif.actionable && (
                            <Link href={`/trip/${notif.tripId}`}>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-medium"
                              >
                                View Trip
                              </motion.button>
                            </Link>
                          )}
                          {!notif.read && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => markAsRead(notif.id)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white/80 text-slate-700 font-medium flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              Mark as read
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
