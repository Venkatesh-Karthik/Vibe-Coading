import Card from "./Card";
import { demoCards } from "@/lib/data";

export default function CardsGrid() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-3">
            Popular Destinations
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover amazing travel experiences curated by our community
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoCards.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              category={card.category}
              link={`/trip/${card.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
