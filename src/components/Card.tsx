import Image from "next/image";
import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  category?: string;
  link?: string;
}

export default function Card({ title, description, imageUrl, category, link = "#" }: CardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {category && (
          <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-slate-700">
            {category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={link}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
          >
            View Details
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
