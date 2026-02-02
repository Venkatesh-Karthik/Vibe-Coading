# TripMosaic+ (VYNTRA)

A beautiful, glassmorphism-styled group trip planner with Supabase backend for real-time collaboration. Explore destinations, organize trips, manage expenses, and share memories — fully responsive and deployable on Vercel.

## Features

- 🎨 **Glassmorphism UI** - Modern, translucent design with blur effects
- 🔐 **Supabase Authentication** - Secure Google OAuth login integration
- 🗺️ **Explore Destinations** - Browse curated travel destinations
- 📅 **Dynamic Trip Planner** - Real-time collaborative itinerary planning
- 💰 **Collaborative Expenses** - Split costs and settle up with automatic calculations
- 📸 **Memory Wall** - Upload and share photos/videos with cloud storage
- 🌤️ **Weather Integration** - Real-time weather data for destinations (OpenWeather API)
- 🔗 **Smart Trip Sharing** - Copy/share trip codes via email or native share
- 👥 **Interactive Trip Dashboard** - Click to explore destination, itinerary, members
- 📱 **Fully Responsive** - Works beautifully on mobile and desktop
- ⚡ **Smooth Animations** - Powered by Framer Motion
- 🔄 **Real-time Updates** - Live collaboration with Supabase Realtime
- ⏱️ **Live Countdown Timer** - Real-time countdown to trip start/end with seconds precision
- 🎯 **Next Planned Activity** - Smart widget showing your upcoming activity with live updates

### New: Interactive Trip Dashboard Header

The trip dashboard header now features fully interactive elements:

- **Clickable Destination**: Opens a dedicated page with map, weather, and local info
- **Clickable Date Range**: Navigates to the full itinerary with day-by-day activities
- **Clickable Travelers**: Shows members page with invite functionality
- **Share Button**: Opens modal for easy trip code and link sharing

See [TRIP_HEADER_UPGRADE.md](./TRIP_HEADER_UPGRADE.md) for detailed documentation.

### New: Live Countdown Timer & Next Planned Activity

The trip overview dashboard now includes two intelligent widgets that connect to live Supabase data:

#### Live Countdown Timer
- **Real-time Updates**: Counts down to trip start (for planning trips) or trip end (for active trips) with live seconds precision
- **Graceful Handling**: Automatically handles missing, invalid, or past dates with appropriate messaging
- **Smart Display**: Shows "Time until departure" for planning trips, "Time remaining" for active trips, and celebration message for completed trips
- **Edge Cases**: Works correctly even when dates are null or invalid

#### Next Planned Activity Widget
- **Smart Detection**: Automatically identifies the next upcoming activity from your trip itinerary
- **Live Data**: Fetches activities directly from Supabase `activities` and `itinerary_days` tables
- **Rich Display**: Shows activity title, location, time, cost, and day number
- **Auto-refresh**: Updates every minute to keep the "next" activity accurate
- **Professional Empty State**: Clean UI when no upcoming activities are scheduled
- **Real-time Activity Count**: The quick stats now show the actual number of activities loaded from the database

These features integrate seamlessly with the existing trip planner and provide at-a-glance information about your upcoming adventures.

**Technical Implementation:**
- `src/lib/activities.ts` - Service layer for fetching and filtering activities
- `src/hooks/useCountdown.ts` - Reusable countdown hook with edge case handling
- `src/hooks/useNextPlannedActivity.ts` - Hook for fetching next activity with auto-refresh
- `src/components/trip/NextActivityWidget.tsx` - Next activity display component
- Updated `src/components/trip/OverviewTab.tsx` - Integrated both features into the overview

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase (Auth + PostgreSQL + Storage + Realtime)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn
- Supabase project (for authentication, database, and storage)

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

3. Create a `.env.local` file in the root directory with your Supabase configuration:
   ```env
   # Supabase Configuration (REQUIRED)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # OpenWeather API Key (OPTIONAL - for real-time weather features)
   # Get a free API key at: https://openweathermap.org/api
   # Features enabled: Real-time weather display on trip overview and destination pages
   # Weather data includes: temperature, conditions, high/low, humidity, wind speed
   # Data is cached for 10 minutes to minimize API calls
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key

   # Google Maps API Key (OPTIONAL - for maps)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Set up Supabase:
   
   a. **Create a Supabase Project**:
      - Go to [https://supabase.com](https://supabase.com)
      - Create a new project
      - Copy your project URL and anon key to `.env.local`
   
   b. **Run Database Schema**:
      - Go to the SQL Editor in your Supabase dashboard
      - Copy and paste the contents of `supabase/schema.sql`
      - Run the SQL to create all tables and RLS policies
   
   c. **Setup Storage**:
      - Go to Storage in your Supabase dashboard
      - Create a new bucket named `memories`
      - Set it to public or configure appropriate policies
   
   d. **Enable Google OAuth**:
      - Go to Authentication > Providers in Supabase
      - Enable Google provider
      - Add your OAuth credentials from Google Cloud Console
      - Add authorized redirect URLs (e.g., `http://localhost:3000/auth/callback`)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Run TypeScript type checking
- `./test-trip-header.sh` - Test trip header upgrade features

## Deploying to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update the OAuth redirect URL in Supabase to include your Vercel domain
5. Deploy!

## Project Structure

```
TripMosaic+ /
 ├─ public/
 │   └─ images/              # Destination images
 ├─ src/
 │   ├─ app/
 │   │   ├─ layout.tsx       # Root layout with providers
 │   │   ├─ globals.css      # Global styles
 │   │   ├─ page.tsx         # Home page (uses demo data for showcase)
 │   │   ├─ auth/callback/   # OAuth callback handler
 │   │   ├─ explore/         # Explore destinations (real Supabase data)
 │   │   ├─ planner/         # Dynamic trip planner
 │   │   ├─ memories/        # Memory wall
 │   │   ├─ join/            # Join trip with code
 │   │   ├─ organizer/       # Trip organizer pages (real Supabase data)
 │   │   └─ trip/            # Trip detail pages (real Supabase data)
 │   │       └─ [id]/
 │   │           ├─ page.tsx           # Main trip dashboard
 │   │           ├─ destination/       # NEW: Destination details page
 │   │           ├─ itinerary/         # Itinerary page (updated)
 │   │           ├─ members/           # Members page (updated)
 │   │           ├─ memories/          # Trip memories
 │   │           └─ budget/            # Budget management
 │   ├─ components/
 │   │   ├─ Navbar.tsx       # Glassmorphism navbar
 │   │   ├─ trip/
 │   │   │   ├─ TripCard.tsx       # Trip card component (uses real data)
 │   │   │   ├─ TripHeader.tsx     # Interactive trip header (updated)
 │   │   │   ├─ ShareTripModal.tsx # Trip sharing modal
 │   │   │   ├─ NextActivityWidget.tsx # NEW: Next planned activity widget
 │   │   │   ├─ OverviewTab.tsx    # UPDATED: Countdown & activity integration
 │   │   │   └─ ...                # Other trip components
 │   │   ├─ DestinationCard.tsx
 │   │   ├─ FeatureCard.tsx
 │   │   ├─ Footer.tsx
 │   │   └─ Expenses.tsx     # Expense splitting
 │   ├─ hooks/               # NEW: Custom React hooks
 │   │   ├─ useCountdown.ts       # Live countdown timer hook
 │   │   └─ useNextPlannedActivity.ts # Next activity fetching hook
 │   ├─ lib/
 │   │   ├─ supabase.ts      # Supabase client
 │   │   ├─ trips.ts         # Trip data service layer
 │   │   ├─ activities.ts    # NEW: Activity data service layer
 │   │   ├─ weather.ts       # Weather API service with caching
 │   │   ├─ auth.tsx         # Auth context
 │   │   ├─ helpers/
 │   │   │   ├─ expenses.ts  # Expense calculations
 │   │   │   └─ storage.ts   # File upload helpers
 │   │   └─ ClientProviders.tsx
 │   ├─ types/
 │   │   └─ database.ts      # TypeScript types for Supabase
 │   └─ utils/
 │       ├─ mockData.ts      # Mock data (only used on home page for demo)
 │       └─ tripHelpers.ts   # Trip utility functions
 ├─ supabase/
 │   ├─ schema.sql           # Database schema with RLS
 │   └─ migrations/          # Database migrations
 ├─ .env.local               # Environment variables (create this)
 ├─ .env.example             # Example environment variables
 ├─ TRIP_HEADER_UPGRADE.md  # NEW: Trip header feature documentation
 ├─ test-trip-header.sh     # NEW: Test script for header features
 ├─ tailwind.config.js
 ├─ next.config.mjs
 ├─ package.json
 └─ README.md
```

## Data Sources

The application uses a combination of real Supabase data and demonstration data:

### Real Supabase Data
- **Organizer Dashboard** (`/organizer`) - Fetches user's trips and displays real statistics
- **Explore Page** (`/explore`) - Shows public trips from Supabase database
- **Trip Detail Pages** (`/trip/[id]`) - Loads complete trip information from database
- **Trip Cards** - Display real trip data with status, dates, and member counts

### Demo Data
- **Home Page** (`/`) - Uses mock data for demonstration purposes to showcase the UI without requiring authentication
- The mock data is only for visual presentation and does not affect the actual application functionality

## Database Schema

The application uses the following Supabase tables:

- **users** - User profiles
- **trips** - Trip information with the following key fields:
  - `id` (uuid) - Unique trip identifier
  - `title` (text) - Name of the trip
  - `destination` (text) - Trip destination
  - `start_date` (date) - Trip start date
  - `end_date` (date) - Trip end date
  - `status` (text) - Trip status: `'planning'`, `'active'`, or `'completed'`
  - `description` (text) - Trip description
  - `is_public` (boolean) - Whether the trip is visible in the explore page
  - `budget` (numeric) - Estimated or total budget for the trip
  - `cover_image` (text) - URL to trip cover image
  - `organizer_id` (uuid) - Reference to the user who created the trip
  - `join_code` (text) - Unique code for others to join the trip
- **trip_members** - Trip memberships
- **itinerary_days** - Daily itinerary entries with `day_number` for each trip
- **activities** - Activities within itinerary days with:
  - `title` (text) - Activity name
  - `location` (text) - Where the activity takes place
  - `time` (text) - Time of activity (e.g., "09:00" or "9:00 AM")
  - `notes` (text) - Additional details
  - `cost` (numeric) - Activity cost
  - `day_id` (uuid) - Reference to the itinerary day
  - `lat`, `lng` (numeric) - Optional coordinates
- **expenses** - Trip expenses
- **expense_splits** - How expenses are split
- **memories** - Photos and videos

All tables have Row Level Security (RLS) enabled. See `supabase/schema.sql` for complete schema and policies.

### Trip Status Field

The `status` field in the trips table controls how trips are displayed:
- **planning** - Trip is being planned (default status)
- **active** - Trip is currently ongoing
- **completed** - Trip has finished

Organizers can update the status as the trip progresses.

### Database Setup

1. Go to the SQL Editor in your Supabase dashboard
2. Run the main schema: Copy and paste the contents of `supabase/schema.sql`
3. Run migrations (if updating existing database): Execute files in `supabase/migrations/` in order

## Features

### Real-time Collaboration
- Multiple users can edit the same trip simultaneously
- Changes are synchronized in real-time using Supabase Realtime
- Optimistic updates for better UX

### Expense Splitting
- Automatic calculation of who owes whom
- Greedy algorithm for minimal transactions
- Support for splitting between any subset of members

### Memory Wall
- Upload photos and videos to Supabase Storage
- Like and view memories
- Automatic "Top Moments" based on likes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
