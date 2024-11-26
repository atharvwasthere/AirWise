import { useState } from "react";
import { toast } from "sonner";

const Logic = () => {

    const [location, setLocation] = useState({
        Latitude: null,
        Longitude: null,
        error: null,
    });

    const [AQIdata, setAQIdata] = useState({
        aqi: null,
        city: '',
        geo: null,
        pm25: null,
        pm10: null,
        o3: null,
        no2: null
    });

    const [isloading, setIsloading] = useState(false);

    const WAQI_API_KEY = import.meta.env.VITE_WAQI_API_KEY;
    // console.log(WAQI_API_KEY);

    const fetchAQIdata = async (lat, lon) => {
        if (!lat || !lon) {
            toast.error("Invalid Coordinates", {
                description: "Please provide valid Latitude & Longitude",
            })
            return;
        }

        setIsloading(true);

        try {

            const response = await fetch(
                `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${WAQI_API_KEY}`
            );
            console.log(response);
            if (!response.ok) {
                throw new Error("Failed to fetch AQI data");
            }
            //converting 
            const data = await response.json();
            console.log(data);
            if (data.status !== 'ok') {
                throw new Error(data.data || "Error fetching AQI data");
            }

            const calcAQI = (data) => {
                const calculate = (value, thresholds) => {
                    let AQIhigh, AQIlow, PM25high, PM25low;

                    for (const threshold of thresholds) {
                        if (value <= threshold.max) {
                            AQIhigh = threshold.AQIhigh;
                            AQIlow = threshold.AQIlow;
                            PM25high = threshold.PMhigh;
                            PM25low = threshold.PMlow;
                            break;
                        }
                    }

                    console.log("AQIhigh:", AQIhigh);
                    console.log("AQIlow:", AQIlow);
                    console.log("PM25high:", PM25high);
                    console.log("PM25low:", PM25low);
                    console.log("AQIdata.pm25:", value);
                    return Math.round(((AQIhigh - AQIlow) / (PM25high - PM25low)) * (value - PM25low) + AQIlow);
                }


                const pm25 = data.data.iaqi.pm25.v;
                const pm10 = data.data.iaqi.pm10.v;

                // Thresholds for pm25
                const pm25Thresholds = [
                    { max: 12.0, AQIhigh: 50, AQIlow: 0, PMhigh: 12.0, PMlow: 0 },
                    { max: 35.4, AQIhigh: 100, AQIlow: 51, PMhigh: 35.4, PMlow: 12.1 },
                    { max: 55.4, AQIhigh: 150, AQIlow: 101, PMhigh: 55.4, PMlow: 35.5 },
                    { max: 150.4, AQIhigh: 200, AQIlow: 151, PMhigh: 150.4, PMlow: 55.5 },
                    { max: 250.4, AQIhigh: 300, AQIlow: 201, PMhigh: 250.4, PMlow: 150.5 },
                    { max: Infinity, AQIhigh: 500, AQIlow: 301, PMhigh: 500, PMlow: 250.5 },
                ];

                // Thresholds for pm10
                const pm10Thresholds = [
                    { max: 54, AQIhigh: 50, AQIlow: 0, PMhigh: 54, PMlow: 0 },
                    { max: 154, AQIhigh: 100, AQIlow: 51, PMhigh: 154, PMlow: 55 },
                    { max: 254, AQIhigh: 150, AQIlow: 101, PMhigh: 254, PMlow: 155 },
                    { max: 354, AQIhigh: 200, AQIlow: 151, PMhigh: 354, PMlow: 255 },
                    { max: 424, AQIhigh: 300, AQIlow: 201, PMhigh: 424, PMlow: 355 },
                    { max: 504, AQIhigh: 400, AQIlow: 301, PMhigh: 504, PMlow: 425 },
                    { max: 604, AQIhigh: 500, AQIlow: 401, PMhigh: 604, PMlow: 505 },
                ];

                const pm25AQI = calculate(pm25, pm25Thresholds);
                const pm10AQI = calculate(pm10, pm10Thresholds);   

                return Math.max(pm25AQI, pm10AQI);

            }


            const newAQI = calcAQI(data);

            setAQIdata({
                aqi: newAQI,
                city: data.data.city.name,
                geo: data.data.city.geo,
                dominentpol: data.data.dominentpol,
                pm25: data.data.iaqi.pm25.v,
                date: data.data.time.s,
                o3: data.data.iaqi.o3.v,
                pm10: data.data.iaqi.pm10.v,
                no2: data.data.iaqi.no2.v,

            });

            // pm25 avg => for 3 days([0],[1],[2] of the pm25 array) if that 

            console.log(AQIdata);

            toast.success('AQI data fetched successfully');
        } catch (error) {
            toast.error('AQI Data Error', {
                description: error.message,
            });

        } finally {
            setIsloading(false);
        }

    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation not supported', {
                description: 'Geolocation is not supported by your browser'
            });
            return;
        }

        setIsloading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    error: null,
                });
                console.log(latitude, longitude);
                fetchAQIdata(latitude, longitude);

                toast.success('Location Retrieved', {
                    description: `Coordinates: ${latitude}, ${longitude}`
                });
            },
            (error) => {
                let errorMessage;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access deniedn';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                    default:
                        errorMessage = 'Unknown location error';

                }

                toast.error('Geolocation error', {
                    description: errorMessage
                });

                setLocation((prev) => ({
                    ...prev,
                    error: errorMessage
                }));

            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );

    }
    return { location, AQIdata, isloading, getCurrentLocation }
}

export default Logic;

