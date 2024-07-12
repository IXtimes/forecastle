import React, { useEffect} from 'react'

function Card({ weatherData, error, geocodeData}) {
    useEffect(() => {
        console.log(weatherData);
        console.log(weatherData || error);
    }, [weatherData]);
    useEffect(() => {
        console.log(error);
        console.log(weatherData || error);
    }, [error])

    const renderWeatherCard = () => {
        // Decompose our object into several feilds
        const { main: { temp, humidity, feels_like },
                weather: [{ description, id }]
        } = weatherData;
        const { results: [{ formatted_address }] } = geocodeData;
        
        // Render those fields
        return (
            <>
                <h1 className="cityDisplay">{formatted_address}</h1>
                <p className='tempDisplay'>{((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F</p>
                <p className="feelsLike">{((feels_like - 273.15) * (9 / 5) + 32).toFixed(1)}°F</p>
                <p className="humidityDisplay">Humidity: {humidity}%</p>
                <p className="descDisplay">{description}</p>
                { /* We need to call another function to get a path to a weather image, based on the weather id */}
                <img className="weatherImg" src={getWeatherImage(id)} alt="weatherImg"/>
            </>
        )
    };

    function getWeatherImage(weatherId) {
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

    return (
        <div className="card" style={ weatherData || error ? { display: "flex" } : { display: "none" }}>
            {error && <p className="errorDisplay">{error}</p>}
            {weatherData && renderWeatherCard()}
        </div>
    );
};

export default Card;