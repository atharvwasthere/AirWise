import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"
import Logic from "@/controller/Logic"


const Trip = () => {
    const [darkMode, setDarkMode] = useState(false);
    const {fetchNearbyAQI} = Logic();
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    return (
        <div className="min-h-screen bg-background text-foreground  space-y-4 max-w-2xl mx-auto">
            <div className=" flex justify-between items-center">
                <div className="border-2 border-red-500">

                    <h1 className="flex text-4xl font-semibold text-foreground">AirWise</h1>

                </div>
                <div className="flex items-center space-x-2 border-2 border-red-500">
                    <Sun className="h-4 w-4" />
                    <Switch
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                        aria-label="Toggle dark mode"
                    />
                    <Moon className="h-4 w-4" />
                </div>
            </div>

            <Card>

            </Card>
        </div>

    )
}

export default Trip;