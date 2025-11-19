import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-slate-600">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <div className="font-semibold">Vibe Coading</div>
            <div className="text-xs mt-1">Building delightful UIs with Next & Tailwind</div>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">GitHub</a>
          </div>
        </div>
        <div className="mt-6 text-xs text-slate-400">© {new Date().getFullYear()} Vibe Coading. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
