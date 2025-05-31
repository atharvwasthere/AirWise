# Api

- ```GET /api/states```: This endpoint would simply return a list of all Indian states stored in your database. You might need a way to populate this list initially.

- ```GET /api/states/:state/hill-stations```: This endpoint takes a state as a parameter and returns a list of hill stations within that state. This would involve querying the Place model based on the state field.

- ```GET /api/hill-stations/:id:``` This endpoint retrieves detailed information about a specific hill station using its ID. It would also involve fetching the real-time AQI data for that location (we'll cover this in the API integration step).

- ```GET /api/hill-stations/:id/aqi-history:``` This endpoint retrieves the historical AQI data for a specific hill station. This would involve querying the aqiHistory array within the Place document.

- ```GET /api/nearby-locations?latitude=...&longitude=...:``` This is a crucial endpoint for the core functionality. It takes the user's latitude and longitude as query parameters. The backend would then:

Determine the user's state (using the GET /api/location/state logic).
Query the database for locations within that state.
Sort these locations based on their current AQI (fetched in real-time).
Return the locations with better AQI.
You might also want to incorporate a radius for the search.
Admin Endpoints: These endpoints are for managing the hill station data and would require some form of authentication and authorization to prevent unauthorized access.

- ```GET /api/location/state?latitude=...&longitude=...:``` This endpoint will use the Nominatim API (or a similar service) to reverse geocode the given latitude and longitude and determine the state.