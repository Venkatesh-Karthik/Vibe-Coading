// Demo card data for the landing page

export interface CardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export const demoCards: CardData[] = [
  {
    id: "1",
    title: "Mountain Adventure",
    description: "Explore breathtaking mountain landscapes and create unforgettable memories with friends.",
    imageUrl: "https://picsum.photos/seed/mountain/400/300",
    category: "Adventure",
  },
  {
    id: "2",
    title: "Beach Getaway",
    description: "Relax on pristine beaches and enjoy the sun, sand, and sea with your travel companions.",
    imageUrl: "https://picsum.photos/seed/beach/400/300",
    category: "Relaxation",
  },
  {
    id: "3",
    title: "City Explorer",
    description: "Discover urban wonders, cultural hotspots, and vibrant city life in top destinations.",
    imageUrl: "https://picsum.photos/seed/city/400/300",
    category: "Urban",
  },
  {
    id: "4",
    title: "Cultural Journey",
    description: "Immerse yourself in rich traditions, historic sites, and local experiences.",
    imageUrl: "https://picsum.photos/seed/culture/400/300",
    category: "Culture",
  },
  {
    id: "5",
    title: "Wildlife Safari",
    description: "Get up close with nature's most magnificent creatures in their natural habitat.",
    imageUrl: "https://picsum.photos/seed/wildlife/400/300",
    category: "Nature",
  },
  {
    id: "6",
    title: "Food Tour",
    description: "Taste authentic local cuisines and discover the culinary secrets of each destination.",
    imageUrl: "https://picsum.photos/seed/food/400/300",
    category: "Culinary",
  },
];
