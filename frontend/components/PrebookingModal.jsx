import React, { useState } from 'react';
import api from '../lib/axios';
import './PrebookingModal.css';

const PrebookingModal = ({ isOpen, onClose, cartItems, totalAmount }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    preferredDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Use coordinates directly since we don't have a geocoding API key
          const address = `${latitude}, ${longitude}`;
          setFormData({...formData, address});
          setGettingLocation(false);
        },
        () => {
          alert('Unable to get location. Please enter address manually.');
          setGettingLocation(false);
        }
      );
    } else {
      alert('Geolocation not supported by this browser.');
      setGettingLocation(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const prebookingData = {
        orderId: `PRE${Date.now()}`,
        userEmail: formData.email,
        phoneNumber: formData.phone,
        deliveryAddress: formData.address,
        items: cartItems,
        subtotal: totalAmount,
        deliveryFee: 50,
        gst: Math.round(totalAmount * 0.18),
        totalAmount: totalAmount + 50 + Math.round(totalAmount * 0.18),
        preferredDate: formData.preferredDate
      };

      await api.post('/api/prebookings', prebookingData);
      alert('Prebooking created successfully! We will contact you when the store reopens.');
      setFormData({ email: '', phone: '', address: '', preferredDate: '' });
      onClose();
    } catch (error) {
      alert('Error creating prebooking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="prebooking-overlay">
      <div className="prebooking-modal">
        <div className="prebooking-header">
          <h2>📅 Make a Prebooking</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="prebooking-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Delivery Address:</label>
            <div className="address-input-row">
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter your delivery address manually"
                className="address-input"
              />
              <button 
                type="button" 
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="location-btn"
              >
                {gettingLocation ? '📍 Getting...' : '📍 Current Location'}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Preferred Date:</label>
            <input
              type="date"
              required
              min={minDate}
              value={formData.preferredDate}
              onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
            />
          </div>
          
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items ({cartItems?.length || 0}):</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹50</span>
            </div>
            <div className="summary-row">
              <span>GST (18%):</span>
              <span>₹{Math.round(totalAmount * 0.18)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total Amount:</span>
              <span>₹{totalAmount + 50 + Math.round(totalAmount * 0.18)}</span>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="prebook-submit-btn">
            {loading ? 'Creating...' : 'Confirm Prebooking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrebookingModal;