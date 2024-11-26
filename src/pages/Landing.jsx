import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { MapPin, AlertCircle, Sun, Moon, Loader2, TicketsPlaneIcon } from "lucide-react"
import { PiFaceMaskLight } from "react-icons/pi";
import { useEffect, useState } from "react"
import { Toaster, } from "sonner"
import Logic from "@/controller/Logic"




const Landing = () => {
    // const AQIdata = [{
    //     aqi: 14,
    //     pm25: 245,
    //     pm10: 182,
    //     o3: 3.3,
    //     no2: 25.6,
    // }]

    const { location, AQIdata, isLoading, getCurrentLocation } = Logic();

    const getAQIColor = () => {
        const currentAQI = AQIdata.aqi;
        if (currentAQI <= 50) return "bg-green-500";
        if (currentAQI <= 100) return "bg-yellow-500";
        if (currentAQI <= 150) return "bg-orange-500";
        if (currentAQI <= 200) return "bg-red-500";
        if (currentAQI <= 300) return "bg-purple-500";
        if (currentAQI > 300) return "bg-rose-900";
    }

    const getAQItextColor = () => {
        const currentAQI = AQIdata.aqi;
        if (currentAQI <= 50) return "text-green-500";
        if (currentAQI <= 100) return "text-yellow-500";
        if (currentAQI <= 150) return "text-orange-500";
        if (currentAQI <= 200) return "text-red-500";
        if (currentAQI <= 300) return "text-purple-500";
        if (currentAQI > 300) return "text-rose-900";
    }

    const getAQIText = () => {
        const currentAQI = AQIdata.aqi;
        if (currentAQI <= 50) return "Good";
        if (currentAQI <= 100) return "Moderate";
        if (currentAQI <= 150) return "Unhealthy for Sensitive Groups";
        if (currentAQI <= 200) return "Unhealthy";
        if (currentAQI <= 300) return "Very Unhealthy";
        if (currentAQI > 300) return "Hazardous";
        if (currentAQI > 500) return "Evacuate!!";
    }

    const pollutants = [

        { label: "PM2.5", value: AQIdata.pm25, unit: "μg/m3" },
        { label: "PM10", value: AQIdata.pm10, unit: "μg/m3" },
        { label: "Ozone", value: AQIdata.o3, unit: "μg/m3" },
        { label: "NO₂", value: AQIdata.no2, unit: "μg/m3" },

    ]

    const getRecommendations = () => {
        const currentAQI = AQIdata.aqi;
        let WhatToDO = [];

        if (currentAQI <= 50) {
            WhatToDO.push(
                "Enjoy outdoor activities freely",
                "Open windows for fresh air",
                "No special precautions needed")
        }
        else if (currentAQI <= 100) {
            WhatToDO.push(
                "Sensitive groups should limit outdoor activities",
                "Avoid exercising near high-traffic areas",
                "Keep windows closed during peak pollution hours",
                "Use indoor air purifiers if needed",
                "Stay hydrated and drink herbal teas",
                "Monitor air quality updates")
        }
        else if (currentAQI <= 150) {
            WhatToDO.push(
                "Minimize outdoor exposure for sensitive groups",
                "Avoid outdoor activities during peak pollution times",
                "Wear a basic mask outdoors",
                "Use air purifiers indoors",
                "Wash hands and face after coming indoors",
                "Consume foods rich in antioxidants")
        }
        else if (currentAQI <= 200) {
            WhatToDO.push(
                "Reduce outdoor activities for everyone",
                "Wear an N95 or N99 mask if outdoors",
                "Keep windows and doors sealed tightly",
                "Use a humidifier to maintain indoor air quality",
                "Take Vitamin C and E supplements",
                "Stay alert for respiratory symptoms")
        }
        else if (currentAQI <= 300) {
            WhatToDO.push(
                "Stay indoors and avoid all outdoor exposure",
                "Wear a high-quality mask (N99) if stepping outside",
                "Follow government advisories on evacuation",
                "Use advanced air purifiers in living spaces",
                "Ensure vulnerable individuals receive care",
                "Seek immediate medical attention if symptoms worsen")
        }
        else if (currentAQI <= 499) {
            WhatToDO.push(
                "Avoid outdoor exposure unless absolutely necessary",
                "Use high-efficiency air purifiers indoors",
                "Wear a high-quality N99 or N100 mask outdoors",
                "Limit physical activity and rest",
                "Monitor symptoms and seek medical help if needed",
                "Keep vulnerable individuals indoors and well-cared for")
        }
        else if (currentAQI >= 500) {
            WhatToDO.push(
                "Leave the affected area immediately",
                "Follow government evacuation advisories",
                "Prioritize vulnerable individuals for immediate evacuation")
        }
        return WhatToDO;

    }

    const [darkMode, setDarkMode] = useState(false)
    const [isVisible, setIsVisible] = useState(false);
    // Monitor AQI and show the alert card when conditions are met
    useEffect(() => {
        if (AQIdata.aqi > 200) {
            setIsVisible(true);
        }
    }, [AQIdata.aqi]); // re-runs when the aqi changes

    const handleClose = () => {
        setIsVisible(false);
    }

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])
    return (
        <div className="min-h-screen bg-background text-foreground  space-y-4 max-w-2xl mx-auto">
            <Toaster richColors />
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-semibold text-foreground">AQI Check</h1>
                <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <Switch
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                        aria-label="Toggle dark mode"
                    />
                    <Moon className="h-4 w-4" />
                </div>
            </div>

            {location.error && (
                <Card className="border-destructive">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <p>{location.error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}


            <Card id="location">
                <CardContent className="p-4">
                    <div className="flex  items-center gap-2 text-primary">
                        <MapPin className="h-5 w-5" />
                        <div >
                            <h2 className="font-normal">{AQIdata.city}</h2>
                            <p className="text-sm text-muted-foreground  ">
                                {AQIdata.geo?.[0] && AQIdata.geo?.[1] ? `${AQIdata.geo[0]}, ${AQIdata.geo[1]}` : 'Location not available'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isVisible && (
                <Card className="border border-red-300 bg-red-50  rounded-md shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-xs flex items-start gap-2 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <p>
                                 <strong>High AQI</strong> detected. Consider a{" "}
                                <u className="text-red-500 cursor-pointer">short trip</u> until the dust settles.
                            </p>
                        </div>
                        <div className="flex gap-2 items-center justify-end mt-2">
                            <Button
                                variant="default"
                                className="text-xs h-6 w-24 bg-green-400 hover:bg-green-500 text-white rounded-md px-3 py-1"
                            >
                                <TicketsPlaneIcon className="h-4 w-4 mr-1" />
                                Take a Trip
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleClose}
                                className="text-xs h-6 w-24 bg-red-400 hover:bg-red-500 text-white rounded-md px-3 py-1"
                            >
                                <PiFaceMaskLight className="h-4 w-4 mr-1" />
                                Dismiss
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card id="aqi">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center pb-2">
                        <h2 className="text-xl font-semibold">Air Quality Index</h2>
                        <span className={`text-4xl font-bold ${getAQItextColor()}`}>{AQIdata.aqi}</span>
                    </div>
                    <div className={`w-full h-2  ${getAQIColor()}`}></div>
                    <div className="flex justify-center items-center pt-2">
                        <p className={`text-sm font-medium ${getAQItextColor()}`}>{getAQIText()}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3">
                        {pollutants.map((item) => (
                            <div key={item.label} className="p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                <p className="font-medium">{item.value} {item.unit}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card id="Rec.">
                <CardHeader>

                    <CardTitle className="text-xl flex items-center gap-2 -mb-2">
                        <AlertCircle className={`h-5 w-5 ${getAQItextColor()}`} />
                        What to do?
                    </CardTitle>
                </CardHeader>
                <CardContent >
                    <ul className="space-y-2">
                        {getRecommendations().map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <div className={`pr-1 h-1.5 w-1.5 rounded-full mx-2 ${getAQIColor()}`} />
                                <span className="text-[11px] font-semibold text-wrap text-muted-foreground md:text-[14px]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Button
                className="w-full"
                onClick={getCurrentLocation}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                    <MapPin className="h-4 w-4 mr-2" />
                )}
                Get My Locations Air Quality
            </Button>

        </div>
    )
}

export default Landing