import React, { useState, useEffect } from 'react';
import { fromAddress, setKey } from 'react-geocode';

function WeatherForm({ setWeatherData, setError, setGeocodeData}) {
    const [city, setCity] = useState('');
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    useEffect(() => {
        // Seed Google API key
        setKey(import.meta.env.VITE_GEOCODE_API_KEY);
    }, [])

    async function SubmitFieldContent(e) {
        // Prevent the basic behavior of the submit button
        e.preventDefault();

        // Call the weather API if we have a city typed in
        if (city) {
            try {
                // Geocode the lat and long from the passed city string
                const geo = await fromAddress(city);
                console.log(geo);
                const { results: [{ geometry: { location: { lat, lng } } }]} = geo;
                // Use the geocoded lat and long to get the specific weather data
                const data = await getWeatherData(lat, lng);
                setGeocodeData(geo);
                setWeatherData(data);
                setError('');
            }
            catch (error) {
                console.error(error);
                setError(error.message);
                setGeocodeData(null);
                setWeatherData(null);
            }
        }
        else
            setError("Please enter a city!");
    }

    async function getWeatherData(lat, lon) { 
        const response = await
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);

        if (!response.ok)
            throw new Error("Could not fetch weather data");

        return await response.json();
    }

    function HandleCityInput(e) {
        setCity(e.target.value);
    }

    return (
        <>
            <form className="weatherForm" onSubmit={ SubmitFieldContent}>
                <input type="text"
                className="cityInput"
                onChange={HandleCityInput}
                placeholder="Enter city"
                value={city}/>
                <button type="submit">Get Weather</button>
            </form>
        </>
    );
}

export default WeatherForm;