// Utility functions for trip-related calculations

/**
 * Calculate the number of days between two dates (inclusive)
 */
export function getDaysDiff(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1; // Add 1 to make it inclusive
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
}

/**
 * Get the origin URL safely (works in both client and server)
 */
export function getOriginUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}
