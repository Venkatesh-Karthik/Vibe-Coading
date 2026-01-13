"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Share2, Mail } from "lucide-react";

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripCode: string;
  tripTitle: string;
  tripId: string;
}

export default function ShareTripModal({
  isOpen,
  onClose,
  tripCode,
  tripTitle,
  tripId,
}: ShareTripModalProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const tripLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/join?code=${tripCode}` 
    : '';

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(tripCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(tripLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Join my trip: ${tripTitle}`);
    const body = encodeURIComponent(
      `Hey! I'd love for you to join my trip "${tripTitle}".\n\n` +
      `Use this code to join: ${tripCode}\n\n` +
      `Or click this link: ${tripLink}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my trip: ${tripTitle}`,
          text: `Join my trip "${tripTitle}" using code: ${tripCode}`,
          url: tripLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="glass-panel p-6 m-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gradient-text">Share Trip</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/60 rounded-lg transition"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>

              {/* Trip Code Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Trip Code
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 text-center text-2xl font-bold tracking-widest bg-white/60 rounded-xl border border-white/40">
                    {tripCode}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyCode}
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
                <p className="text-sm text-slate-600 mt-2">
                  Share this code with others to let them join your trip
                </p>
              </div>

              {/* Trip Link Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Trip Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tripLink}
                    readOnly
                    className="flex-1 px-4 py-2 text-sm bg-white/40 rounded-xl border border-white/40 text-slate-600"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyLink}
                    className="btn-secondary flex items-center gap-2"
                  >
                    {linkCopied ? (
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

              {/* Share Options */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareViaEmail}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/60 hover:bg-white/80 rounded-xl font-medium text-slate-700 transition"
                >
                  <Mail className="h-5 w-5" />
                  Share via Email
                </motion.button>

                {navigator.share && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={shareNative}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/60 hover:bg-white/80 rounded-xl font-medium text-slate-700 transition"
                  >
                    <Share2 className="h-5 w-5" />
                    Share
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
