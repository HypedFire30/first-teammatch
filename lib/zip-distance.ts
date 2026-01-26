/**
 * Calculate approximate distance between two zip codes
 * This is a simplified calculation - for production, consider using a zip code API
 */

// Simple approximation: zip codes are roughly sequential by region
// This is a placeholder - for accurate distances, use a zip code geocoding service
export function calculateZipDistance(zip1: string, zip2: string): number {
  const num1 = parseInt(zip1.substring(0, 5));
  const num2 = parseInt(zip2.substring(0, 5));
  
  if (isNaN(num1) || isNaN(num2)) {
    return 0;
  }
  
  // Rough approximation: each 1000 in zip code difference ≈ 50 miles
  // This is very rough and should be replaced with actual geocoding
  const diff = Math.abs(num1 - num2);
  const miles = diff / 20; // Rough conversion
  
  // Round to 1 decimal place
  return Math.round(miles * 10) / 10;
}
