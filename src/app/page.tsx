"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, MapPin, DollarSign, Calendar, Sparkles, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 px-6">
          {/* Animated background gradients */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                Plan Perfect
                <br />
                <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                  Group Trips
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                Collaborate with friends, organize itineraries, split expenses, and create unforgettable memories together.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/explore"
                  className="px-8 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Explore Destinations
                </Link>
                <Link
                  href="/organizer"
                  className="px-8 py-4 glass-panel rounded-2xl font-semibold text-slate-900 hover:scale-105 transition-all duration-300"
                >
                  Start Planning
                </Link>
              </div>
            </motion.div>

            {/* Animated Glass Dashboard Mock */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-20 relative"
            >
              <div className="glass-panel rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DashboardCard icon={Users} label="Team Members" value="8" />
                  <DashboardCard icon={MapPin} label="Destinations" value="5" />
                  <DashboardCard icon={DollarSign} label="Budget Saved" value="$2.4k" />
                </div>
                <div className="mt-6 h-48 rounded-2xl bg-gradient-to-br from-sky-100/50 to-emerald-100/50 border border-white/40 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto text-sky-500 mb-3" />
                    <p className="text-slate-600 font-medium">Your trip insights here</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                All the tools to plan, organize, and enjoy amazing group adventures
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Users}
                title="Collaborative Planning"
                description="Invite friends, vote on activities, and plan together in real-time with seamless collaboration tools."
                index={0}
              />
              <FeatureCard
                icon={Calendar}
                title="Smart Itineraries"
                description="Create day-by-day schedules with drag-and-drop simplicity. Never miss a moment of your adventure."
                index={1}
              />
              <FeatureCard
                icon={DollarSign}
                title="Expense Splitting"
                description="Track group spending and split bills fairly. Transparent budgeting for stress-free travel."
                index={2}
              />
              <FeatureCard
                icon={MapPin}
                title="Destination Discovery"
                description="Explore curated destinations and hidden gems recommended by fellow travelers."
                index={3}
              />
              <FeatureCard
                icon={Globe}
                title="Multi-Currency Support"
                description="Handle expenses in any currency with automatic conversion and fair splitting."
                index={4}
              />
              <FeatureCard
                icon={Sparkles}
                title="Beautiful Design"
                description="Enjoy a gorgeous glassmorphism UI that makes trip planning feel like a breeze."
                index={5}
              />
            </div>
          </div>
        </section>

        {/* Organizer Feature Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent to-white/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel rounded-3xl p-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Organize Your Next Adventure?
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Start planning your dream trip today. It's free, easy, and fun!
              </p>
              <Link
                href="/organizer/new"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                Create Your Trip
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function DashboardCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/60">
      <Icon className="w-8 h-8 text-sky-500 mb-3" />
      <p className="text-sm text-slate-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
