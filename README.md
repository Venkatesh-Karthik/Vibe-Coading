# Vibe Coading - Next.js Travel Planning App

A modern, responsive Next.js application for planning trips, managing expenses, and reliving memories with friends and family.

## Features

- 🎨 Modern UI with Tailwind CSS
- ⚡ Next.js 14 with App Router
- 🎯 TypeScript for type safety
- 📱 Fully responsive design
- 🎭 Reusable component library
- 🔥 Firebase integration ready

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Venkatesh-Karthik/Vibe-Coading.git
   cd Vibe-Coading
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run type-check` - Run TypeScript type checking without emitting files

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Landing page
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/       # Reusable UI components
│   │   ├── Nav.tsx       # Navigation component
│   │   ├── Footer.tsx    # Footer component
│   │   ├── Card.tsx      # Card component
│   │   └── CardsGrid.tsx # Cards grid component
│   └── lib/              # Utilities and data
│       └── data.ts       # Demo data
├── public/               # Static assets
├── package.json          # Dependencies (pinned versions)
└── tsconfig.json         # TypeScript configuration
```

## Dependency Versions

This project uses pinned dependency versions for reproducibility:

- **next**: 14.2.25 (latest patched 14.x version addressing security vulnerabilities)
- **react**: 18.2.0
- **react-dom**: 18.2.0
- **firebase**: 10.14.1
- **@react-google-maps/api**: 2.18.1
- **@dnd-kit/core**: 6.3.1
- **@dnd-kit/sortable**: 10.0.0
- **@dnd-kit/utilities**: 3.2.2
- **recharts**: 2.6.2
- **framer-motion**: 12.23.24
- **typescript**: 5.9.3
- **tailwindcss**: 3.4.13

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Icons**: Inline SVG components
- **Images**: Next.js Image component with external sources

## Development

This project follows Next.js best practices:

- Uses the App Router for routing
- Client and Server Components are properly separated
- TypeScript strict mode is enabled
- Components are modular and reusable

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Author

B Venkatesh Karthik
