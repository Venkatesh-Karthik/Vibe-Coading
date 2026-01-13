"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTripById, getTripMemberCount } from "@/lib/trips";
import type { Trip } from "@/types/database";
import TripHeader from "@/components/trip/TripHeader";
import TabNavigation, { TabType } from "@/components/trip/TabNavigation";
import OverviewTab from "@/components/trip/OverviewTab";
import PlannerTab from "@/components/trip/PlannerTab";
import ExpensesTab from "@/components/trip/ExpensesTab";
import MembersTab from "@/components/trip/MembersTab";
import MemoriesTab from "@/components/trip/MemoriesTab";
import Footer from "@/components/Footer";

export default function TripPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const tripId = params.id;

    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [memberCount, setMemberCount] = useState(1);

    // Fetch trip data from Supabase
    useEffect(() => {
        async function fetchTripData() {
            if (!tripId) return;
            
            setLoading(true);
            try {
                const { data, error } = await getTripById(tripId);
                
                if (error || !data) {
                    console.error('Error fetching trip:', error);
                    setTrip(null);
                } else {
                    setTrip(data);
                    
                    // Fetch member count
                    const count = await getTripMemberCount(tripId);
                    setMemberCount(count);
                }
            } catch (err) {
                console.error('Error loading trip:', err);
                setTrip(null);
            } finally {
                setLoading(false);
            }
        }

        fetchTripData();
    }, [tripId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="glass-panel p-8">
                    <div className="animate-pulse text-slate-600">Loading trip...</div>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="glass-panel p-8 text-center">
                    <p className="text-slate-600 mb-4">Trip not found</p>
                    <button
                        onClick={() => router.push("/explore")}
                        className="btn-secondary"
                    >
                        Back to Explore
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col pt-24">
            <main className="flex-1 px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    {/* Trip Header */}
                    <TripHeader trip={trip} memberCount={memberCount} />

                    {/* Tab Navigation */}
                    <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === "overview" && <OverviewTab trip={trip} memberCount={memberCount} />}
                        {activeTab === "planner" && (
                            <PlannerTab
                                tripId={trip.id}
                                startDate={trip.start_date || ''}
                                endDate={trip.end_date || ''}
                            />
                        )}
                        {activeTab === "expenses" && (
                            <ExpensesTab tripId={trip.id} budget={trip.budget || 0} />
                        )}
                        {activeTab === "members" && (
                            <MembersTab tripId={trip.id} tripCode={trip.join_code || undefined} />
                        )}
                        {activeTab === "memories" && <MemoriesTab tripId={trip.id} />}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
