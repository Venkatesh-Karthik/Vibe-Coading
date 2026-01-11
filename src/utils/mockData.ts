// Mock data for TripMosaic+ extended features

export type TripStatus = "planning" | "active" | "completed";
export type TripType = "Adventure" | "Family" | "Solo" | "Group" | "Romantic" | "Luxury";

export interface MockTrip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  travelers: number;
  status: TripStatus;
  type: TripType[];
  budget: number;
  organizer: string;
  organizerId: string;
  description: string;
  isPublic: boolean;
  tripCode?: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: "organizer" | "member";
  responsibilities?: string[];
}

export interface MockExpense {
  id: string;
  title: string;
  amount: number;
  category: "travel" | "stay" | "food" | "activities" | "shopping" | "other";
  date: string;
  paidBy: string;
  splitBetween: string[];
  description: string;
}

export interface MockActivity {
  id: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  cost: number;
  category: "food" | "sightseeing" | "transport" | "hotel" | "activity";
  notes: string;
  day: number;
}

export interface MockMemory {
  id: string;
  photoUrl: string;
  caption: string;
  taggedMembers: string[];
  date: string;
  likes: number;
  comments: number;
}

export interface MockNotification {
  id: string;
  type: "invite" | "expense" | "itinerary" | "memory" | "join_request" | "approval";
  message: string;
  tripName: string;
  tripId: string;
  time: string;
  read: boolean;
  actionable: boolean;
}

// Mock trips data
export const mockTrips: MockTrip[] = [
  {
    id: "trip-1",
    name: "Goa Beach Getaway",
    destination: "Goa, India",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    coverImage: "/images/goa.jpg",
    travelers: 8,
    status: "active",
    type: ["Group", "Adventure"],
    budget: 15000,
    organizer: "John Doe",
    organizerId: "user-1",
    description: "A fun beach trip with friends",
    isPublic: true,
    tripCode: "GOA2024",
  },
  {
    id: "trip-2",
    name: "Manali Adventure",
    destination: "Manali, Himachal Pradesh",
    startDate: "2024-04-10",
    endDate: "2024-04-17",
    coverImage: "/images/manali.jpg",
    travelers: 12,
    status: "planning",
    type: ["Adventure", "Group"],
    budget: 25000,
    organizer: "Sarah Smith",
    organizerId: "user-2",
    description: "Trekking and adventure in the mountains",
    isPublic: true,
    tripCode: "MNL2024",
  },
  {
    id: "trip-3",
    name: "Kerala Backwaters",
    destination: "Alleppey, Kerala",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    coverImage: "/images/kerala.jpg",
    travelers: 6,
    status: "completed",
    type: ["Family", "Romantic"],
    budget: 30000,
    organizer: "Mike Johnson",
    organizerId: "user-3",
    description: "Relaxing houseboat experience",
    isPublic: true,
  },
  {
    id: "trip-4",
    name: "Rajasthan Heritage Tour",
    destination: "Jaipur, Rajasthan",
    startDate: "2024-05-01",
    endDate: "2024-05-07",
    coverImage: "/images/rajasthan.jpg",
    travelers: 10,
    status: "planning",
    type: ["Family", "Luxury"],
    budget: 40000,
    organizer: "Emily Davis",
    organizerId: "user-4",
    description: "Explore the royal heritage of Rajasthan",
    isPublic: true,
    tripCode: "RAJ2024",
  },
  {
    id: "trip-5",
    name: "Ladakh Bike Trip",
    destination: "Leh-Ladakh",
    startDate: "2024-06-15",
    endDate: "2024-06-25",
    coverImage: "/images/ladakh.jpg",
    travelers: 15,
    status: "planning",
    type: ["Adventure", "Group"],
    budget: 35000,
    organizer: "David Wilson",
    organizerId: "user-5",
    description: "Epic motorcycle journey through the Himalayas",
    isPublic: true,
    tripCode: "LEH2024",
  },
  {
    id: "trip-6",
    name: "Pondicherry Weekend",
    destination: "Pondicherry",
    startDate: "2024-03-08",
    endDate: "2024-03-10",
    coverImage: "/images/pondicherry.jpg",
    travelers: 4,
    status: "active",
    type: ["Romantic", "Group"],
    budget: 10000,
    organizer: "Anna Brown",
    organizerId: "user-6",
    description: "French vibes and beach relaxation",
    isPublic: false,
  },
];

// Mock users
export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    photoUrl: "/images/avatar1.jpg",
    role: "organizer",
    responsibilities: ["Booking", "Transport"],
  },
  {
    id: "user-2",
    name: "Sarah Smith",
    email: "sarah@example.com",
    photoUrl: "/images/avatar2.jpg",
    role: "member",
    responsibilities: ["Food", "Photography"],
  },
  {
    id: "user-3",
    name: "Mike Johnson",
    email: "mike@example.com",
    photoUrl: "/images/avatar3.jpg",
    role: "member",
    responsibilities: ["Navigation"],
  },
];

// Mock activities
export const mockActivities: MockActivity[] = [
  {
    id: "act-1",
    title: "Beach Hopping",
    location: "Baga Beach",
    startTime: "09:00",
    endTime: "12:00",
    cost: 500,
    category: "sightseeing",
    notes: "Visit Baga, Calangute, and Anjuna beaches",
    day: 1,
  },
  {
    id: "act-2",
    title: "Lunch at Fisherman's Wharf",
    location: "Fisherman's Wharf",
    startTime: "13:00",
    endTime: "14:30",
    cost: 800,
    category: "food",
    notes: "Try the Goan fish curry",
    day: 1,
  },
  {
    id: "act-3",
    title: "Water Sports",
    location: "Calangute Beach",
    startTime: "15:00",
    endTime: "17:00",
    cost: 2000,
    category: "activity",
    notes: "Parasailing and jet skiing",
    day: 1,
  },
];

// Mock expenses
export const mockExpenses: MockExpense[] = [
  {
    id: "exp-1",
    title: "Hotel Booking",
    amount: 12000,
    category: "stay",
    date: "2024-03-15",
    paidBy: "user-1",
    splitBetween: ["user-1", "user-2", "user-3"],
    description: "3 nights stay at Beach Resort",
  },
  {
    id: "exp-2",
    title: "Dinner at Thalassa",
    amount: 3500,
    category: "food",
    date: "2024-03-15",
    paidBy: "user-2",
    splitBetween: ["user-1", "user-2", "user-3"],
    description: "Greek restaurant with beach view",
  },
  {
    id: "exp-3",
    title: "Cab to airport",
    amount: 800,
    category: "travel",
    date: "2024-03-20",
    paidBy: "user-3",
    splitBetween: ["user-1", "user-2", "user-3"],
    description: "Return journey to airport",
  },
];

// Mock memories
export const mockMemories: MockMemory[] = [
  {
    id: "mem-1",
    photoUrl: "/images/memory1.jpg",
    caption: "Sunset at Baga Beach! 🌅",
    taggedMembers: ["user-1", "user-2"],
    date: "2024-03-15",
    likes: 24,
    comments: 5,
  },
  {
    id: "mem-2",
    photoUrl: "/images/memory2.jpg",
    caption: "Water sports adventure! 🏄‍♂️",
    taggedMembers: ["user-1", "user-2", "user-3"],
    date: "2024-03-15",
    likes: 18,
    comments: 3,
  },
];

// Mock notifications
export const mockNotifications: MockNotification[] = [
  {
    id: "notif-1",
    type: "invite",
    message: "You've been invited to join 'Goa Beach Getaway'",
    tripName: "Goa Beach Getaway",
    tripId: "trip-1",
    time: "2 hours ago",
    read: false,
    actionable: true,
  },
  {
    id: "notif-2",
    type: "expense",
    message: "Sarah added an expense of ₹3,500 for Dinner",
    tripName: "Goa Beach Getaway",
    tripId: "trip-1",
    time: "5 hours ago",
    read: false,
    actionable: false,
  },
  {
    id: "notif-3",
    type: "memory",
    message: "John uploaded 8 new photos to memories",
    tripName: "Goa Beach Getaway",
    tripId: "trip-1",
    time: "1 day ago",
    read: true,
    actionable: false,
  },
];

// Helper functions
export function getTripById(id: string): MockTrip | undefined {
  return mockTrips.find((trip) => trip.id === id);
}

export function getTripsByStatus(status: TripStatus): MockTrip[] {
  return mockTrips.filter((trip) => trip.status === status);
}

export function getUserById(id: string): MockUser | undefined {
  return mockUsers.find((user) => user.id === id);
}

export function getUnreadNotifications(): MockNotification[] {
  return mockNotifications.filter((n) => !n.read);
}
