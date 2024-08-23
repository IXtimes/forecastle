import React, { useState, useEffect } from 'react';

export default function Tooltip({ location, numaricLocation }) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [date, setDate] = useState(null);
    const dayOffset = 0;

    useEffect(() => {
        let date = new Date();
        date.setDate(date.getDate() - 1 + dayOffset);
        date.setUTCHours(12, 0, 0, 0);
        setDate(date);
        
    }, [])

    function handleMouseIn(e) {
        setVisible(true);
        setPosition({ x: e.clientX, y: e.clientY });
    }

    function handleMouseMove(e) {
        if(visible)
            setPosition({ x: e.clientX, y: e.clientY });
    }

    function handleMouseOut() {
        setVisible(false);
    }

    return (
        <>
            <p>
                What was the forecast on {date && date.toUTCString()} in <span
                    onMouseEnter={handleMouseIn}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseOut}
                    className='localStyle'>
                    {location ? location[location.length - 2] : ""}
                </span>?
            </p>
            <a href={`https://maps.google.com/?q=${numaricLocation[0]},${numaricLocation[1]}`} target="_blank">
                Where is that on a map?
            </a>
            { visible &&
                <div className='tooltip' style={{
                    position: 'absolute',
                    left: `${position.x + 3}px`,
                    top: `${position.y + 3}px`,
                }}>
                    More specifically: {location.map((loc, i) => (
                        <div style={{fontSize: '1.5rem', color: 'hsl(0, 0%, 80%)'}} key = {i}>
                            {loc}
                        </div>
                    ))}
                </div>
            }
        </>
    );
}