import React, { useState, useEffect } from 'react';
import '../src/App.css';

export default function Orders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      fetchUserOrders(userObj.email);
      
      // Set up auto-refresh every 30 seconds
      const refreshInterval = setInterval(() => {
        fetchUserOrders(userObj.email, false);
      }, 30000);
      
      // Update current time every second for countdown
      const timeInterval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      
      return () => {
        clearInterval(refreshInterval);
        clearInterval(timeInterval);
      };
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserOrders = async (email, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await fetch(`http://localhost:3001/api/orders/user/${email}`);
      if (response.ok) {
        const userOrders = await response.json();
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (user && !refreshing) {
      setRefreshing(true);
      fetchUserOrders(user.email, false);
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancelOrder = (order) => {
    const currentTime = new Date();
    const orderTime = new Date(order.orderDate);
    const timeDiff = (currentTime - orderTime) / (1000 * 60); // difference in minutes
    
    return timeDiff <= 5 && ['Pending', 'Confirmed'].includes(order.status);
  };

  const getTimeRemaining = (order) => {
    const currentTime = new Date();
    const orderTime = new Date(order.orderDate);
    const timeDiff = (currentTime - orderTime) / 1000; // difference in seconds
    const timeLimit = 5 * 60; // 5 minutes in seconds
    const remaining = Math.max(0, timeLimit - timeDiff);
    
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    
    return { minutes, seconds, expired: remaining === 0 };
  };

  const shouldShowCancelSection = (order) => {
    return ['Pending', 'Confirmed'].includes(order.status);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Order cancelled successfully!');
        fetchUserOrders(user.email);
      } else {
        alert(result.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="orders-container">
        <div className="login-prompt">
          <h2>Please Login</h2>
          <p>You need to login to view your orders</p>
          <a href="/user/login" className="login-btn">Login Now</a>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <div className="orders-header-right">
          <button 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h3>No Orders Yet</h3>
          <p>Start ordering your favorite biryani!</p>
          <a href="/menu" className="order-now-btn">Order Now</a>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderId}</h3>
                  <span className="order-date">{formatDate(order.orderDate)}</span>
                </div>
                <div className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Size: {item.size || 'Regular'}</p>
                    </div>
                    <div className="item-price">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-billing">
                <div className="billing-row">
                  <span>Subtotal:</span>
                  <span>₹{calculateTotal(order.items)}</span>
                </div>
                <div className="billing-row">
                  <span>Delivery Fee:</span>
                  <span>₹{order.deliveryFee || 30}</span>
                </div>
                <div className="billing-row">
                  <span>GST (5%):</span>
                  <span>₹{Math.round(calculateTotal(order.items) * 0.05)}</span>
                </div>
                <div className="billing-row total">
                  <span>Total Amount:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="delivery-info">
                <h4>Delivery Address:</h4>
                <p>{order.deliveryAddress || user.address || 'Address not provided'}</p>
                <p>{user.phone || 'Phone not provided'}</p>
                <p><strong>Restaurant:</strong> <a href="tel:9962525211" className="phone-call-btn">📞 99625 25211</a></p>
              </div>

              {shouldShowCancelSection(order) && (
                <div className="order-actions">
                  <button 
                    className="cancel-order-btn"
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={!canCancelOrder(order)}
                  >
                    Cancel Order
                  </button>
                  {canCancelOrder(order) ? (
                    <small className="cancel-countdown">
                      Time remaining: {getTimeRemaining(order).minutes}m {getTimeRemaining(order).seconds}s
                    </small>
                  ) : (
                    <small className="cancel-note">Cancellation time expired (5 minutes limit)</small>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}