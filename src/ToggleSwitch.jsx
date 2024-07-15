import React, { useState } from 'react';

function ToggleSwitch({ labelOn, labelOff, toggle, setToggle }) {
  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="toggle-switch">
          <button className={"slider" + (!toggle ? ' on' : '')} onClick={handleToggle}>{`${toggle ? labelOn : labelOff}`}</button>
    </div>
  );
}

export default ToggleSwitch;