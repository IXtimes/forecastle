import React, { useState, useEffect } from 'react';

export default function Infobox({ updateStatus, context, accepts, weatherId, weatherStats, loc, isFah, dayIndex }) {
    const [date, setDate] = useState(null);

    useEffect(() => {
        let date = new Date((1724395440 - 86400 * 2) * 1000 + (dayIndex * 86400000));
        date.setUTCHours(12, 0, 0, 0);
        setDate(date);
        
    }, [])

    function getAcceptsAttempts() {
        // Use a variable to count the number of arrays in accepts whose values are not 'undeter'
        let length = 0;
        accepts.forEach(val => {
            if (val[0] !== 'undeter')
                length++;
        });
        return length
    }

    function getWeatherDescription() {
        // Lets switch to determine what id case we hit
        switch (true) {
            case (weatherId >= 200 && weatherId < 300): // This is the ID range for a thunder storm
                return "stormy"; // Return the associated image
            case (weatherId >= 300 && weatherId < 400): // This is the ID range for a drizzle
                return "rainy"; // Return the associated image
            case (weatherId >= 500 && weatherId < 600): // This is the ID range for a heavy rain
                return "rainy"; // Return the associated image
            case (weatherId >= 600 && weatherId < 700): // This is the ID range for a snow storm
                return "snowy"; // Return the associated image
            case (weatherId >= 700 && weatherId < 800): // This is the ID range for an atmospheric event
                return "atmospheric"; // Return the associated image
            case (weatherId === 800): // This is the exact ID for clear weather
                return "sunny"; // Return the associated image
            case (weatherId === 801 || weatherId === 802): // This is the ID range for partial clouds
                return "partially cloudy"; // Return the associated image
            case (weatherId === 803 || weatherId === 804): // This is the ID range for clouds
                return "cloudy"; // Return the associated image
        }
    }

    function stateToEmoji(state) {
        switch (state) {
            case 'correct':
                return "🟩";
            case 'partial':
                return "🟨";
            case 'incorrect':
                return "🟥";
            case 'undeter':
                return "⬛";
        }
    }

    return (
        <div className="grayOut">
            <div className="infoCard">
                {
                    (context !== "attempted") &&
                    <button className="xButton" onClick={() => updateStatus(false)}>
                    X
                    </button>
                }
                {(context === "info") && 
                    <>
                        <h1>Welcome to Forecastle</h1>
                        <h4>The weather forecast guessing game taken worldwide!</h4>
                        <div className="textContent">
                            <h2>How to Play</h2>
                            <p>Every day, we gather the weather information for a random place on the planet that was observed yesterday. The goal is to guess what the weather conditions where for that place... yesterday. <br/><br/>
                                (Ik its not a "forecast" per say but run with me).<br /><br />
                                You will get 5 guesses to predict what the weather condition was (captured at about midnight CST) as well as that day's temperature high and low, the total precipitation, and the average humidity observed throughout the day. Easy right?<br /><br />
                            By the way, you can toggle between imperial and metric units using the {isFah ? '°F' : '°C'} toggle on the right, in case those units are more familiar for you!
                            </p>
                            <h2>Scoring</h2>
                            <p>After you have made your guess for these estimates and press submit, you will be graded based on how close you were to the ACTUAL observed weather statistics. The highlight key is as follows:<br /><br/>
                            🟩 - Your guess is <em>close</em> enough to the actual value that its correct. You don't need to change this guess going forward.<br/><span className="detailerText">This may not be the <em>exact</em> value recorded, but its meteorology. Close enough is good enough :).</span><br/>
                            🟨 - Your guess is nearing the actual value, but its still a little too far off to be correct.<br/> <span className="detailerText">For temperatures this means within about {isFah ? '10°F' : '3°C'}, humidity about 10%, and precipitation {isFah ? '0.1"' : '3mm'} within the actual value!</span><br/>
                            🟥 - Your guess is very far off from the actual value, be more experimental with the next one!<br/><span className="detailerText">For weather conditions, anything BUT the correct answer is marked 🟥, so just because it may be marked wrong doesn't mean you aren't close!</span><br/><br/>

                                In addition to your guess being highlighted, if it was marked as 🟨 or 🟥, then you are also given an arrow directing your next guess:<br/>
                                A ↑ means the ACTUAL value is HIGHER than what you submitted, so you should guess higher next time :).<br/>
                                A ↓ means the ACTUAL value is LOWER than what you submitted, so you should guess lower next time :).<br/>
                            </p>
                            <h2>Scope</h2>
                            <p>Anywhere in the world with valid weather data (that isn't like in the middle of nowhere) is possible to be selected. You can hover over the name of the location to get some aliases that might help you better mentally pinpoint where the location is.
                                But, if you are struggling there is also a link to where the location is on Google maps.
                            </p>
                            <h2>Cookies</h2>
                            <p>This site only uses cookies to store if you have completed today's puzzle, your unit preference, and the results of today's puzzle. We DON'T use your cookies beyond these simple features!
                            </p>
                    </div>
                    </>
                }
                {(context === "win") && 
                    <>
                        <h1>Congradulations! You Did It!</h1>
                        <h4>You predicted yesterday's forecast in {getAcceptsAttempts()} predictions!</h4>
                        <div className="textContent">
                            <h2>Actual Data</h2>
                            <p>It was {getWeatherDescription()} in {loc ? loc[loc.length - 2] : ""} on {date && date.toDateString()}!</p>
                            <p>The high that day was {isFah ? (Math.round((weatherStats.temp_max - 273.15) * (9 / 5) + 32)) : (Math.round(weatherStats.temp_max - 273.15))}{isFah ? "°F" : "°C"} and the low was {isFah ? Math.round((weatherStats.temp_min - 273.15) * (9 / 5) + 32) : Math.round(weatherStats.temp_min - 273.15)}{isFah ? "°F" : "°C"}.</p>
                            <p>Throughout the day the humidity, on average, was {Math.round(weatherStats.humidity)}%.</p>
                            <p>The overall precipitation measured throughout the day was {isFah ? Math.round(100 * (weatherStats.precipitation / 25.4)) / 100.0 : Math.round(10 * weatherStats.precipitation) / 10.0}{isFah ? '"' : "mm"}.</p>
                            <p><br /><br /><br />Great Job! Will you ace tomorrow's forecast?</p>
                            <h2><br /><br />Results</h2>
                        <p>If you want a trendy grid representing your score today to share with your friends here you go!:</p>
                        <div className="scoreGrid">
                            <div>{stateToEmoji(accepts[0][0])}     {stateToEmoji(accepts[1][0])}     {stateToEmoji(accepts[2][0])}     {stateToEmoji(accepts[3][0])}     {stateToEmoji(accepts[4][0])}</div>
                            <div>{stateToEmoji(accepts[0][1])}     {stateToEmoji(accepts[1][1])}     {stateToEmoji(accepts[2][1])}     {stateToEmoji(accepts[3][1])}     {stateToEmoji(accepts[4][1])}</div>
                            <div>{stateToEmoji(accepts[0][2])}     {stateToEmoji(accepts[1][2])}     {stateToEmoji(accepts[2][2])}     {stateToEmoji(accepts[3][2])}     {stateToEmoji(accepts[4][2])}</div>
                            <div>{stateToEmoji(accepts[0][3])}     {stateToEmoji(accepts[1][3])}     {stateToEmoji(accepts[2][3])}     {stateToEmoji(accepts[3][3])}     {stateToEmoji(accepts[4][3])}</div>
                            <div>{stateToEmoji(accepts[0][4])}     {stateToEmoji(accepts[1][4])}     {stateToEmoji(accepts[2][4])}     {stateToEmoji(accepts[3][4])}     {stateToEmoji(accepts[4][4])}</div>
                        </div>
                        <p>Just dont forget to tell them about Forecastle :)</p>
                        <p><br /><br /><br />Before you go, you might like some of my other projects at <a href="https://www.ixtimes.net">ixtimes.net</a>! Give them a try if you enjoyed :)</p>
                        </div>
                    </>
                }
                {(context === "lose") && 
                    <>
                        <h1>Better Luck Next Time!</h1>
                        <h4>You weren't able to predict yesterday's forecast within 5 predictions!</h4>
                        <div className="textContent">
                            <h2>Actual Data</h2>
                            <p>It was {getWeatherDescription()} in {loc ? loc[loc.length - 2] : ""} on {date && date.toDateString()}!</p>
                            <p>The high that day was {isFah ? (Math.round((weatherStats.temp_max - 273.15) * (9 / 5) + 32)) : (Math.round(weatherStats.temp_max - 273.15))}{isFah ? "°F" : "°C"} and the low was {isFah ? Math.round((weatherStats.temp_min - 273.15) * (9 / 5) + 32) : Math.round(weatherStats.temp_min - 273.15)}{isFah ? "°F" : "°C"}.</p>
                            <p>Throughout the day the humidity, on average, was {Math.round(weatherStats.humidity)}%.</p>
                            <p>The overall precipitation measured throughout the day was {isFah ? Math.round(100 * (weatherStats.precipitation / 25.4)) / 100.0 : Math.round(10 * weatherStats.precipitation) / 10.0}{isFah ? '"' : "mm"}.</p>
                            <p><br /><br /><br />Maybe you will have better luck tomorrow?</p>
                            <h2><br /><br />Results</h2>
                        <p>If you want a trendy grid representing your score today to share with your friends here you go!:</p>
                        <div className="scoreGrid">
                            <div>{stateToEmoji(accepts[0][0])}     {stateToEmoji(accepts[1][0])}     {stateToEmoji(accepts[2][0])}     {stateToEmoji(accepts[3][0])}     {stateToEmoji(accepts[4][0])}</div>
                            <div>{stateToEmoji(accepts[0][1])}     {stateToEmoji(accepts[1][1])}     {stateToEmoji(accepts[2][1])}     {stateToEmoji(accepts[3][1])}     {stateToEmoji(accepts[4][1])}</div>
                            <div>{stateToEmoji(accepts[0][2])}     {stateToEmoji(accepts[1][2])}     {stateToEmoji(accepts[2][2])}     {stateToEmoji(accepts[3][2])}     {stateToEmoji(accepts[4][2])}</div>
                            <div>{stateToEmoji(accepts[0][3])}     {stateToEmoji(accepts[1][3])}     {stateToEmoji(accepts[2][3])}     {stateToEmoji(accepts[3][3])}     {stateToEmoji(accepts[4][3])}</div>
                            <div>{stateToEmoji(accepts[0][4])}     {stateToEmoji(accepts[1][4])}     {stateToEmoji(accepts[2][4])}     {stateToEmoji(accepts[3][4])}     {stateToEmoji(accepts[4][4])}</div>
                        </div>
                        <p>Just dont forget to tell them about Forecastle :)</p>
                        <p><br /><br /><br />Before you go, you might like some of my other projects at <a href="https://www.ixtimes.net">ixtimes.net</a>! Give them a try if you enjoyed :)</p>
                        </div>
                    </>
                }
                
                {(context === "attempted" && loc) && 
                    <>
                        <h1>Looks like you've already played today's puzzle!</h1>
                        <h4>Since you already set a score, you will have to wait until tomorrow to set a new one!</h4>
                        <div className="textContent">
                            <h2>Actual Data</h2>
                            <p>It was {getWeatherDescription()} in {loc ? loc[loc.length - 2] : ""} on {date && date.toDateString()}!</p>
                            <p>The high that day was {isFah ? (Math.round((weatherStats.temp_max - 273.15) * (9 / 5) + 32)) : (Math.round(weatherStats.temp_max - 273.15))}{isFah ? "°F" : "°C"} and the low was {isFah ? Math.round((weatherStats.temp_min - 273.15) * (9 / 5) + 32) : Math.round(weatherStats.temp_min - 273.15)}{isFah ? "°F" : "°C"}.</p>
                            <p>Throughout the day the humidity, on average, was {Math.round(weatherStats.humidity)}%.</p>
                            <p>The overall precipitation measured throughout the day was {isFah ? Math.round(100 * (weatherStats.precipitation / 25.4)) / 100.0 : Math.round(10 * weatherStats.precipitation) / 10.0}{isFah ? '"' : "mm"}.</p>
                            <p><br /><br /><br />Try again tomorrow!</p>
                            <h2><br /><br />Results</h2>
                        <p>If you want a trendy grid representing your score today to share with your friends here you go!:</p>
                        <div className="scoreGrid">
                            <div>{stateToEmoji(accepts[0][0])}     {stateToEmoji(accepts[1][0])}     {stateToEmoji(accepts[2][0])}     {stateToEmoji(accepts[3][0])}     {stateToEmoji(accepts[4][0])}</div>
                            <div>{stateToEmoji(accepts[0][1])}     {stateToEmoji(accepts[1][1])}     {stateToEmoji(accepts[2][1])}     {stateToEmoji(accepts[3][1])}     {stateToEmoji(accepts[4][1])}</div>
                            <div>{stateToEmoji(accepts[0][2])}     {stateToEmoji(accepts[1][2])}     {stateToEmoji(accepts[2][2])}     {stateToEmoji(accepts[3][2])}     {stateToEmoji(accepts[4][2])}</div>
                            <div>{stateToEmoji(accepts[0][3])}     {stateToEmoji(accepts[1][3])}     {stateToEmoji(accepts[2][3])}     {stateToEmoji(accepts[3][3])}     {stateToEmoji(accepts[4][3])}</div>
                            <div>{stateToEmoji(accepts[0][4])}     {stateToEmoji(accepts[1][4])}     {stateToEmoji(accepts[2][4])}     {stateToEmoji(accepts[3][4])}     {stateToEmoji(accepts[4][4])}</div>
                        </div>
                        <p>Just dont forget to tell them about Forecastle :)</p>
                        <p><br /><br /><br />Before you go, you might like some of my other projects at <a href="https://www.ixtimes.net">ixtimes.net</a>! Give them a try if you enjoyed :)</p>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}