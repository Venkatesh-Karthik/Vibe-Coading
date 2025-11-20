import React from 'react';
import Card, { CardProps } from './Card';
import sample from '../lib/data';

const CardsGrid: React.FC = () => {
  const cards: CardProps[] = sample;
  return (
    <section id="cards" className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Explore templates & ideas</h2>
        <p className="text-slate-600 mt-2">A curated set of cards demonstrating common UI patterns — responsive and accessible.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(c => (
          <Card key={c.id} {...c} />
        ))}
      </div>
    </section>
  );
};

export default CardsGrid;
