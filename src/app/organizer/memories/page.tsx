"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Heart,
  Star,
  Image as ImageIcon,
  Video,
  Upload,
  Check,
  X,
  Trash2,
  Clock,
  User,
  Filter,
  MoreVertical,
} from "lucide-react";

// Types
interface Memory {
  id: string;
  type: "photo" | "video";
  url: string;
  uploadedBy: string;
  date: string;
  caption: string;
  likes: number;
  pinned: boolean;
  approved: boolean;
  day?: number;
}

interface Traveler {
  id: string;
  name: string;
}

// Mock data
const mockTravelers: Traveler[] = [
  { id: "user-1", name: "John Doe" },
  { id: "user-2", name: "Sarah Smith" },
  { id: "user-3", name: "Mike Johnson" },
  { id: "user-4", name: "Emma Wilson" },
];

const mockMemories: Memory[] = [
  {
    id: "mem-1",
    type: "photo",
    url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
    uploadedBy: "user-1",
    date: "2024-03-15",
    caption: "Amazing sunset at the beach! 🌅",
    likes: 24,
    pinned: true,
    approved: true,
    day: 1,
  },
  {
    id: "mem-2",
    type: "photo",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    uploadedBy: "user-2",
    date: "2024-03-15",
    caption: "Mountain views were breathtaking",
    likes: 18,
    pinned: false,
    approved: true,
    day: 1,
  },
  {
    id: "mem-3",
    type: "photo",
    url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
    uploadedBy: "user-3",
    date: "2024-03-16",
    caption: "Beach vibes 🏖️",
    likes: 32,
    pinned: true,
    approved: true,
    day: 2,
  },
  {
    id: "mem-4",
    type: "video",
    url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400",
    uploadedBy: "user-4",
    date: "2024-03-16",
    caption: "Exploring the local market",
    likes: 15,
    pinned: false,
    approved: true,
    day: 2,
  },
  {
    id: "mem-5",
    type: "photo",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400",
    uploadedBy: "user-1",
    date: "2024-03-17",
    caption: "Group photo at the landmark",
    likes: 45,
    pinned: false,
    approved: true,
    day: 3,
  },
  {
    id: "mem-6",
    type: "photo",
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400",
    uploadedBy: "user-2",
    date: "2024-03-17",
    caption: "Adventure time! 🚁",
    likes: 28,
    pinned: false,
    approved: true,
    day: 3,
  },
  {
    id: "mem-7",
    type: "photo",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
    uploadedBy: "user-3",
    date: "2024-03-17",
    caption: "Perfect beach day",
    likes: 21,
    pinned: false,
    approved: false,
    day: 3,
  },
  {
    id: "mem-8",
    type: "photo",
    url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400",
    uploadedBy: "user-4",
    date: "2024-03-18",
    caption: "Last day memories 💕",
    likes: 36,
    pinned: true,
    approved: false,
    day: 4,
  },
];

export default function MemoriesDashboard() {
  const [memories, setMemories] = useState<Memory[]>(mockMemories);
  const [filterDay, setFilterDay] = useState<string>("All Days");
  const [filterTraveler, setFilterTraveler] = useState<string>("All Travelers");
  const [sortBy, setSortBy] = useState<string>("Recent");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [editCaption, setEditCaption] = useState("");

  // Stats
  const totalMemories = memories.length;
  const pinnedCount = memories.filter((m) => m.pinned).length;
  const totalLikes = memories.reduce((sum, m) => sum + m.likes, 0);
  const pendingCount = memories.filter((m) => !m.approved).length;

  // Filtered and sorted memories
  const filteredMemories = memories
    .filter((m) => {
      const matchesDay =
        filterDay === "All Days" || `Day ${m.day}` === filterDay;
      const matchesTraveler =
        filterTraveler === "All Travelers" || m.uploadedBy === filterTraveler;
      return matchesDay && matchesTraveler;
    })
    .sort((a, b) => {
      if (sortBy === "Recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "Most Liked") {
        return b.likes - a.likes;
      } else if (sortBy === "Pinned") {
        return b.pinned ? 1 : -1;
      }
      return 0;
    });

  // Actions
  const togglePin = (memoryId: string) => {
    setMemories(
      memories.map((m) => (m.id === memoryId ? { ...m, pinned: !m.pinned } : m))
    );
  };

  const toggleApproval = (memoryId: string) => {
    setMemories(
      memories.map((m) =>
        m.id === memoryId ? { ...m, approved: !m.approved } : m
      )
    );
  };

  const deleteMemory = (memoryId: string) => {
    if (confirm("Are you sure you want to delete this memory?")) {
      setMemories(memories.filter((m) => m.id !== memoryId));
      setSelectedMemory(null);
    }
  };

  const updateCaption = () => {
    if (selectedMemory) {
      setMemories(
        memories.map((m) =>
          m.id === selectedMemory.id ? { ...m, caption: editCaption } : m
        )
      );
      setSelectedMemory({ ...selectedMemory, caption: editCaption });
    }
  };

  const openMemory = (memory: Memory) => {
    setSelectedMemory(memory);
    setEditCaption(memory.caption);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-slate-50">
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
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Memory Wall
                </span>
              </h1>
              <p className="text-slate-600 mt-2">
                Relive your favorite moments together
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert("Upload photos/videos - Coming Soon!")}
              className="btn-primary flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-slate-600">Total</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {totalMemories}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-slate-600">Pinned</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {pinnedCount}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <span className="text-sm font-medium text-slate-600">Likes</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {totalLikes}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-sky-600" />
              <span className="text-sm font-medium text-slate-600">
                Pending
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {pendingCount}
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="glass-panel p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Filter by Day
              </label>
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white"
              >
                <option>All Days</option>
                <option>Day 1</option>
                <option>Day 2</option>
                <option>Day 3</option>
                <option>Day 4</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Filter by Traveler
              </label>
              <select
                value={filterTraveler}
                onChange={(e) => setFilterTraveler(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white"
              >
                <option>All Travelers</option>
                {mockTravelers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white"
              >
                <option>Recent</option>
                <option>Most Liked</option>
                <option>Pinned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMemories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => openMemory(memory)}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group glass-panel"
            >
              {/* Image */}
              <img
                src={memory.url}
                alt={memory.caption}
                className="w-full h-full object-cover"
              />

              {/* Type Badge */}
              <div className="absolute top-2 left-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    memory.type === "photo"
                      ? "bg-purple-600 text-white"
                      : "bg-pink-600 text-white"
                  }`}
                >
                  {memory.type === "photo" ? (
                    <ImageIcon className="h-3 w-3 inline mr-1" />
                  ) : (
                    <Video className="h-3 w-3 inline mr-1" />
                  )}
                  {memory.type}
                </span>
              </div>

              {/* Pinned Star */}
              {memory.pinned && (
                <div className="absolute top-2 right-2">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                </div>
              )}

              {/* Approval Status */}
              {!memory.approved && (
                <div className="absolute top-2 right-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500 text-white">
                    Pending
                  </span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-2 text-white text-xs mb-1">
                    <User className="h-3 w-3" />
                    {mockTravelers.find((t) => t.id === memory.uploadedBy)?.name}
                  </div>
                  <div className="flex items-center gap-2 text-white text-xs">
                    <Heart className="h-3 w-3" />
                    {memory.likes} likes
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMemories.length === 0 && (
          <div className="text-center py-12 glass-panel">
            <Camera className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">No memories found</p>
            <p className="text-slate-500 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        )}

        {/* Full View Modal */}
        <AnimatePresence>
          {selectedMemory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedMemory(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-panel p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="grid md:grid-cols-[1fr,400px] gap-6">
                  {/* Image */}
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <img
                      src={selectedMemory.url}
                      alt={selectedMemory.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-900">
                        Memory Details
                      </h3>
                      <button
                        onClick={() => setSelectedMemory(null)}
                        className="p-2 rounded-lg hover:bg-slate-100"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Caption */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Caption
                        </label>
                        <textarea
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                          rows={3}
                        />
                        <button
                          onClick={updateCaption}
                          className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Update Caption
                        </button>
                      </div>

                      {/* Meta Info */}
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>
                            Uploaded by:{" "}
                            {
                              mockTravelers.find(
                                (t) => t.id === selectedMemory.uploadedBy
                              )?.name
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(selectedMemory.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span>{selectedMemory.likes} likes</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 pt-4 border-t border-slate-200">
                        <button
                          onClick={() => togglePin(selectedMemory.id)}
                          className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
                            selectedMemory.pinned
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              selectedMemory.pinned ? "fill-amber-700" : ""
                            }`}
                          />
                          {selectedMemory.pinned ? "Unpin" : "Pin"} Memory
                        </button>

                        <button
                          onClick={() => toggleApproval(selectedMemory.id)}
                          className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
                            selectedMemory.approved
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {selectedMemory.approved ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                          {selectedMemory.approved ? "Approved" : "Approve"}
                        </button>

                        <button
                          onClick={() => deleteMemory(selectedMemory.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Memory
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
