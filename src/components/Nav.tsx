'use client';
import React from 'react';

export const Nav: React.FC = () => {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">V</div>
          <span className="font-semibold text-lg">Vibe Coading</span>
        </div>
        <nav className="flex items-center gap-4">
          <a href="#features" className="text-sm text-slate-600 hover:text-slate-900">Features</a>
          <a href="#cards" className="text-sm text-slate-600 hover:text-slate-900">Explore</a>
          <a href="#contact" className="ml-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Get started</a>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
