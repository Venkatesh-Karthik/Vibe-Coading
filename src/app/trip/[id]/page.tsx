"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTripById } from "@/utils/mockData";
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

    // Get trip data from mock data
    const trip = getTripById(tripId);

    if (!trip) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="glass-panel p-8">
                    <p className="text-slate-600">Trip not found</p>
                    <button
                        onClick={() => router.push("/explore")}
                        className="mt-4 btn-secondary"
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
                        onClick={() => router.push("/explore")}
                        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Back to Explore</span>
                    </button>

                    {/* Trip Header */}
                    <TripHeader trip={trip} />

                    {/* Tab Navigation */}
                    <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === "overview" && <OverviewTab trip={trip} />}
                        {activeTab === "planner" && (
                            <PlannerTab
                                tripId={trip.id}
                                startDate={trip.startDate}
                                endDate={trip.endDate}
                            />
                        )}
                        {activeTab === "expenses" && (
                            <ExpensesTab tripId={trip.id} budget={trip.budget} />
                        )}
                        {activeTab === "members" && (
                            <MembersTab tripId={trip.id} tripCode={trip.tripCode} />
                        )}
                        {activeTab === "memories" && <MemoriesTab tripId={trip.id} />}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
