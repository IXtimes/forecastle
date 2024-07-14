import React, { useState } from 'react';
import WeatherForm from "./WeatherForm.jsx";
import Card from "./Card.jsx";
import ForecastleGame from './ForecastleGame.jsx';

function App() {
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [geocodeData, setGeocodeData] = useState(null);

  return (
    <>
      <h1>Forecastle</h1>
      <ForecastleGame/>
    </>
  )
}

export default App;
