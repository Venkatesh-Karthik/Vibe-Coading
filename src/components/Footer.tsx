"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe2, Heart, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white/30 backdrop-blur-sm border-t border-white/30 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Globe2 className="h-6 w-6 text-sky-500" />
              <span className="text-lg font-extrabold text-slate-900">
                TripMosaic<span className="gradient-text">+</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-sm">
              Plan. Travel. Relive. Group trips made simple with collaborative 
              planning, expense tracking, and shared memories.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-600 hover:text-sky-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-600 hover:text-pink-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Github className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                  Explore Destinations
                </Link>
              </li>
              <li>
                <Link href="/organizer/new" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                  Create a Trip
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                  Join with TripCode
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} TripMosaic+. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> for travelers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
