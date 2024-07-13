import React, { useState, useEffect } from 'react';
import { fromLatLng, setKey } from 'react-geocode';
import { XORShift } from 'random-seedable';

export default function ForecastleGame() { 
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    useEffect(() => {
        // Seed Google API key
        setKey(import.meta.env.VITE_GEOCODE_API_KEY);

        // Generate today's forcastle
        try {
            GenerateTodaysForcastle();
        } catch (error) {
            console.error(error);
        }
    }, [])

    async function GenerateTodaysForcastle() {
        // Get todays seed
        const generator = new XORShift(getTodaysSeed());
        let lat, lng;
        let results;
        // Continously poll for a named location
        do {
            lat = generator.float() * 180 - 90;
            lng = generator.float() * 360 - 180;

            // Geocode the lat and long
            const geo = await fromLatLng(lat, lng);

            // Ensure valid status
            if (geo.status !== "OK")
                throw new Error("Could not geocode location");

            ({ results } = geo);
            console.log(results);
        } while (results.length < 3 || results[results.length - 2].formatted_address.includes("Nunavut, Canada") || results[1].formatted_address.includes("Antarctica") || results[results.length - 2].formatted_address.includes("Krasnoyarsk Krai, Russia"));
        
        // Save the location we generated (best result is 2nd to last)
        setLocation(results[results.length - 2]);

        // Now, using the set lat and lng, get the weather for that location from yesterday
        let date = new Date();
        date.setDate(date.getDate() - 1);
        date.setUTCHours(12, 0, 0, 0);
        let unixMidnightTimestamp = Math.floor(date.getTime() / 1000);
        const response = await
            fetch(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lng}&dt=${unixMidnightTimestamp}&appid=${apiKey}`);
    }

    function getTodaysSeed() {
        // Get the current day, month, and year as numbers
        const today = new Date();
        const days = today.getDate() + 1;
        const months = today.getMonth();
        const years = today.getFullYear();

        // Return a unique string that uses these values, padding ahead with 0s if needed
        return `${String(days).padStart(2, "0")}${String(months).padStart(2, "0")}${String(years).padStart(4, "0")}`
    }

    return (
        <p>What was the forcast like in {location ? location.formatted_address : ""}?</p>
    );
}