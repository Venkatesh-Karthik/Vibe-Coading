"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Upload, Heart, MessageCircle, Download, X, Camera } from "lucide-react";
import Footer from "@/components/Footer";
import { mockMemories, getTripById } from "@/utils/mockData";

export default function MemoriesPage() {
  const params = useParams<{ id: string }>();
  const tripId = params?.id;
  const trip = tripId ? getTripById(tripId) : null;

  const [memories] = useState(mockMemories);
  const [selectedMemory, setSelectedMemory] = useState<typeof mockMemories[0] | null>(null);

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="gradient-text">Memories</span>
                </h1>
                <p className="text-slate-600">Relive your amazing journey</p>
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

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 mb-8"
          >
            <div className="border-2 border-dashed border-white/40 rounded-2xl p-12 text-center hover:border-sky-500/50 transition cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="p-4 rounded-full bg-gradient-to-r from-sky-100 to-emerald-100">
                  <Camera className="h-8 w-8 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    Upload Photos & Videos
                  </h3>
                  <p className="text-sm text-slate-600">
                    Drag and drop or click to browse
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Choose Files
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Memories Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                All Memories ({memories.length})
              </h2>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-sm"
                >
                  Timeline View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-sm"
                >
                  Create Story
                </motion.button>
              </div>
            </div>

            {memories.length === 0 ? (
              <div className="glass-panel p-12 text-center">
                <Camera className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 text-lg mb-2">No memories yet</p>
                <p className="text-slate-500 text-sm">
                  Start uploading photos to create your travel story
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {memories.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    onClick={() => setSelectedMemory(memory)}
                    className="aspect-square rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden cursor-pointer group"
                  >
                    {/* Mock Image Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400/30 to-purple-400/30" />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                      <div className="w-full">
                        <p className="text-white text-sm font-medium mb-2 line-clamp-2">
                          {memory.caption}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-white/90">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {memory.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {memory.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Memory Details</h3>
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="p-2 rounded-lg hover:bg-white/50 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Image */}
              <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/30 to-purple-400/30" />
              </div>

              {/* Caption */}
              <p className="text-slate-800 mb-4">{selectedMemory.caption}</p>

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                <span>{selectedMemory.date}</span>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {selectedMemory.likes} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {selectedMemory.comments} comments
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center gap-2 flex-1"
                >
                  <Heart className="h-4 w-4" />
                  Like
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center gap-2 flex-1"
                >
                  <MessageCircle className="h-4 w-4" />
                  Comment
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
