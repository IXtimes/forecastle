import React, { useState, useEffect } from 'react';
import GuessPanel from './GuessPanel';
import Tooltip from './Tooltip';
import ToggleSwitch from './ToggleSwitch';
import Results from './Results';
import Infobox from './Infobox';

export default function ForecastleGame() { 
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(0);
    const [stats, setStats] = useState(null);
    const [isFah, setIsFah] = useState(true);
    const [numricLocation, setNumricLocation] = useState([0.0, 0.0]);
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
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [dailyRow, setDailyRow] = useState(0);
    const [infoContext, setInfoContext] = useState("info");
    const passKey = import.meta.env.VITE_FORECASTLE_PASSKEY;

    useEffect(() => {
        // Get today's Forecastle
        try {
            GetTodaysForecastle();
        } catch (error) {
            console.error(error);
        }

        // Show info box
        setShowInfoBox(true);
    }, [])

    async function GetTodaysForecastle() {
        // Make a call to my website to get today's forcast data (index is determined from days since first entry timestamp, Aug. 23, 2024 @ 01:44.00 CST)
        let date = new Date();
        let unixTimestamp = Math.floor(date.getTime() / 1000);
        let dailyIndex = Math.floor((unixTimestamp - 1724395440) / 86400) + 1;
        setDailyRow(dailyIndex);
        const response = await
            fetch(`https://ixtimes.net/api/forecastle.php?id=${dailyIndex}&passkey=${passKey}`);
        
        if (!response.ok)
            throw new Error("Could not fetch weather data");

        // From response, set stateful variables
        const json = await response.json();
        setLocation(JSON.parse(json[0][3]));
        setWeather(Number(json[0][1]));
        setStats(JSON.parse(json[0][2]));
        setNumricLocation([Number(json[0][4]), Number(json[0][5])]);
    }

    function activateNext(winningState) {
        if (winningState) {
            setGameOver(true);
            setWinState(true);
            setInfoContext("win");
            setShowInfoBox(true);

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
            setInfoContext("lose");
            setShowInfoBox(true);

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
            <button className='infoButton' onClick={() => { setShowInfoBox(true); setInfoContext("info")}}>i</button>
            {showInfoBox &&
                <Infobox updateStatus={setShowInfoBox} context={infoContext} accepts={accepts} winState={winState} weatherId={weather} weatherStats={stats} loc={location} isFah={isFah} dayIndex={dailyRow} />
            }
            <div className="prompt">
                <Tooltip location={location} numaricLocation={numricLocation} dayIndex={dailyRow} />
                <ToggleSwitch labelOn="°F" labelOff="°C" toggle={isFah} setToggle={setIsFah}/>
            </div>
            <div className="gameCards">
                <GuessPanel active={actives[0]} i={0} activateNext={activateNext} accepts={accepts} setAccepts={setAccepts} weatherId={weather} weatherStats={stats} isFah={isFah}/>
                <GuessPanel active={actives[1]} i={1} activateNext={activateNext} accepts={accepts} setAccepts={setAccepts} weatherId={weather} weatherStats={stats} isFah={isFah}/>
                <GuessPanel active={actives[2]} i={2} activateNext={activateNext} accepts={accepts} setAccepts={setAccepts} weatherId={weather} weatherStats={stats} isFah={isFah}/>
                <GuessPanel active={actives[3]} i={3} activateNext={activateNext} accepts={accepts} setAccepts={setAccepts} weatherId={weather} weatherStats={stats} isFah={isFah}/>
                <GuessPanel active={actives[4]} i={4} activateNext={activateNext} accepts={accepts} setAccepts={setAccepts} weatherId={weather} weatherStats={stats} isFah={isFah}/>
            </div>
            {gameOver &&
                <Results accepts={accepts} winState={winState} weatherId={weather} weatherStats={stats} location={location} isFah={isFah}/>
            }
        </>
    );
}