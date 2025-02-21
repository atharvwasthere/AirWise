import type { Destination } from "../pages/types"

// This would typically be an API call to your backend
const fetchNearbyDestinations = async (latitude: number, longitude: number, radius: number): Promise<Destination[]> => {
  // Simulating an API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data - in a real app, this would come from your backend
  return [
    {
      id: "1",
      name: "Pachmarhi",
      state: "Madhya Pradesh",
      distance: 200,
      aqi: 45,
      aqiCategory: "Good",
      improvement: 76,
    },
    {
      id: "2",
      name: "Mount Abu",
      state: "Rajasthan",
      distance: 300,
      aqi: 52,
      aqiCategory: "Moderate",
      improvement: 65,
    },
    {
      id: "3",
      name: "Mahabaleshwar",
      state: "Maharashtra",
      distance: 450,
      aqi: 38,
      aqiCategory: "Good",
      improvement: 80,
    },
    { id: "4", name: "Munnar", state: "Kerala", distance: 600, aqi: 30, aqiCategory: "Good", improvement: 85 },
  ]
}

export const getTripRecommendations = async (
  currentLatitude: number,
  currentLongitude: number,
  currentAQI: number,
): Promise<Destination[]> => {
  const nearbyDestinations = await fetchNearbyDestinations(currentLatitude, currentLongitude, 1000)

  // Filter and sort destinations based on AQI improvement
  const recommendations = nearbyDestinations
    .filter((dest) => dest.aqi < currentAQI)
    .sort((a, b) => b.improvement - a.improvement)
    .slice(0, 5) // Get top 5 recommendations

  return recommendations
}

