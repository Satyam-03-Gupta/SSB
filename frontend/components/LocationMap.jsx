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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6121.491847161978!2d80.16111179339356!3d12.913309500487433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525f004246e643%3A0xe2b4d7e9e5e6a31a!2sSupreme%20Star%20Briyani%20%5BETHiCs%20BROTHERS%5D!5e0!3m2!1sen!2sin!4v1761423949721!5m2!1sen!2sin" 
          width="100%" 
          height="450" 
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