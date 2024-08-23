export default function Results({ accepts, winState, weatherId, weatherStats, location, isFah }) {
    function getAcceptsAttempts() {
        // Use a variable to count the number of arrays in accepts whose values are not 'undeter'
        let length = 0;
        accepts.forEach(val => {
            if (val[0] !== 'undeter')
                length++;
        });
        return length
    }

    function getWeatherImage() {
        // Lets switch to determine what id case we hit
        switch (true) {
            case (weatherId >= 200 && weatherId < 300): // This is the ID range for a thunder storm
                return "images/stormy.png"; // Return the associated image
            case (weatherId >= 300 && weatherId < 400): // This is the ID range for a drizzle
                return "images/rainy.png"; // Return the associated image
            case (weatherId >= 500 && weatherId < 600): // This is the ID range for a heavy rain
                return "images/rainy.png"; // Return the associated image
            case (weatherId >= 600 && weatherId < 700): // This is the ID range for a snow storm
                return "images/snowy.png"; // Return the associated image
            case (weatherId >= 700 && weatherId < 800): // This is the ID range for an atmospheric event
                return "images/atmosphere.png"; // Return the associated image
            case (weatherId === 800): // This is the exact ID for clear weather
                return "images/sunny.png"; // Return the associated image
            case (weatherId === 801 || weatherId === 802): // This is the ID range for partial clouds
                return "images/partialCloudy.png"; // Return the associated image
            case (weatherId === 803 || weatherId === 804): // This is the ID range for clouds
                return "images/cloudy.png"; // Return the associated image
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
        <div className="resultsBlock">
            <p>{winState ? `Congradulations! You predicted yesterday's forecast in ${getAcceptsAttempts()} predictions:` : "You didn't get yesterday's forecast within 5 predictions... better luck tomorrow?"}</p>
            <div className="horizontalCard">
                <div className="dataBox">
                    <p>{location ? location[location.length - 2] : ""}</p>
                    <img src={getWeatherImage()} alt="" />
                </div>
                <div className="dataBox">
                    <p>Temperature:</p>
                    <div className="numBox" id="high">
                        <p>H: {isFah ? (Math.round((weatherStats.temp_max - 273.15) * (9 / 5) + 32)) : (Math.round(weatherStats.temp_max - 273.15))}{isFah ? "°F" : "°C"}</p>
                    </div>
                    <div className="numBox" id="low">
                        <p>L: {isFah ? Math.round((weatherStats.temp_min - 273.15) * (9 / 5) + 32) : Math.round(weatherStats.temp_min - 273.15)}{isFah ? "°F" : "°C"}</p>
                    </div>
                </div>
                <div className="dataBox">
                    <p>Humidity:</p>
                    <div className="numBox" id="humid">
                        <p>{Math.round(weatherStats.humidity)}%</p>
                    </div>
                    <p>Precipitation:</p>
                    <div className="numBox" id="precip">
                        <p>{isFah ? Math.round(100 * (weatherStats.precipitation / 25.4)) / 100.0 : Math.round(10 * weatherStats.precipitation) / 10.0}{isFah ? '"' : "mm"}</p>
                    </div>
                </div>
            </div>
            <p>Today's Score:</p>
            <div className="scoreGrid">
                <div>{stateToEmoji(accepts[0][0])}     {stateToEmoji(accepts[1][0])}     {stateToEmoji(accepts[2][0])}     {stateToEmoji(accepts[3][0])}     {stateToEmoji(accepts[4][0])}</div>
                <div>{stateToEmoji(accepts[0][1])}     {stateToEmoji(accepts[1][1])}     {stateToEmoji(accepts[2][1])}     {stateToEmoji(accepts[3][1])}     {stateToEmoji(accepts[4][1])}</div>
                <div>{stateToEmoji(accepts[0][2])}     {stateToEmoji(accepts[1][2])}     {stateToEmoji(accepts[2][2])}     {stateToEmoji(accepts[3][2])}     {stateToEmoji(accepts[4][2])}</div>
                <div>{stateToEmoji(accepts[0][3])}     {stateToEmoji(accepts[1][3])}     {stateToEmoji(accepts[2][3])}     {stateToEmoji(accepts[3][3])}     {stateToEmoji(accepts[4][3])}</div>
                <div>{stateToEmoji(accepts[0][4])}     {stateToEmoji(accepts[1][4])}     {stateToEmoji(accepts[2][4])}     {stateToEmoji(accepts[3][4])}     {stateToEmoji(accepts[4][4])}</div>
            </div>
        </div>
    )
}