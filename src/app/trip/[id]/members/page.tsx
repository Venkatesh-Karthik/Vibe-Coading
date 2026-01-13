"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Copy, Check, Shield, Trash2, Loader2, Users } from "lucide-react";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { getTripById } from "@/lib/trips";
import type { Trip, User, TripMember } from "@/types/database";

type MemberWithUser = TripMember & {
  user: User | null;
};

export default function MembersPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tripId = params?.id;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!tripId) return;

      setLoading(true);
      try {
        // Fetch trip data
        const { data: tripData, error: tripError } = await getTripById(tripId);
        if (tripError || !tripData) {
          console.error("Error fetching trip:", tripError);
          setTrip(null);
          setLoading(false);
          return;
        }
        setTrip(tripData);

        // Fetch trip members with user data
        const { data: membersData, error: membersError } = await supabase
          .from("trip_members")
          .select(`
            *,
            user:users (*)
          `)
          .eq("trip_id", tripId);

        if (membersError) {
          console.error("Error fetching members:", membersError);
          setMembers([]);
        } else {
          // Type cast is safe here because we're selecting with a join
          setMembers((membersData || []) as MemberWithUser[]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tripId]);

  const handleInvite = () => {
    if (inviteEmail) {
      // For now, just show an alert. In a real app, send an email invitation
      alert(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
    }
  };

  const copyTripLink = async () => {
    if (typeof window === "undefined" || !trip?.join_code) return;
    const link = `${window.location.origin}/join?code=${trip.join_code}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-sky-500" />
            <span className="text-slate-600">Loading members...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel p-8 text-center">
          <p className="text-slate-600 mb-4">Trip not found</p>
          <button onClick={() => router.push("/explore")} className="btn-secondary">
            Back to Explore
          </button>
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
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/join?code=${trip.join_code || ""}`}
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

            {members.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 text-lg mb-2">No members yet</p>
                <p className="text-slate-500 text-sm">
                  Share the trip code to invite members
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {members.map((member, index) => {
                  const user = member.user;
                  if (!user) return null;
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/60 hover:bg-white/80 transition"
                    >
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-sky-200 to-emerald-200 flex items-center justify-center text-lg font-bold text-slate-700 flex-shrink-0">
                        {user.photo ? (
                          <img src={user.photo} alt={user.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          user.name?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{user.name || 'Unnamed User'}</h3>
                          {member.role === "organizer" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                              <Shield className="h-3 w-3" />
                              Organizer
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{user.email || 'No email'}</p>
                      </div>

                      {/* Actions */}
                      {member.role !== "organizer" && (
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 font-medium text-red-600 transition"
                          >
                            Remove
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
