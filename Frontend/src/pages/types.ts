export interface Destination {
    id: string
    name: string
    state: string
    distance: number
    aqi: number
    aqiCategory: string
    improvement: number
  }
  
  export interface DetailedDestination extends Destination {
    weather: {
      temperature: number
      humidity: number
      windSpeed: number
      visibility: string
    }
    airQualityDetails: {
      pm25: number
      pm10: number
      o3: number
      no2: number
    }
    travelOptions: {
      car: string
      bus: string
      train: string
    }
    pointsOfInterest: string[]
  }
  
  