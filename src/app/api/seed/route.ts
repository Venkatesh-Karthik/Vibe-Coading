import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";

/**
 * Verify the seed secret from request headers
 * Supports both x-seed-secret header and Authorization Bearer token
 */
function verifySecret(request: NextRequest): boolean {
  const SEED_SECRET = process.env.SEED_SECRET;
  
  if (!SEED_SECRET) {
    console.warn("SEED_SECRET is not configured");
    return false;
  }

  // Check x-seed-secret header
  const headerSecret = request.headers.get("x-seed-secret");
  if (headerSecret === SEED_SECRET) {
    return true;
  }

  // Check Authorization Bearer token
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (token === SEED_SECRET) {
      return true;
    }
  }

  return false;
}

/**
 * Sample data to seed into Firestore
 */
const SAMPLE_TRIPS = [
  {
    name: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    budget: 3000,
    currency: "USD",
    isPublic: true,
    description: "Explore the vibrant culture and cuisine of Tokyo",
    ownerId: "sample-user-1",
    members: ["sample-user-1"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: "European Road Trip",
    destination: "Paris, France",
    startDate: "2024-06-01",
    endDate: "2024-06-15",
    budget: 5000,
    currency: "USD",
    isPublic: true,
    description: "Multi-city adventure across Europe",
    ownerId: "sample-user-2",
    members: ["sample-user-2", "sample-user-3"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: "Bali Retreat",
    destination: "Bali, Indonesia",
    startDate: "2024-09-10",
    endDate: "2024-09-17",
    budget: 2000,
    currency: "USD",
    isPublic: false,
    description: "Relaxing beach getaway",
    ownerId: "sample-user-1",
    members: ["sample-user-1"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

const SAMPLE_ITINERARY_DAYS = [
  {
    dayNumber: 1,
    date: "2024-03-15",
    title: "Arrival & Shibuya",
    activities: [
      {
        time: "10:00",
        title: "Arrive at Narita Airport",
        description: "Take the Narita Express to Shibuya",
        location: "Narita International Airport",
      },
      {
        time: "14:00",
        title: "Explore Shibuya Crossing",
        description: "Visit the famous scramble crossing and surrounding shops",
        location: "Shibuya, Tokyo",
      },
    ],
  },
  {
    dayNumber: 2,
    date: "2024-03-16",
    title: "Cultural Tokyo",
    activities: [
      {
        time: "09:00",
        title: "Senso-ji Temple",
        description: "Visit Tokyo's oldest temple",
        location: "Asakusa, Tokyo",
      },
      {
        time: "14:00",
        title: "Tokyo Skytree",
        description: "Observation deck visit",
        location: "Sumida, Tokyo",
      },
    ],
  },
];

const SAMPLE_EXPENSES = [
  {
    description: "Hotel accommodation",
    amount: 800,
    currency: "USD",
    category: "Accommodation",
    date: "2024-03-15",
    paidBy: "sample-user-1",
    splitBetween: ["sample-user-1"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    description: "Airport transfer",
    amount: 80,
    currency: "USD",
    category: "Transportation",
    date: "2024-03-15",
    paidBy: "sample-user-1",
    splitBetween: ["sample-user-1"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    description: "Dinner at sushi restaurant",
    amount: 120,
    currency: "USD",
    category: "Food",
    date: "2024-03-15",
    paidBy: "sample-user-1",
    splitBetween: ["sample-user-1"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

/**
 * POST /api/seed
 * Seeds Firestore with sample trips, itineraries, and expenses
 * Requires SEED_SECRET to be provided via x-seed-secret header or Authorization Bearer
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret
    if (!verifySecret(request)) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing seed secret" },
        { status: 401 }
      );
    }

    // Initialize Firestore
    const db = getFirestore();
    const tripIds: string[] = [];

    // Create trips with subcollections
    for (const tripData of SAMPLE_TRIPS) {
      // Create trip document
      const tripRef = await db.collection("trips").add(tripData);
      tripIds.push(tripRef.id);

      // Add itinerary days (only for first trip as sample)
      if (tripIds.length === 1) {
        for (const day of SAMPLE_ITINERARY_DAYS) {
          await tripRef.collection("itinerary").add(day);
        }

        // Add expenses
        for (const expense of SAMPLE_EXPENSES) {
          await tripRef.collection("expenses").add(expense);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Firestore seeded successfully",
      tripIds,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    return NextResponse.json(
      {
        error: "Failed to seed Firestore",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seed
 * Returns information about the seed endpoint
 */
export async function GET(request: NextRequest) {
  // Verify secret for GET as well (optional, but recommended)
  if (!verifySecret(request)) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing seed secret" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    endpoint: "/api/seed",
    method: "POST",
    description: "Seeds Firestore with sample trips, itineraries, and expenses",
    authentication: "Requires SEED_SECRET via x-seed-secret header or Authorization Bearer",
    sampleData: {
      trips: SAMPLE_TRIPS.length,
      itineraryDays: SAMPLE_ITINERARY_DAYS.length,
      expenses: SAMPLE_EXPENSES.length,
    },
  });
}
