import React from 'react';
import Nav from '../components/Nav';
import CardsGrid from '../components/CardsGrid';
import Footer from '../components/Footer';
import '../globals.css';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Ship beautiful UI, fast</h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Starter templates, reusable components, and an approachable design language — ready for production.</p>
            <div className="mt-8 flex justify-center gap-4">
              <a href="#cards" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Explore templates</a>
              <a href="#features" className="px-6 py-3 bg-transparent border border-slate-200 rounded-md text-slate-700">Learn more</a>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold">Fast to customize</h3>
              <p className="mt-2 text-sm text-slate-600">Tailwind-first components and clear TypeScript types.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold">Accessible</h3>
              <p className="mt-2 text-sm text-slate-600">Focus states, contrast, and keyboard navigation considered.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold">Composable</h3>
              <p className="mt-2 text-sm text-slate-600">Small components you can combine into pages quickly.</p>
            </div>
          </div>
        </section>

        <CardsGrid />
      </main>

      <Footer />
    </div>
  );
}
