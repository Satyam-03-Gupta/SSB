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

const getAddressFromCoords = async (lat, lng) => {
  try {
    // Simple fallback - just use coordinates as address
    return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Location formatting error:', error);
    return 'Current Location';
  }
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "", location: { address: "" } });
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    console.log('Is login:', isLogin);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      console.log('Calling endpoint:', endpoint);
      
      // Location is already handled in checkbox onChange
      console.log('Submitting with location:', formData.location);
      
      // Test if auth routes work first
      const testResponse = await api.get('/api/auth/test');
      console.log('Auth test:', testResponse.data);
      
      const response = await api.post(endpoint, formData);
      console.log('Response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      alert(isLogin ? 'Login successful!' : 'Signup successful!');
      // Redirect based on action
      if (isLogin) {
        window.location.href = '/';
      } else {
        // For signup, redirect to profile
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1000);
      }
    } catch (error) {
      console.error('Auth error:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="login-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {!isLogin && (
          <div className="input-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Enter your name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
        )}

        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Enter your password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>

        {!isLogin && (
          <div className="input-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              placeholder="Enter your phone number" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
        )}

        {!isLogin && (
          <>
            <div className="location-group">
              <div className="location-input">
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Enter your address" 
                  value={formData.location.address} 
                  onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                  required 
                />
                <span className="location-icon">📍</span>
              </div>
              <label className="location-checkbox">
                <input 
                  type="checkbox" 
                  checked={useCurrentLocation}
                  onChange={async (e) => {
                    setUseCurrentLocation(e.target.checked);
                    if (e.target.checked) {
                      setLocationLoading(true);
                      try {
                        const position = await getCurrentLocation();
                        const address = await getAddressFromCoords(position.coords.latitude, position.coords.longitude);
                        setFormData({
                          ...formData, 
                          location: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            address: address
                          }
                        });
                      } catch (error) {
                        console.error('Location error:', error);
                        alert('Could not get current location. Please enter address manually.');
                        setUseCurrentLocation(false);
                      } finally {
                        setLocationLoading(false);
                      }
                    } else {
                      // Clear location when unchecked
                      setFormData({...formData, location: {address: ''}});
                    }
                  }}
                />
                📍 {locationLoading ? 'Getting location...' : 'Use my current location'}
              </label>
              {formData.location.latitude && formData.location.longitude && (
                <div className="location-map">
                  <iframe
                    src={`https://maps.google.com/maps?q=${formData.location.latitude},${formData.location.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="200"
                    style={{border: 0, borderRadius: '8px', marginTop: '10px'}}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              )}
            </div>
          </>
        )}

        <button type="submit" className="login-btn">{isLogin ? 'Login' : 'Sign Up'}</button>
        
        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </div>
      </form>
    </div>
  );
}
