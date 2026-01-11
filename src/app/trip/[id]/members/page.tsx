"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Copy, Check, Shield, Trash2 } from "lucide-react";
import Footer from "@/components/Footer";
import { mockUsers, getTripById } from "@/utils/mockData";

export default function MembersPage() {
  const params = useParams<{ id: string }>();
  const tripId = params?.id;
  const trip = tripId ? getTripById(tripId) : null;

  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [members] = useState(mockUsers);

  const handleInvite = () => {
    if (inviteEmail) {
      alert(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
    }
  };

  const copyTripLink = () => {
    const link = `${window.location.origin}/join?code=${trip?.tripCode || ""}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel p-8">
          <p className="text-slate-600">Trip not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="gradient-text">Trip Members</span>
                </h1>
                <p className="text-slate-600">Manage your travel crew</p>
              </div>
              <Link href={`/trip/${tripId}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-sm"
                >
                  Back to Trip
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Invite Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-sky-500" />
              Invite New Members
            </h2>

            <div className="space-y-4">
              {/* Email Invite */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Invite by Email
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="flex-1 px-4 py-2 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInvite}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Send Invite
                  </motion.button>
                </div>
              </div>

              {/* Trip Link */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Or share trip link
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/join?code=${trip.tripCode || ""}`}
                    readOnly
                    className="flex-1 px-4 py-2 rounded-xl border border-white/40 bg-white/30 text-slate-600 text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyTripLink}
                    className="btn-secondary flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Members List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              Current Members ({members.length})
            </h2>

            <div className="grid gap-4">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/60 hover:bg-white/80 transition"
                >
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-sky-200 to-emerald-200 flex items-center justify-center text-lg font-bold text-slate-700 flex-shrink-0">
                    {member.name[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{member.name}</h3>
                      {member.role === "organizer" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                          <Shield className="h-3 w-3" />
                          Organizer
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{member.email}</p>
                    {member.responsibilities && member.responsibilities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {member.responsibilities.map((resp) => (
                          <span
                            key={resp}
                            className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-slate-700"
                          >
                            {resp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white/80 text-sm font-medium text-slate-700 transition"
                    >
                      Edit Role
                    </motion.button>
                    {member.role !== "organizer" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
