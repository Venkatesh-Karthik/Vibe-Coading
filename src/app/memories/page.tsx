"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/lib/auth";
import { uploadMemory, validateFile, getFileType } from "@/lib/helpers/storage";
import type { Memory as MemoryType } from "@/types/database";

interface MemoryWithUploader extends MemoryType {
  uploader_name?: string;
  gradient?: string;
}

// Mock tripId - in production, this would come from URL params or context
const MOCK_TRIP_ID = "demo-trip-123";

const GRADIENTS = [
  "from-orange-400 to-pink-500",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-purple-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
];

export default function MemoryWallPage() {
  const { user } = useSupabaseAuth();
  const [memories, setMemories] = useState<MemoryWithUploader[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryWithUploader | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMemories();
    
    // Set up realtime subscription
    const channel = supabase
      .channel(`memories-${MOCK_TRIP_ID}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'memories',
          filter: `trip_id=eq.${MOCK_TRIP_ID}`
        },
        () => {
          loadMemories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadMemories() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("memories")
        .select(`
          *,
          users!uploaded_by (name)
        `)
        .eq("trip_id", MOCK_TRIP_ID)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Add gradients to memories
      const memoriesWithGradients = (data as any)?.map((mem: any, idx: number) => ({
        ...mem,
        uploader_name: mem.users?.name || "Unknown",
        gradient: GRADIENTS[idx % GRADIENTS.length],
      })) || [];

      setMemories(memoriesWithGradients);
    } catch (err) {
      console.error("Error loading memories:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      setUploading(true);

      // Upload to storage
      const result = await uploadMemory(file, MOCK_TRIP_ID);
      if (!result.success || !result.publicUrl) {
        throw new Error(result.error || "Upload failed");
      }

      // Save to database
      const { error: dbError } = await supabase
        .from("memories")
        .insert({
          trip_id: MOCK_TRIP_ID,
          uploaded_by: user.id,
          file_url: result.publicUrl,
          file_type: getFileType(file),
          caption: "",
          likes: 0,
        } as any);

      if (dbError) throw dbError;

      // Reload memories
      await loadMemories();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error uploading memory:", err);
      alert("Failed to upload memory");
    } finally {
      setUploading(false);
    }
  }

  async function handleLike(memoryId: string) {
    const memory = memories.find((m) => m.id === memoryId);
    if (!memory) return;

    try {
      const newLikes = (memory.likes || 0) + 1;
      const { error } = await (supabase as any)
        .from("memories")
        .update({ likes: newLikes })
        .eq("id", memoryId);

      if (error) throw error;

      // Update local state optimistically
      setMemories((prev) =>
        prev.map((mem) =>
          mem.id === memoryId ? { ...mem, likes: newLikes } : mem
        )
      );
    } catch (err) {
      console.error("Error liking memory:", err);
    }
  }

  const topMoments = memories
    .filter((m) => (m.likes || 0) >= 20)
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 3);

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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !user}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload"}
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading memories...</p>
        </div>
      ) : (
        <>
          {/* Top Moments Section */}
          {topMoments.length > 0 && (
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

                    {/* Image/Video */}
                    <div className={`h-64 bg-gradient-to-br ${memory.gradient} relative overflow-hidden`}>
                      {memory.file_url ? (
                        memory.file_type === "video" ? (
                          <video src={memory.file_url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={memory.file_url} alt={memory.caption || ""} className="w-full h-full object-cover" />
                        )
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {memory.file_type === "video" ? (
                            <Play className="h-16 w-16 text-white/80" />
                          ) : (
                            <ImageIcon className="h-16 w-16 text-white/80" />
                          )}
                        </div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-4">
                      <p className="font-medium text-slate-900 mb-3">{memory.caption || "No caption"}</p>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span className="text-xs">by {memory.uploader_name}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(memory.id);
                            }}
                            className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                            <span>{memory.likes || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Memories Grid */}
          <div className="max-w-7xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">All Memories</h2>

            {memories.length === 0 ? (
              <div className="text-center py-12 glass-panel">
                <Camera className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No memories yet. Upload your first memory!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {memories.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedMemory(memory)}
                    className="glass-panel cursor-pointer overflow-hidden group"
                  >
                    {/* Image/Video */}
                    <div className={`aspect-square bg-gradient-to-br ${memory.gradient} relative overflow-hidden`}>
                      {memory.file_url ? (
                        memory.file_type === "video" ? (
                          <video src={memory.file_url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={memory.file_url} alt={memory.caption || ""} className="w-full h-full object-cover" />
                        )
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {memory.file_type === "video" ? (
                            <Play className="h-12 w-12 text-white/80" />
                          ) : (
                            <ImageIcon className="h-12 w-12 text-white/80" />
                          )}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-3">
                      <p className="text-sm text-slate-900 mb-2 line-clamp-2">
                        {memory.caption || "No caption"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(memory.id);
                          }}
                          className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                        >
                          <Heart className="h-3 w-3" />
                          <span>{memory.likes || 0}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal for selected memory */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>

                {/* Image/Video */}
                <div className={`h-96 bg-gradient-to-br ${selectedMemory.gradient} relative overflow-hidden`}>
                  {selectedMemory.file_url ? (
                    selectedMemory.file_type === "video" ? (
                      <video src={selectedMemory.file_url} controls className="w-full h-full object-contain bg-black" />
                    ) : (
                      <img src={selectedMemory.file_url} alt={selectedMemory.caption || ""} className="w-full h-full object-contain bg-black" />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {selectedMemory.file_type === "video" ? (
                        <Play className="h-24 w-24 text-white/80" />
                      ) : (
                        <ImageIcon className="h-24 w-24 text-white/80" />
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-lg font-medium text-slate-900 mb-4">
                    {selectedMemory.caption || "No caption"}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <span>Uploaded by {selectedMemory.uploader_name}</span>
                    <span>{new Date(selectedMemory.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(selectedMemory.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      <span>Like ({selectedMemory.likes || 0})</span>
                    </button>
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
