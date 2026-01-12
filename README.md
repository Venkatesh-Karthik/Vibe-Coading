# TripMosaic+ (VYNTRA)

A beautiful, glassmorphism-styled group trip planner with Supabase backend for real-time collaboration. Explore destinations, organize trips, manage expenses, and share memories — fully responsive and deployable on Vercel.

## Features

- 🎨 **Glassmorphism UI** - Modern, translucent design with blur effects
- 🔐 **Supabase Authentication** - Secure Google OAuth login integration
- 🗺️ **Explore Destinations** - Browse curated travel destinations
- 📅 **Dynamic Trip Planner** - Real-time collaborative itinerary planning
- 💰 **Collaborative Expenses** - Split costs and settle up with automatic calculations
- 📸 **Memory Wall** - Upload and share photos/videos with cloud storage
- 📱 **Fully Responsive** - Works beautifully on mobile and desktop
- ⚡ **Smooth Animations** - Powered by Framer Motion
- 🔄 **Real-time Updates** - Live collaboration with Supabase Realtime

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
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Legacy Firebase (Optional - being deprecated)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
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
 │   │   ├─ page.tsx         # Home page
 │   │   ├─ auth/callback/   # OAuth callback handler
 │   │   ├─ explore/         # Explore destinations
 │   │   ├─ planner/         # Dynamic trip planner
 │   │   ├─ memories/        # Memory wall
 │   │   ├─ join/            # Join trip with code
 │   │   ├─ organizer/       # Trip organizer pages
 │   │   └─ trip/            # Trip detail pages
 │   ├─ components/
 │   │   ├─ Navbar.tsx       # Glassmorphism navbar
 │   │   ├─ DestinationCard.tsx
 │   │   ├─ FeatureCard.tsx
 │   │   ├─ Footer.tsx
 │   │   └─ Expenses.tsx     # Expense splitting
 │   ├─ lib/
 │   │   ├─ supabase.ts      # Supabase client
 │   │   ├─ auth.tsx         # Auth context
 │   │   ├─ helpers/
 │   │   │   ├─ expenses.ts  # Expense calculations
 │   │   │   └─ storage.ts   # File upload helpers
 │   │   └─ ClientProviders.tsx
 │   └─ types/
 │       └─ database.ts      # TypeScript types
 ├─ supabase/
 │   └─ schema.sql           # Database schema with RLS
 ├─ .env.local               # Environment variables (create this)
 ├─ .env.example             # Example environment variables
 ├─ tailwind.config.js
 ├─ next.config.mjs
 ├─ package.json
 └─ README.md
```

## Database Schema

The application uses the following Supabase tables:

- **users** - User profiles
- **trips** - Trip information
- **trip_members** - Trip memberships
- **itinerary_days** - Daily itinerary entries
- **activities** - Activities within itinerary days
- **expenses** - Trip expenses
- **expense_splits** - How expenses are split
- **memories** - Photos and videos

All tables have Row Level Security (RLS) enabled. See `supabase/schema.sql` for complete schema and policies.

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
