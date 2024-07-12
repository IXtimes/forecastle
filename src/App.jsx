import React, { useState } from 'react';
import WeatherForm from "./WeatherForm.jsx";
import Card from "./Card.jsx";
import ForcastleGame from './ForcastleGame.jsx';

function App() {
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [geocodeData, setGeocodeData] = useState(null);

  return (
    <>
      <ForcastleGame/>
      <WeatherForm setWeatherData={setWeatherData} setError={setError} setGeocodeData={setGeocodeData}/>
      <Card weatherData={weatherData} error={error} geocodeData={geocodeData} />
    </>
  )
}

export default App;
