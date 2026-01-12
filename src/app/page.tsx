"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, CreditCard, Camera, MapPin, Users, Star } from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pt-24">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
            >
              <span className="text-slate-900">Plan. Travel.</span>
              <br />
              <span className="gradient-text">Relive.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-lg text-slate-600 max-w-xl"
            >
              Discover curated trips, build day-wise itineraries, split expenses, 
              and relive memories together — all in one place.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <Link href="/organizer/new" className="btn-primary">
                Start as Organizer
              </Link>
              <Link href="/explore" className="btn-secondary">
                Explore Trips
              </Link>
              <Link href="/join" className="btn-tertiary">
                Join with TripCode
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Glass Dashboard Mock */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="glass-panel p-6">
              {/* Mock Trip Cards */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">Goa Beach Getaway</h4>
                    <p className="text-sm text-slate-500">5 days • 8 travelers</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Active</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">Manali Adventure</h4>
                    <p className="text-sm text-slate-500">7 days • 12 travelers</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Planning</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">Kerala Backwaters</h4>
                    <p className="text-sm text-slate-500">4 days • 6 travelers</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-sky-600 bg-sky-100 px-2 py-1 rounded-full">Completed</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-20 h-20 glass-panel flex items-center justify-center"
            >
              <Calendar className="h-8 w-8 text-sky-500" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 w-20 h-20 glass-panel flex items-center justify-center"
            >
              <CreditCard className="h-8 w-8 text-emerald-500" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="px-4 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Everything you need for the{" "}
              <span className="gradient-text">perfect trip</span>
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              From planning to memories, TripMosaic+ handles it all with style.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Calendar}
              title="Dynamic Planner"
              description="Drag-and-drop day cards, live map integration, and real-time comments for collaborative planning."
              delay={0.1}
              href="/planner"
            />
            <FeatureCard
              icon={CreditCard}
              title="Collaborative Expenses"
              description="Track shared expenses, auto-split costs, and settle up with suggested transfers."
              delay={0.2}
              href="/expenses"
            />
            <FeatureCard
              icon={Camera}
              title="Memory Wall"
              description="Upload photos & videos, highlight top moments, and relive your favorite group memories."
              delay={0.3}
              href="/memories"
            />
          </div>
        </div>
      </section>

      {/* Organizer Features Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Organizer Tools
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Powerful features to make trip organizing effortless.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Dynamic Trip Planner Mock */}
            <Link href="/organizer/itinerary">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-panel p-6 cursor-pointer"
              >
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-sky-500" />
                  Day-wise Itinerary
                </h3>
                <div className="space-y-3">
                  {["Day 1: Arrival & Check-in", "Day 2: City Tour", "Day 3: Free Exploration"].map((day, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/60"
                    >
                      <div className="w-2 h-8 rounded-full bg-gradient-to-b from-sky-400 to-sky-500" />
                      <span className="text-sm font-medium text-slate-700">{day}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Link>

            {/* Expense Tracker Mock */}
            <Link href="/organizer/expenses">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-panel p-6 cursor-pointer"
              >
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-500" />
                  Expense Tracker
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/60">
                    <span className="text-sm text-slate-700">John</span>
                    <span className="text-sm font-semibold text-emerald-600">+₹2,500</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/60">
                    <span className="text-sm text-slate-700">Sarah</span>
                    <span className="text-sm font-semibold text-rose-600">-₹1,200</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/60">
                    <span className="text-sm text-slate-700">Mike</span>
                    <span className="text-sm font-semibold text-rose-600">-₹1,300</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold"
                    onClick={(e) => e.preventDefault()}
                  >
                    Settle Up
                  </motion.button>
                </div>
              </motion.div>
            </Link>

            {/* Memory Wall Mock */}
            <Link href="/organizer/memories">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-panel p-6 cursor-pointer"
              >
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-500" />
                  Memory Wall
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="aspect-square rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-purple-400/20" />
                      {i === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Camera className="h-6 w-6 text-white/80" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-500 text-center">
                  Relive your favorite group moments with shared galleries.
                </p>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-sky-500/10 to-emerald-500/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to plan your next adventure?
          </h2>
          <p className="text-slate-600 mb-8">
            Join thousands of travelers who plan, travel, and relive their trips with TripMosaic+.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/organizer/new" className="btn-primary">
              Get Started Free
            </Link>
            <Link href="/explore" className="btn-secondary">
              Browse Destinations
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
