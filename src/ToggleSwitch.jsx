import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

function ToggleSwitch({ labelOn, labelOff, toggle, setToggle }) {
  const [cookies, setCookie] = useCookies();

  const handleToggle = () => {
    // Set cookie for later
    setCookie('isFah', !toggle ? 'true' : 'false')

    setToggle(!toggle);
  };

  return (
    <div className="toggle-switch">
          <button className={"slider" + (!toggle ? ' on' : '')} onClick={handleToggle}>{`${toggle ? labelOn : labelOff}`}</button>
    </div>
  );
}

export default ToggleSwitch;