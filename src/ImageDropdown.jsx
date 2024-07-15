import React, { useState, useEffect, forwardRef} from 'react';

export default forwardRef(({setSelected, active}, ref) => {
    const [selectedImage, setSelectedImage] = useState('images/atmosphere.png');

    const images = [
        { id: 1, url: 'images/atmosphere.png', label: 'Atmospheric' },
        { id: 2, url: 'images/cloudy.png', label: 'Cloudy' },
        { id: 3, url: 'images/partialCloudy.png', label: 'Partial Cloudy' },
        { id: 4, url: 'images/rainy.png', label: 'Rainy' },
        { id: 5, url: 'images/snowy.png', label: 'Snowy' },
        { id: 6, url: 'images/stormy.png', label: 'Stormy' },
        { id: 7, url: 'images/sunny.png', label: 'Sunny' },
        { id: 8, url: 'images/windy.png', label: 'Windy' },
        // Add more images as needed
    ];

    useEffect(() => {
        handleSelectImage(images[0]);
    }, [])

    const handleSelectImage = (image) => {
        setSelected(image.label);
        setSelectedImage(image.url);
    };

    return (
        <div ref={ref}>
            <select onChange={(e) => active == "true" ? handleSelectImage(images[e.target.selectedIndex]) : ""} disabled={ active != "true" ? "true" : ''}>
                {images.map((image) => (
                    <option key={image.id} value={image.id}>{image.label}</option>
                ))}
            </select>
            {selectedImage && <img className="weatherImg" src={selectedImage} alt=""/>}
        </div>
    );
})