import React, { useState, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive';

import ImageDropdown from "./ImageDropdown"

export default function GuessPanel({ active, activateNext, i, accepts, setAccepts, weatherId, weatherStats, isFah }) {
    // Stateful variables
    const [weather, setWeather] = useState("Atmospheric");
    const [high, setHigh] = useState(isFah ? 0 : 32);
    const [low, setLow] = useState(isFah ? 0 : 32);
    const [humidity, setHumidity] = useState(0);
    const [precipitation, setPrecipitation] = useState(0);
    const [enabled, setEnabled] = useState(active);
    const [highLow, setHighLow] = useState(null);

    // References to inputs
    const weatherImage = React.createRef();
    const highNumBox = useRef(null);
    const lowNumBox = useRef(null);
    const humidNumBox = useRef(null);
    const precipNumBox = useRef(null);

    // Check if the device is mobile in width, where we will truncate
    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

    // Update enabled based on changed active state
    useEffect(() => {
        setEnabled(active);

        // If the active state changes to locked, clear class list color hints for references
        if (active == "locked") {
            weatherImage.current.classList.remove('correct');
            weatherImage.current.classList.remove('incorrect');
            highNumBox.current.classList.remove('correct');
            highNumBox.current.classList.remove('partial');
            highNumBox.current.classList.remove('incorrect');
            lowNumBox.current.classList.remove('correct');
            lowNumBox.current.classList.remove('partial');
            lowNumBox.current.classList.remove('incorrect');
            humidNumBox.current.classList.remove('correct');
            humidNumBox.current.classList.remove('partial');
            humidNumBox.current.classList.remove('incorrect');
            precipNumBox.current.classList.remove('correct');
            precipNumBox.current.classList.remove('partial');
            precipNumBox.current.classList.remove('incorrect');
        }
    }, [active]);

    // Convert temperature inputs to their conterpart when isFah is changed
    useEffect(() => {
        if (isFah) { // Celcius -> Fahrenheit, mm -> in
            setHigh(Math.round((high * 9 / 5) + 32));
            setLow(Math.round((low * 9 / 5) + 32));
            setPrecipitation(Math.round(100 * (precipitation / 25.4)) / 100);
        } else { // Fahrenheit -> Celcius, in -> mm
            setHigh(Math.round((high - 32) * 5/9));
            setLow(Math.round((low - 32) * 5/9));
            setPrecipitation(Math.round(10 * (precipitation * 25.4)) / 10);
        }
    }, [isFah]);

    function submitForcastAnswer() {
        // Convert temperature stats from kelvin to either fahrenheit or celcius
        const statHigh = isFah ? (Math.round((weatherStats.temp_max - 273.15) * (9 / 5) + 32)) : (Math.round(weatherStats.temp_max - 273.15));
        const statLow = isFah ? Math.round((weatherStats.temp_min - 273.15) * (9 / 5) + 32) : Math.round(weatherStats.temp_min - 273.15);
        // Also convert mm to in if need be
        const statPrecip = isFah ? Math.round(100 * (weatherStats.precipitation / 25.4)) / 100.0 : Math.round(10 * weatherStats.precipitation) / 10.0;
        console.log(statPrecip, weatherStats.precipitation);

        // Calculate the differences between the actual values and the inputs
        const weatherDiff = idToWeatherString(weatherId) === weather;
        const highDiff = (high - statHigh);
        const lowDiff = (low - statLow);
        const humidDiff = (humidity - Math.round(weatherStats.humidity));
        const precipDiff = (precipitation - statPrecip);

        // Create an array to push evaluation to stateful variable, as well as high low metrics
        let evalu = ['nan', 'nan', 'nan', 'nan', 'nan'];
        let hL = ['close', 'close', 'close', 'close'];

        // Based on the differences, color and lock the previous inputs
        // Eval weather
        if (weatherImage.current) {
            weatherImage.current.classList.add(weatherDiff ? 'correct' : 'incorrect');
            evalu[0] = weatherDiff ? 'correct' : 'incorrect';
        }
        // Eval high
        evalu[1] = (isFah ? Math.abs(highDiff) <= 10 : Math.abs(highDiff) <= 4) ? (
            (isFah ? Math.abs(highDiff) <= 3 : Math.abs(highDiff) <= 1) ? 'correct' : 'partial') : 'incorrect';
        hL[0] = (evalu[1] !== "correct" ? (highDiff < 0 ? "higher" : "lower") : "close");
        highNumBox.current.classList.add(evalu[1]);
        // Eval low
        evalu[2] = (isFah ? Math.abs(lowDiff) <= 10 : Math.abs(lowDiff) <= 4) ? (
            (isFah ? Math.abs(lowDiff) <= 3 : Math.abs(lowDiff) <= 1) ? 'correct' : 'partial') : 'incorrect';
        hL[1] = (evalu[2] !== "correct" ? (lowDiff < 0 ? "higher" : "lower") : "close");
        lowNumBox.current.classList.add(evalu[2]);
        // Eval humid
        evalu[3] = (Math.abs(humidDiff) <= 10) ? (
            (Math.abs(humidDiff) <= 3) ? 'correct' : 'partial') : 'incorrect';
        hL[2] = (evalu[3] !== "correct" ? (humidDiff < 0 ? "higher" : "lower") : "close");
        humidNumBox.current.classList.add(evalu[3]);
        // Eval precip
        evalu[4] = (isFah ? Math.abs(precipDiff) <= 0.1 : Math.abs(precipDiff) <= 3) ? (
            (isFah ? Math.abs(precipDiff) <= 0.03 : Math.abs(precipDiff) <= 0.5) ? 'correct' : 'partial') : 'incorrect';
        hL[3] = (evalu[4] !== "correct" ? (precipDiff < 0 ? "higher" : "lower") : "close");
        precipNumBox.current.classList.add(evalu[4]);

        // Create a copy of the current accepts array, and seed the results into this index slot
        let newAccepts = [...accepts];
        newAccepts[i] = evalu;
        setAccepts(newAccepts);
        setEnabled("complete");

        // Update higherLower
        setHighLow(hL);

        // Report results and unlock next card if not completely correct
        activateNext(evalu.filter(state => state !== "correct").length === 0);
    }

    function idToWeatherString(weatherId) {
        // Lets switch to determine what id case we hit
        switch (true) {
            case (weatherId >= 200 && weatherId < 300): // This is the ID range for a thunder storm
                return "Stormy"; // Return the associated string
            case (weatherId >= 300 && weatherId < 400): // This is the ID range for a drizzle
                return "Rainy"; // Return the associated string
            case (weatherId >= 500 && weatherId < 600): // This is the ID range for a heavy rain
                return "Rainy"; // Return the associated string
            case (weatherId >= 600 && weatherId < 700): // This is the ID range for a snow storm
                return "Snowy"; // Return the associated string
            case (weatherId >= 700 && weatherId < 800): // This is the ID range for an atmospheric event
                return "Atmospheric"; // Return the associated string
            case (weatherId === 800): // This is the exact ID for clear weather
                return "Sunny"; // Return the associated string
            case (weatherId === 801 || weatherId === 802): // This is the ID range for partial clouds
                return "Partial Cloudy"; // Return the associated string
            case (weatherId === 803 || weatherId === 804): // This is the ID range for clouds
                return "Cloudy"; // Return the associated string
        }
    }

    return (
        <div className={"card" + (enabled != "false" ? "" : " deactivated") + ((enabled == "complete" || enabled == "locked") ? " completed" : "")}>
            {enabled != "false" &&
                <>
                <div className="dataBox">
                    <ImageDropdown setSelected={setWeather} active={enabled} ref={weatherImage} />
                </div>
                <div className="dataBox">
                    <p>{isMobile ? "Temp" : "Temperature"}:</p>
                    <div ref={highNumBox} className="numBox" id="high">
                        <label>{highLow ? (highLow[0] === "higher" ? "↑" : (highLow[0] === "lower" ? "↓" : "")) : ""} </label>
                        <label>H: </label>
                        <input disabled={enabled != "true" ? 'true' : ''} onChange={e => setHigh(e.target.value)} value={high} type="number" min="-99" max="999"/>
                        <label>{isFah ? "°F" : "°C"}</label>
                    </div>
                    <div ref={lowNumBox} className="numBox" id="low">
                        <label>{highLow ? (highLow[1] === "higher" ? "↑" : (highLow[1] === "lower" ? "↓" : "")) : ""} </label>
                        <label>L: </label>
                        <input disabled={enabled != "true" ? 'true' : ''} onChange={e => (e.target.value >= -99 && e.target.value <= 999) ? setLow(e.target.value) : e.target.value = low} value={low} type="number"/>
                        <label>{isFah ? "°F" : "°C"}</label>
                    </div>
                </div>
                <div className="dataBox">
                    <p>{isMobile ? "Humid" : "Humidity"}:</p>
                    <div ref={humidNumBox} className="numBox" id="humid">
                        <label>{highLow ? (highLow[2] === "higher" ? "↑" : (highLow[2] === "lower" ? "↓" : "")) : ""} </label>
                        <input disabled={enabled != "true" ? 'true' : ''} onChange={e => (e.target.value >= 0 && e.target.value <= 100) ? setHumidity(e.target.value) : e.target.value = humidity} value={humidity} type="number"/>
                        <label>%</label>
                    </div>
                    <p>{isMobile ? "Precip" : "Precipitation"}:</p>
                    <div ref={precipNumBox} className="numBox" id="precip">
                        <label>{highLow ? (highLow[3] === "higher" ? "↑" : (highLow[3] === "lower" ? "↓" : "")) : ""} </label>
                        <input disabled={enabled != "true" ? 'true' : ''} onChange={e => setPrecipitation(e.target.value)} value={precipitation} type="number" min="0" max="99.9"/>
                        <label>{isFah ? '"' : "mm"}</label>
                    </div>
                </div>
                {enabled == "true" &&
                    <button onClick={submitForcastAnswer}>
                        {isMobile ? "Sub." : "Submit"}
                    </button>
                }
                </>
            }
        </div>
    )
}