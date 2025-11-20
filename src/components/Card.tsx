import React from 'react';

export interface CardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  tag?: string;
}

const Card: React.FC<CardProps> = ({ title, description, image, tag }) => {
  return (
    <article tabIndex={0} className="card bg-white rounded-lg overflow-hidden border hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200">
      <div className="h-44 w-full overflow-hidden bg-slate-100">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {tag && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">{tag}</span>}
        </div>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-4">
          <a href="#" className="text-sm text-indigo-600 hover:underline">View details →</a>
        </div>
      </div>
    </article>
  );
};

export default Card;
