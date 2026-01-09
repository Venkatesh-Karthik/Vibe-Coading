# TripMosaic+ (VYNTRA)

A beautiful, glassmorphism-styled group trip planner with Firebase auth, Explore destinations, organizer tools, and smooth animations — fully responsive and deployable on Vercel.

## Features

- 🎨 **Glassmorphism UI** - Modern, translucent design with blur effects
- 🔐 **Firebase Authentication** - Secure Google login integration
- 🗺️ **Explore Destinations** - Browse curated travel destinations
- 📅 **Dynamic Trip Planner** - Drag-and-drop day-wise itinerary
- 💰 **Collaborative Expenses** - Split costs and settle up with friends
- 📸 **Memory Wall** - Share photos and relive trip memories
- 📱 **Fully Responsive** - Works beautifully on mobile and desktop
- ⚡ **Smooth Animations** - Powered by Framer Motion

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth + Firestore + Storage)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn
- Firebase project (for authentication and database)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Vibe-Coading
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Run TypeScript type checking

## Deploying to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
4. Deploy!

## Project Structure

```
TripMosaic+ /
 ├─ public/
 │   └─ images/              # Destination images
 ├─ src/
 │   ├─ app/
 │   │   ├─ layout.tsx       # Root layout with providers
 │   │   ├─ globals.css      # Global styles
 │   │   ├─ page.tsx         # Home page
 │   │   ├─ explore/         # Explore destinations
 │   │   ├─ join/            # Join trip with code
 │   │   ├─ organizer/       # Trip organizer pages
 │   │   └─ trip/            # Trip detail pages
 │   ├─ components/
 │   │   ├─ Navbar.tsx       # Glassmorphism navbar
 │   │   ├─ DestinationCard.tsx
 │   │   ├─ FeatureCard.tsx
 │   │   ├─ Footer.tsx
 │   │   └─ Expenses.tsx
 │   └─ lib/
 │       ├─ firebase.ts      # Firebase initialization
 │       ├─ auth-context.tsx # Auth provider
 │       └─ ClientProviders.tsx
 ├─ .env.local               # Environment variables (create this)
 ├─ tailwind.config.js
 ├─ next.config.mjs
 ├─ package.json
 └─ README.md
```

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Google Authentication in Firebase Auth
3. Create a Firestore database
4. Enable Firebase Storage (optional, for photo uploads)
5. Copy your Firebase config to `.env.local`

## Firestore Rules

Deploy the included `firestore.rules` to your Firebase project:

```bash
firebase deploy --only firestore:rules
```

The rules enforce:
- Authenticated users can create trips (with themselves as owner)
- Public trips are readable by anyone
- Private trips are only readable by owner and members
- Subcollections (itinerary, expenses) inherit parent trip permissions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
