"use client"

import React from "react"
import { MapPin, Navigation, ThermometerSun, Phone, TrendingUp, Shield, Hotel } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useRef, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function TripPage() {
    const [darkMode, setDarkMode] = useState(false);
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false) // Scrolling down
      } else {
        setIsVisible(true) // Scrolling up
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
    
      <div
        className={`fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="font-semibold">Pachmarhi, Madhya Pradesh</h2>
                <p className="text-sm text-muted-foreground">200km from Bhopal</p>
              </div>
              <div className="hidden md:block bg-secondary px-3 py-1 rounded-full">
                <span className="text-sm text-green-600 font-medium">AQI 45 · Good</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button>Get Directions</Button>
              <Button variant="outline">View Accommodations</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6 mt-20">
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
                  <h3 className="text-2xl font-bold">Pachmarhi, Madhya Pradesh</h3>
                  <p className="text-muted-foreground">Distance: 200km from Bhopal</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Current AQI</p>
                    <p className="text-2xl font-bold text-green-600">45</p>
                    <p className="text-sm text-green-600">Good</p>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Improvement</p>
                    <p className="text-2xl font-bold text-green-600">76%</p>
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
                  <p className="text-2xl font-bold">24°C</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="text-2xl font-bold">65%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Wind Speed</p>
                  <p className="text-2xl font-bold">12 km/h</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Visibility</p>
                  <p className="text-2xl font-bold">Good</p>
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
                  <TableCell>15 µg/m³</TableCell>
                  <TableCell className="text-green-600">Good</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PM10</TableCell>
                  <TableCell>25 µg/m³</TableCell>
                  <TableCell className="text-green-600">Good</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ozone (O3)</TableCell>
                  <TableCell>35 ppb</TableCell>
                  <TableCell className="text-green-600">Good</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NO2</TableCell>
                  <TableCell>15 ppb</TableCell>
                  <TableCell className="text-green-600">Good</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Travel Information */}
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
                      <span>3.5 hours</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">By Bus:</span>
                      <span>4 hours</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">By Train:</span>
                      <span>3 hours</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Points of Interest</h3>
                  <ul className="mt-2 space-y-2">
                    <li>Satpura National Park</li>
                    <li>Dhoopgarh</li>
                    <li>Bee Falls</li>
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
            <div className="h-[200px] w-full">
              {/* Add your chart component here */}
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Chart showing consistently good AQI levels
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

