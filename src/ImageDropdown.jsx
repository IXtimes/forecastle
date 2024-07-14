import React, { useState, useEffect } from 'react';

export default function ImageDropdown() {
    const [selectedImage, setSelectedImage] = useState({ id: 1, url: 'images/atmosphere.png', label: 'Atmospheric' });

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
        
    })

    const handleSelectImage = (image) => {
        setSelectedImage(image.url);
    };

    return (
        <div>
            <select onChange={(e) => handleSelectImage(images[e.target.selectedIndex])}>
                {images.map((image) => (
                    <option key={image.id} value={image.id}>{image.label}</option>
                ))}
            </select>
            {selectedImage && <img className="weatherImg" src={selectedImage} alt=""/>}
        </div>
    );
}