import React, { useState, useEffect } from 'react';
import '../src/App.css';
import api from '../lib/axios.js';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: { address: '' }
  });
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        location: {
          address: parsedUser.location?.address || '',
          latitude: parsedUser.location?.latitude || null,
          longitude: parsedUser.location?.longitude || null
        }
      });
    }
    // Fetch orders after user data is loaded
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Fetch orders with user email
      fetchOrdersForUser(parsedUser.email);
    }
  }, []);

  const fetchOrdersForUser = async (email) => {
    try {
      const response = await api.get(`/api/orders/user/${email}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  // Remove the old fetchOrders call
  useEffect(() => {
    if (user?.email) {
      fetchOrdersForUser(user.email);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      if (user?.email) {
        const response = await api.get(`/api/orders/user/${user.email}`);
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'address') {
      setFormData({
        ...formData,
        location: { 
          ...formData.location, 
          address: e.target.value 
        }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
      // Update user data in localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Please login to view your profile</h2>
          <button onClick={() => window.location.href = '/login'} className="profile-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          
          <div className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 My Orders
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </div>
          
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="edit-btn"
                >
                  {isEditing ? '❌ Cancel' : '✏️ Edit'}
                </button>
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled' : ''}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.location?.address || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled' : ''}
                    placeholder="Enter your address"
                  />
                  {formData.location?.latitude && formData.location?.longitude && (
                    <small className="location-coords">
                      📍 Coordinates: {formData.location.latitude.toFixed(4)}, {formData.location.longitude.toFixed(4)}
                    </small>
                  )}
                </div>

                {isEditing && (
                  <button onClick={handleSave} className="save-btn">
                    💾 Save Changes
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <h2>My Orders</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders found</p>
                  <button onClick={() => window.location.href = '/'} className="order-btn">
                    Start Ordering
                  </button>
                </div>
              ) : (
                <div className="orders-grid">
                  {orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <h4>Order #{order.orderId}</h4>
                        <span className={`order-status ${order.status?.toLowerCase()?.replace(' ', '-')}`}>
                          {order.status}
                        </span>
                        <span className="order-date">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="order-details">
                        <div className="order-items">
                          <h5>Items:</h5>
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="order-item">
                              <span>{item.name} ({item.size}) x{item.quantity}</span>
                              <span>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="order-summary">
                          <p><strong>Subtotal:</strong> ₹{order.subtotal}</p>
                          <p><strong>Delivery Fee:</strong> ₹{order.deliveryFee}</p>
                          <p><strong>GST:</strong> ₹{order.gst}</p>
                          <p className="order-total"><strong>Total: ₹{order.totalAmount}</strong></p>
                        </div>
                        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Account Settings</h2>
              <div className="settings-grid">
                <div className="setting-item">
                  <h4>🔔 Notifications</h4>
                  <p>Manage your notification preferences</p>
                  <button className="setting-btn">Configure</button>
                </div>
                <div className="setting-item">
                  <h4>🔒 Privacy</h4>
                  <p>Control your privacy settings</p>
                  <button className="setting-btn">Manage</button>
                </div>
                <div className="setting-item">
                  <h4>🗑️ Delete Account</h4>
                  <p>Permanently delete your account</p>
                  <button className="setting-btn danger">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;