import React, { useState } from "react";
import '../src/App.css';
import api from '../lib/axios.js';

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    item: "",
    quantity: 1,
    message: "",
    deliveryLocation: { address: "" }
  });
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting order:', formData);
    try {
      // Get location if useCurrentLocation is true
      if (useCurrentLocation) {
        try {
          const position = await getCurrentLocation();
          formData.deliveryLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: formData.deliveryLocation.address || 'Current Location'
          };
        } catch (error) {
          console.log('Location error:', error);
        }
      }
      
      const response = await api.post('/api/subscriptions', formData);
      console.log('Order response:', response.data);
      alert("Thank you! Your order has been placed.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        item: "",
        quantity: 1,
        message: "",
        deliveryLocation: { address: "" }
      });
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert(`Error placing order: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <section className="order-section">
      <div className="order-container">
        <h2>Place Your Order</h2>
        <form onSubmit={handleSubmit} className="order-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="item"
            placeholder="Item Name"
            value={formData.item}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantity"
            min="1"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
          <div className="location-group">
            <div className="location-input">
              <input
                type="text"
                name="address"
                placeholder="Delivery Address"
                value={formData.deliveryLocation.address}
                onChange={(e) => setFormData({...formData, deliveryLocation: {...formData.deliveryLocation, address: e.target.value}})}
                required
              />
              <span className="location-icon">📍</span>
            </div>
            <label className="location-checkbox">
              <input
                type="checkbox"
                checked={useCurrentLocation}
                onChange={(e) => setUseCurrentLocation(e.target.checked)}
              />
              📍 Use my current location for delivery
            </label>
          </div>
          <textarea
            name="message"
            placeholder="Additional Notes"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <button type="submit">Submit Order</button>
        </form>
      </div>
    </section>
  );
};

export default Reservation;
