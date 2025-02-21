"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Navigation, ThermometerSun, Phone, TrendingUp, Shield, Hotel } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Destination, DetailedDestination } from "./types"
import { getTripRecommendations } from "./utils/tripRecommendations"
import { GoogleMapsModal } from "./components/GoogleMapsModal"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import React from "react"

// Mock function to get detailed destination info
const getDetailedDestination = async (id: string): Promise<DetailedDestination> => {
  // This would be an API call in a real application
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
  return {
    id,
    name: "Pachmarhi",
    state: "Madhya Pradesh",
    distance: 200,
    aqi: 45,
    aqiCategory: "Good",
    improvement: 76,
    weather: {
      temperature: 24,
      humidity: 65,
      windSpeed: 12,
      visibility: "Good",
    },
    airQualityDetails: {
      pm25: 15,
      pm10: 25,
      o3: 35,
      no2: 15,
    },
    travelOptions: {
      car: "3.5 hours",
      bus: "4 hours",
      train: "3 hours",
    },
    pointsOfInterest: ["Satpura National Park", "Dhoopgarh", "Bee Falls"],
  }
}

export default function TripRecommendations() {
  const [recommendations, setRecommendations] = useState<Destination[]>([])
  const [selectedDestination, setSelectedDestination] = useState<DetailedDestination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true)
      try {
        // In a real app, you'd get the user's actual location and current AQI
        const userLatitude = 23.2599
        const userLongitude = 77.4126
        const currentAQI = 150 // Example: Delhi's AQI

        const recommendations = await getTripRecommendations(userLatitude, userLongitude, currentAQI)
        setRecommendations(recommendations)

        if (recommendations.length > 0) {
          const detailedInfo = await getDetailedDestination(recommendations[0].id)
          setSelectedDestination(detailedInfo)
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error)
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDestinationSelect = async (id: string) => {
    setIsLoading(true)
    try {
      const detailedInfo = await getDetailedDestination(id)
      setSelectedDestination(detailedInfo)
    } catch (error) {
      console.error("Failed to fetch destination details:", error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetDirections = () => {
    setIsMapOpen(true)
  }

  // Dummy data for the AQI trend chart
  const aqiTrendData = [
    { day: "Mon", aqi: 45 },
    { day: "Tue", aqi: 48 },
    { day: "Wed", aqi: 42 },
    { day: "Thu", aqi: 50 },
    { day: "Fri", aqi: 47 },
    { day: "Sat", aqi: 43 },
    { day: "Sun", aqi: 41 },
  ]

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (recommendations.length === 0) {
    return <div className="text-center mt-8">No recommendations found. Try expanding your search criteria.</div>
  }

  return (
    <>
      {/* Floating CTA Bar */}
      <div
        className={`fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="font-semibold">
                  {selectedDestination?.name}, {selectedDestination?.state}
                </h2>
                <p className="text-sm text-muted-foreground">{selectedDestination?.distance}km from your location</p>
              </div>
              <div className="hidden md:block bg-secondary px-3 py-1 rounded-full">
                <span
                  className={`text-sm font-medium ${selectedDestination?.aqiCategory === "Good" ? "text-green-600" : "text-yellow-600"}`}
                >
                  AQI {selectedDestination?.aqi} · {selectedDestination?.aqiCategory}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleGetDirections}>Get Directions</Button>
              <Button variant="outline">View Accommodations</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6 mt-20">
        <h1 className="text-3xl font-bold mb-6">Recommended Destinations</h1>

        {/* Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {recommendations.map((dest) => (
            <Card
              key={dest.id}
              className={`cursor-pointer transition-all ${selectedDestination?.id === dest.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleDestinationSelect(dest.id)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold">
                  {dest.name}, {dest.state}
                </h3>
                <p className="text-sm text-muted-foreground">{dest.distance}km away</p>
                <div className="mt-2 flex justify-between items-center">
                  <span
                    className={`text-sm font-medium ${dest.aqiCategory === "Good" ? "text-green-600" : "text-yellow-600"}`}
                  >
                    AQI {dest.aqi} · {dest.aqiCategory}
                  </span>
                  <span className="text-sm text-green-600">{dest.improvement}% better</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Destination Information */}
        {selectedDestination && (
          <>
            {/* Destination Overview */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Destination Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {selectedDestination.name}, {selectedDestination.state}
                      </h3>
                      <p className="text-muted-foreground">
                        Distance: {selectedDestination.distance}km from your location
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Current AQI</p>
                        <p className="text-2xl font-bold text-green-600">{selectedDestination.aqi}</p>
                        <p className="text-sm text-green-600">{selectedDestination.aqiCategory}</p>
                      </div>
                      <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Improvement</p>
                        <p className="text-2xl font-bold text-green-600">{selectedDestination.improvement}%</p>
                        <p className="text-sm text-green-600">Better than current</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThermometerSun className="h-5 w-5" />
                    Weather Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="text-2xl font-bold">{selectedDestination.weather.temperature}°C</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Humidity</p>
                      <p className="text-2xl font-bold">{selectedDestination.weather.humidity}%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Wind Speed</p>
                      <p className="text-2xl font-bold">{selectedDestination.weather.windSpeed} km/h</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Visibility</p>
                      <p className="text-2xl font-bold">{selectedDestination.weather.visibility}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Air Quality Details */}
            <Card>
              <CardHeader>
                <CardTitle>Air Quality Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pollutant</TableHead>
                      <TableHead>Current Level</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>PM2.5</TableCell>
                      <TableCell>{selectedDestination.airQualityDetails.pm25} µg/m³</TableCell>
                      <TableCell className="text-green-600">Good</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PM10</TableCell>
                      <TableCell>{selectedDestination.airQualityDetails.pm10} µg/m³</TableCell>
                      <TableCell className="text-green-600">Good</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ozone (O3)</TableCell>
                      <TableCell>{selectedDestination.airQualityDetails.o3} ppb</TableCell>
                      <TableCell className="text-green-600">Good</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>NO2</TableCell>
                      <TableCell>{selectedDestination.airQualityDetails.no2} ppb</TableCell>
                      <TableCell className="text-green-600">Good</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Travel Information and Health Recommendations */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Travel Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Transport Options</h3>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="text-muted-foreground">By Car:</span>
                          <span>{selectedDestination.travelOptions.car}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-muted-foreground">By Bus:</span>
                          <span>{selectedDestination.travelOptions.bus}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-muted-foreground">By Train:</span>
                          <span>{selectedDestination.travelOptions.train}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold">Points of Interest</h3>
                      <ul className="mt-2 space-y-2">
                        {selectedDestination.pointsOfInterest.map((poi, index) => (
                          <li key={index}>{poi}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Health & Safety
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Activity Recommendations</h3>
                      <ul className="mt-2 space-y-2 text-green-600">
                        <li>✓ Safe for outdoor activities</li>
                        <li>✓ Ideal for hiking and sightseeing</li>
                        <li>✓ Good for all age groups</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold">Emergency Contacts</h3>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>Emergency: 112</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Hotel className="h-4 w-4" />
                          <span>Tourist Help: 1363</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historical Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AQI Trend (Past Week)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer
                    config={{
                      aqi: {
                        label: "AQI",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={aqiTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="aqi" stroke="var(--color-aqi)" name="AQI" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {selectedDestination && (
        <GoogleMapsModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          destination={`${selectedDestination.name}, ${selectedDestination.state}`}
        />
      )}
    </>
  )
}

