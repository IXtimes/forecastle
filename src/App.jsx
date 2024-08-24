import React, { useState } from 'react';
import ForecastleGame from './ForecastleGame.jsx';

function App() {
  return (
    <>
      <div className='forecastleBody'>
        <h1>Forecastle</h1>
        <ForecastleGame/>
      </div>
      <footer>
        <p>
          Created by Xander Corcoran (IXtimes)<br />
          © 2024 copyright reserved<br />
        See more on <a href="https://www.ixtimes.net">ixtimes.net</a>!</p>
      </footer>
    </>
  )
}

export default App;
