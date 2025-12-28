/**
 * Static city coordinates mapping
 * Used to convert city names to lat/lng coordinates
 * No external API calls needed
 */

type CityCoordinates = {
    lat: number;
    lng: number;
};

const CITY_COORDINATES: Record<string, CityCoordinates> = {
    "Hong Kong": { lat: 22.3193, lng: 114.1694 },
    "London": { lat: 51.5074, lng: -0.1278 },
    "Osaka": { lat: 34.6937, lng: 135.5023 },
    "Sapporo": { lat: 43.0642, lng: 141.3469 },
    "Vienna": { lat: 48.2082, lng: 16.3738 },
    "Budapest": { lat: 47.4979, lng: 19.0402 },
    "Munich": { lat: 48.1351, lng: 11.5820 },
    "Salzburg": { lat: 47.8095, lng: 13.0550 },
    "Bratislava": { lat: 48.1486, lng: 17.1077 },
    "Edinburgh": { lat: 55.9533, lng: -3.1883 },
    "Cardiff": { lat: 51.4816, lng: -3.1791 },
    "Taipei": { lat: 25.0330, lng: 121.5654 },
    "Tokyo": { lat: 35.6762, lng: 139.6503 },
    "Hakodate": { lat: 41.7684, lng: 140.7267 },
    "Asahikawa": { lat: 43.7699, lng: 142.3673 },
    "Kaohsiung": { lat: 22.6151, lng: 120.3040 },
    "Macau": { lat: 22.1987, lng: 113.5439 },
    "Paris": { lat: 48.8566, lng: 2.3522 },
    "Cherbourg": { lat: 49.6331, lng: -1.6437 },
    "Oxford": { lat: 51.7520, lng: -1.2577 },
    "Cambridge": { lat: 52.2053, lng: 0.1218 },
    "Dover": { lat: 51.1254, lng: 1.3089 },
    "Brighton": { lat: 50.8611, lng: -0.0820 },
    "Singapore": { lat: 1.3521, lng: 103.8198 },
    "Kyoto": { lat: 35.0116, lng: 135.7681 },
    "New York": { lat: 40.7128, lng: -74.0060 },
    "Bath": { lat: 51.3814, lng: -2.3605 },
    "Birmingham": { lat: 52.5086, lng: -1.8853 },
    "Nagoya": { lat: 35.1815, lng: 136.9066 },
    "Fukuoka": { lat: 33.5904, lng: 130.4017 },
};

/**
 * Get coordinates for a city name
 * @param cityName - The name of the city
 * @returns Coordinates object with lat and lng, or null if not found
 */
export const getCoordinates = (
    cityName: string
): CityCoordinates | null => {
    return CITY_COORDINATES[cityName] || null;
};

/**
 * Resolve all city names to coordinates
 * @param locations - Array of location data with city names
 * @returns Array of locations enriched with coordinates
 */
export const resolveLocationCoordinates = <T extends { city_name: string }>(
    locations: T[]
): (T & CityCoordinates)[] => {
    return locations.map((location) => {
        const coords = getCoordinates(location.city_name);
        return {
            ...location,
            lat: coords?.lat ?? 0,
            lng: coords?.lng ?? 0,
        };
    });
};
