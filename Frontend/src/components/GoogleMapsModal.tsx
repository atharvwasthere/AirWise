import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import React = require("react")

interface GoogleMapsModalProps {
  isOpen: boolean
  onClose: () => void
  destination: string
  latitude: number
  longitude: number
}

declare global {
  interface Window {
    google: any
  }
}

export function GoogleMapsModal({ isOpen, onClose, destination, latitude, longitude }: GoogleMapsModalProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)

  useEffect(() => {
    if (isOpen && !map) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap`
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      window.initMap = () => {
        const newMap = new window.google.maps.Map(document.getElementById("map"), {
          center: { lat: latitude, lng: longitude },
          zoom: 12,
        })
        setMap(newMap)

        // Add a marker for the destination
        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: newMap,
          title: destination,
        })
      }

      return () => {
        document.head.removeChild(script)
        delete window.initMap
      }
    }
  }, [isOpen, map, destination, latitude, longitude])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Directions to {destination}</DialogTitle>
          <DialogDescription>Use the map below to get directions to your destination.</DialogDescription>
        </DialogHeader>
        <div id="map" style={{ width: "100%", height: "400px" }}></div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

