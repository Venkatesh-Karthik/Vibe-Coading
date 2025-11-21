import dynamic from "next/dynamic";
const Expenses = dynamic(() => import("@/components/Expenses"), { ssr: false });

export default function TripPage() {
  // This is a placeholder page. In a real app, this would redirect to /trip/[id]
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Trips</h1>
      <p className="text-slate-600">View your trips at /trip/[tripId]</p>
    </div>
  );
}
