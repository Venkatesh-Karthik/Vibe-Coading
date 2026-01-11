"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Camera,
  Upload,
  Heart,
  MessageCircle,
  Star,
  Play,
  Image as ImageIcon,
  X,
  ArrowLeft,
} from "lucide-react";

interface Memory {
  id: string;
  type: "photo" | "video";
  caption: string;
  uploader: string;
  likes: number;
  comments: number;
  date: string;
  day: number;
  gradient: string;
  isTopMoment?: boolean;
}

export default function MemoryWallPage() {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: "mem1",
      type: "photo",
      caption: "Sunset at the beach 🌅",
      uploader: "Sarah",
      likes: 24,
      comments: 8,
      date: "Jan 10, 2026",
      day: 1,
      gradient: "from-orange-400 to-pink-500",
      isTopMoment: true,
    },
    {
      id: "mem2",
      type: "video",
      caption: "Surfing adventure! 🏄",
      uploader: "Mike",
      likes: 31,
      comments: 12,
      date: "Jan 10, 2026",
      day: 1,
      gradient: "from-sky-400 to-blue-500",
      isTopMoment: true,
    },
    {
      id: "mem3",
      type: "photo",
      caption: "Group dinner at the resort",
      uploader: "Emma",
      likes: 28,
      comments: 10,
      date: "Jan 11, 2026",
      day: 2,
      gradient: "from-emerald-400 to-teal-500",
      isTopMoment: true,
    },
    {
      id: "mem4",
      type: "photo",
      caption: "Morning hike views",
      uploader: "John",
      likes: 18,
      comments: 5,
      date: "Jan 11, 2026",
      day: 2,
      gradient: "from-purple-400 to-indigo-500",
    },
    {
      id: "mem5",
      type: "video",
      caption: "Exploring the local market",
      uploader: "Sarah",
      likes: 15,
      comments: 4,
      date: "Jan 12, 2026",
      day: 3,
      gradient: "from-amber-400 to-orange-500",
    },
    {
      id: "mem6",
      type: "photo",
      caption: "Final group photo!",
      uploader: "Mike",
      likes: 42,
      comments: 15,
      date: "Jan 13, 2026",
      day: 4,
      gradient: "from-rose-400 to-pink-500",
    },
  ]);

  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const topMoments = memories.filter((m) => m.isTopMoment);
  const allMemories = memories;

  const groupByDay = (mems: Memory[]) => {
    const grouped: Record<number, Memory[]> = {};
    mems.forEach((mem) => {
      if (!grouped[mem.day]) grouped[mem.day] = [];
      grouped[mem.day].push(mem);
    });
    return grouped;
  };

  const memoriesByDay = groupByDay(memories);

  const handleLike = (memoryId: string) => {
    setMemories((prev) =>
      prev.map((mem) =>
        mem.id === memoryId ? { ...mem, likes: mem.likes + 1 } : mem
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 px-4 pb-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Memory Wall</h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
          </motion.button>
        </div>
      </div>

      {/* Top Moments Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
          <h2 className="text-2xl font-bold text-slate-900">Top Moments</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {topMoments.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedMemory(memory)}
              className="glass-panel cursor-pointer overflow-hidden relative group"
            >
              {/* Star Badge */}
              <div className="absolute top-4 right-4 z-10 p-2 rounded-full bg-amber-500">
                <Star className="h-4 w-4 text-white fill-white" />
              </div>

              {/* Mock Image */}
              <div
                className={`h-64 bg-gradient-to-br ${memory.gradient} relative overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {memory.type === "video" ? (
                    <Play className="h-16 w-16 text-white/80" />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-white/80" />
                  )}
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-4">
                <p className="font-medium text-slate-900 mb-3">{memory.caption}</p>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="text-xs">by {memory.uploader}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{memory.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{memory.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Memories Grid */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">All Memories</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allMemories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedMemory(memory)}
              className="glass-panel cursor-pointer overflow-hidden group"
            >
              {/* Mock Image */}
              <div
                className={`aspect-square bg-gradient-to-br ${memory.gradient} relative overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {memory.type === "video" ? (
                    <Play className="h-12 w-12 text-white/80" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-white/80" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-3">
                <p className="text-sm text-slate-900 mb-2 line-clamp-2">
                  {memory.caption}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{memory.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{memory.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline View */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Timeline View</h2>

        <div className="space-y-6">
          {Object.entries(memoriesByDay).map(([day, dayMemories], dayIndex) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
            >
              <h3 className="text-lg font-bold text-slate-700 mb-3">Day {day}</h3>
              <div className="glass-panel p-4">
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {dayMemories.map((memory) => (
                    <motion.div
                      key={memory.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedMemory(memory)}
                      className="flex-shrink-0 w-40 cursor-pointer"
                    >
                      <div
                        className={`aspect-square rounded-xl bg-gradient-to-br ${memory.gradient} relative overflow-hidden mb-2`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          {memory.type === "video" ? (
                            <Play className="h-8 w-8 text-white/80" />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-white/80" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 line-clamp-2">
                        {memory.caption}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        by {memory.uploader}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <div className="flex justify-end p-4 pb-0">
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="p-2 rounded-xl hover:bg-slate-200/50 transition-colors"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>

              {/* Large Preview */}
              <div
                className={`h-96 bg-gradient-to-br ${selectedMemory.gradient} mx-6 rounded-2xl overflow-hidden relative`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {selectedMemory.type === "video" ? (
                    <Play className="h-24 w-24 text-white/80" />
                  ) : (
                    <ImageIcon className="h-24 w-24 text-white/80" />
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <p className="text-xl font-bold text-slate-900 mb-2">
                  {selectedMemory.caption}
                </p>
                <p className="text-sm text-slate-600 mb-4">
                  Uploaded by {selectedMemory.uploader} on {selectedMemory.date}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLike(selectedMemory.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-100 text-rose-600 font-semibold hover:bg-rose-200 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{selectedMemory.likes} Likes</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-100 text-sky-600 font-semibold hover:bg-sky-200 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{selectedMemory.comments} Comments</span>
                  </motion.button>
                </div>

                {/* Mock Comments */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">Comments</p>
                  <div className="p-3 rounded-xl bg-white/60">
                    <p className="text-sm font-semibold text-slate-900">John</p>
                    <p className="text-sm text-slate-600">Amazing shot! 📸</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60">
                    <p className="text-sm font-semibold text-slate-900">Emma</p>
                    <p className="text-sm text-slate-600">
                      Best memories ever! Can't wait for the next trip 🎉
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
