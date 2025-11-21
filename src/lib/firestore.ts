/**
 * Client-side Firestore helper functions
 * Uses the Firebase client SDK for browser-based operations
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";

// Types for our data structures
export interface Trip {
  id?: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  isPublic: boolean;
  description?: string;
  ownerId: string;
  members: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ItineraryDay {
  id?: string;
  dayNumber: number;
  date: string;
  title: string;
  activities: Activity[];
}

export interface Activity {
  time: string;
  title: string;
  description?: string;
  location?: string;
}

export interface Expense {
  id?: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  paidBy: string;
  splitBetween: string[];
  createdAt?: Date;
}

/**
 * Create a new trip
 */
export async function createTrip(tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const now = Timestamp.now();
    const tripRef = await addDoc(collection(db, "trips"), {
      ...tripData,
      createdAt: now,
      updatedAt: now,
    });
    return tripRef.id;
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
}

/**
 * Update trip metadata (name, description, dates, budget, etc.)
 */
export async function updateTripMeta(
  tripId: string,
  updates: Partial<Omit<Trip, "id" | "createdAt" | "updatedAt" | "ownerId">>
): Promise<void> {
  try {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
}

/**
 * Add an itinerary day to a trip
 */
export async function addItineraryDay(
  tripId: string,
  dayData: Omit<ItineraryDay, "id">
): Promise<string> {
  try {
    const itineraryRef = collection(db, "trips", tripId, "itinerary");
    const docRef = await addDoc(itineraryRef, dayData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding itinerary day:", error);
    throw error;
  }
}

/**
 * Add an expense to a trip
 */
export async function addExpense(
  tripId: string,
  expenseData: Omit<Expense, "id" | "createdAt">
): Promise<string> {
  try {
    const expensesRef = collection(db, "trips", tripId, "expenses");
    const docRef = await addDoc(expensesRef, {
      ...expenseData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
}

/**
 * Get all trips for a specific user (as owner or member)
 */
export async function getTripsForUser(userId: string): Promise<Trip[]> {
  try {
    // Query trips where user is owner
    const ownerQuery = query(
      collection(db, "trips"),
      where("ownerId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const ownerSnapshot = await getDocs(ownerQuery);
    
    // Query trips where user is a member
    const memberQuery = query(
      collection(db, "trips"),
      where("members", "array-contains", userId),
      orderBy("createdAt", "desc")
    );
    const memberSnapshot = await getDocs(memberQuery);

    // Combine results and remove duplicates
    const tripsMap = new Map<string, Trip>();
    
    ownerSnapshot.forEach((doc) => {
      tripsMap.set(doc.id, {
        id: doc.id,
        ...doc.data(),
      } as Trip);
    });

    memberSnapshot.forEach((doc) => {
      if (!tripsMap.has(doc.id)) {
        tripsMap.set(doc.id, {
          id: doc.id,
          ...doc.data(),
        } as Trip);
      }
    });

    return Array.from(tripsMap.values());
  } catch (error) {
    console.error("Error getting trips for user:", error);
    throw error;
  }
}

/**
 * Get a single trip by ID
 */
export async function getTripById(tripId: string): Promise<Trip | null> {
  try {
    const tripRef = doc(db, "trips", tripId);
    const tripSnap = await getDoc(tripRef);
    
    if (tripSnap.exists()) {
      return {
        id: tripSnap.id,
        ...tripSnap.data(),
      } as Trip;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting trip:", error);
    throw error;
  }
}

/**
 * Add a member to a trip
 */
export async function addMemberToTrip(tripId: string, userId: string): Promise<void> {
  try {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, {
      members: arrayUnion(userId),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding member to trip:", error);
    throw error;
  }
}

/**
 * Get all itinerary days for a trip
 */
export async function getItineraryDays(tripId: string): Promise<ItineraryDay[]> {
  try {
    const itineraryRef = collection(db, "trips", tripId, "itinerary");
    const q = query(itineraryRef, orderBy("dayNumber", "asc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ItineraryDay));
  } catch (error) {
    console.error("Error getting itinerary days:", error);
    throw error;
  }
}

/**
 * Get all expenses for a trip
 */
export async function getExpenses(tripId: string): Promise<Expense[]> {
  try {
    const expensesRef = collection(db, "trips", tripId, "expenses");
    const q = query(expensesRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Expense));
  } catch (error) {
    console.error("Error getting expenses:", error);
    throw error;
  }
}

/**
 * Get public trips (for explore page)
 */
export async function getPublicTrips(limit: number = 20): Promise<Trip[]> {
  try {
    const q = query(
      collection(db, "trips"),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Trip));
  } catch (error) {
    console.error("Error getting public trips:", error);
    throw error;
  }
}
