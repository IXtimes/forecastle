import React, { useState, useEffect } from 'react';
import { fromLatLng, setKey } from 'react-geocode';
import { XORShift } from 'random-seedable';
import GuessPanel from './GuessPanel';
import Tooltip from './Tooltip';
import ToggleSwitch from './ToggleSwitch';
import Results from './Results';

export default function ForecastleGame() { 
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [stats, setStats] = useState(null);
    const [isFah, setIsFah] = useState(true);
    const [actives, setActives] = useState(["true", "false", "false", "false", "false"]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [accepts, setAccepts] = useState([
        ['undeter','undeter','undeter','undeter','undeter'],
        ['undeter','undeter','undeter','undeter','undeter'],
        ['undeter','undeter','undeter','undeter','undeter'],
        ['undeter','undeter','undeter','undeter','undeter'],
        ['undeter','undeter','undeter','undeter','undeter'],
    ]);
    const [gameOver, setGameOver] = useState(false);
    const [winState, setWinState] = useState(false);
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    const dayOffset = 0;

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
        } while (results.length < 3 || results[results.length - 2].formatted_address.includes("Nunavut, Canada") || results[1].formatted_address.includes("Antarctica") || results[results.length - 2].formatted_address.includes("Krai, Russia"));
        
        // Save the location we generated (best result is 2nd to last)
        setLocation(results);

        // Now, using the set lat and lng, get the weather for that location from yesterday
        let date = new Date();
        date.setDate(date.getDate() - 1 + dayOffset);
        date.setUTCHours(12, 0, 0, 0);
        let unixMidnightTimestamp = Math.floor(date.getTime() / 1000);
        const response = await
            fetch(`https://history.openweathermap.org/data/2.5/history/city?lat=${lat}&lon=${lng}&type=hour&start=${unixMidnightTimestamp}&end=${unixMidnightTimestamp}&appid=${apiKey}`);
        
        if (!response.ok)
            throw new Error("Could not fetch weather data");
        
        const json = await response.json();
        const { list: [weather] } = json;

        // Save the weather for our specified location
        setWeather(weather);

        // Lastly get the aggregate weather statistics for the day (namely for precip, high/low temp, and avg. humidity)
        const response2 = await
            fetch(`https://history.openweathermap.org/data/2.5/aggregated/day?lat=${lat}&lon=${lng}&month=${date.getMonth()}&day=${date.getDate()}&appid=${apiKey}`);
        
        if (!response2.ok)
            throw new Error("Could not fetch stats data");

        const json2 = await response2.json()
        const { result } = json2;

        // Save the weather stats for the location
        setStats(result);
    }

    function getTodaysSeed() {
        // Get the current day, month, and year as numbers
        const today = new Date();
        const days = today.getDate() + dayOffset;
        const months = today.getMonth();
        const years = today.getFullYear();

        // Return a unique string that uses these values, padding ahead with 0s if needed
        return `${String(days).padStart(2, "0")}${String(months).padStart(2, "0")}${String(years).padStart(4, "0")}`
    }

    function activateNext(winningState) {
        if (winningState) {
            setGameOver(true);
            setWinState(true);

            // Change all trues to locked
            let newActives = [...actives];
            newActives.forEach((state, i) => {
                if (state === "true" || state === "complete")
                    newActives[i] = "locked";
            });
            setActives(newActives);
        }
        else if (activeIndex < 4) {
            // Make a copy of the actives stateful array
            let newActives = [...actives];

            // Iterate through, changing true states to complete and the next false state to true
            newActives.forEach((state, i) => {
                if (state === "complete")
                    newActives[i] = "locked";
                if (state === "true")
                    newActives[i] = "complete";
                else
                    if (i === activeIndex + 1)
                        newActives[i] = "true";
            });
            
            // Push changes
            setActives(newActives);

            // Increase active index
            setActiveIndex(activeIndex + 1);
        } else {
            setGameOver(true);
            setWinState(false);

            // Change all to locked
            let newActives = [...actives];
            newActives.forEach((state, i) => {
                newActives[i] = "locked";
            });
            setActives(newActives);
        }
    }

    return (
        <>
            <Tooltip location={location} />
            <ToggleSwitch labelOn="°F" labelOff="°C" toggle={isFah} setToggle={setIsFah}/>
            <div className="gameCards">
                <GuessPanel active={actives[0]} i={0} activateNext={activateNext} accepts={accepts} setAccepts={setAccepts} weatherData={weather} weatherStats={stats} isFah={isFah}/>
                <GuessPanel active={actives[1]} i={1} activateNext={activateNext} accepts={accepts} setAccepts={setAccepts} weatherData={weather} weatherStats={stats} isFah={isFah}/>
                <GuessPanel active={actives[2]} i={2} activateNext={activateNext} accepts={accepts} setAccepts={setAccepts} weatherData={weather} weatherStats={stats} isFah={isFah}/>
                <GuessPanel active={actives[3]} i={3} activateNext={activateNext} accepts={accepts} setAccepts={setAccepts} weatherData={weather} weatherStats={stats} isFah={isFah}/>
                <GuessPanel active={actives[4]} i={4} activateNext={activateNext} accepts={accepts} setAccepts={setAccepts} weatherData={weather} weatherStats={stats} isFah={isFah}/>
            </div>
            {gameOver &&
                <Results accepts={accepts} winState={winState} weatherData={weather} weatherStats={stats} location={location} isFah={isFah}/>
            }
        </>
    );
}