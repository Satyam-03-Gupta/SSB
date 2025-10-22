import React from 'react';
import './LocationMap.css';

const LocationMap = () => {
  const latitude = 12.9142;
  const longitude = 80.1601;
  
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="location-map">
      <div className="map-header">
        <h3>📍 Our Location</h3>
        <p>13°03'28.8"N 80°13'56.6"E</p>
      </div>
      
      <div className="map-container">
        <iframe
          src={googleMapsUrl}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      
      <div className="map-actions">
        <a 
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="directions-btn"
        >
          🧭 Get Directions
        </a>
      </div>
    </div>
  );
};

export default LocationMap;