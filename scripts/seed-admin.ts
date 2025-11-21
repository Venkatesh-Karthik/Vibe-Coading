/**
 * Admin Seed Script for Firestore
 * 
 * This script seeds Firestore with sample trips, itineraries, and expenses
 * using the Firebase Admin SDK directly (server-side).
 * 
 * Prerequisites:
 * 1. Set GOOGLE_APPLICATION_CREDENTIALS environment variable to point to your service account JSON file
 *    export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
 * 2. Or place the service account JSON in the root directory and name it appropriately
 * 
 * Usage:
 *   ts-node scripts/seed-admin.ts
 *   OR
 *   npx tsx scripts/seed-admin.ts
 * 
 * Note: This script is for local development. For production/Vercel, use the /api/seed endpoint.
 */

import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
function initializeAdmin() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  // Check if GOOGLE_APPLICATION_CREDENTIALS is set
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error(
      "❌ Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set."
    );
    console.error(
      "   Please set it to the path of your Firebase service account JSON file:"
    );
    console.error(
      '   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"'
    );
    process.exit(1);
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error);
    process.exit(1);
  }
}

// Sample data
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

// Main seed function
async function seedFirestore() {
  console.log("🌱 Starting Firestore seeding...\n");

  const app = initializeAdmin();
  const db = admin.firestore(app);

  const tripIds: string[] = [];

  try {
    // Create trips with subcollections
    for (const tripData of SAMPLE_TRIPS) {
      console.log(`📝 Creating trip: ${tripData.name}`);
      
      // Create trip document
      const tripRef = await db.collection("trips").add(tripData);
      tripIds.push(tripRef.id);
      console.log(`   ✅ Trip created with ID: ${tripRef.id}`);

      // Add itinerary days (only for first trip as sample)
      if (tripIds.length === 1) {
        console.log(`   📅 Adding ${SAMPLE_ITINERARY_DAYS.length} itinerary days...`);
        for (const day of SAMPLE_ITINERARY_DAYS) {
          await tripRef.collection("itinerary").add(day);
        }
        console.log(`   ✅ Itinerary days added`);

        // Add expenses
        console.log(`   💰 Adding ${SAMPLE_EXPENSES.length} expenses...`);
        for (const expense of SAMPLE_EXPENSES) {
          await tripRef.collection("expenses").add(expense);
        }
        console.log(`   ✅ Expenses added`);
      }
      
      console.log("");
    }

    console.log("✅ Firestore seeding completed successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   - Trips created: ${tripIds.length}`);
    console.log(`   - Trip IDs: ${tripIds.join(", ")}`);
    console.log(`   - Itinerary days added: ${SAMPLE_ITINERARY_DAYS.length} (to first trip)`);
    console.log(`   - Expenses added: ${SAMPLE_EXPENSES.length} (to first trip)`);
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding Firestore:", error);
    process.exit(1);
  }
}

// Run the seed function
seedFirestore();
