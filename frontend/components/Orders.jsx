import React, { useState, useEffect } from 'react';
import '../src/App.css';
import FeedbackModal from './FeedbackModal';

export default function Orders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState(null);
  const [deliveredOrders, setDeliveredOrders] = useState(new Set());
  const [submittedFeedback, setSubmittedFeedback] = useState(new Set());

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      fetchUserOrders(userObj.email);
      
      // Set up auto-refresh every 10 seconds for faster feedback detection
      const refreshInterval = setInterval(() => {
        fetchUserOrders(userObj.email, false);
      }, 10000);
      
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
      
      // Fetch regular orders
      const ordersResponse = await fetch(`http://localhost:3001/api/orders/user/${email}`);
      let userOrders = [];
      if (ordersResponse.ok) {
        userOrders = await ordersResponse.json();
      }
      
      // Fetch all prebookings
      try {
        const prebookingsResponse = await fetch(`http://localhost:3001/api/prebookings/user/${email}`);
        if (prebookingsResponse.ok) {
          const userPrebookings = await prebookingsResponse.json();
          const allPrebookings = userPrebookings.map(booking => ({
            ...booking,
            _id: booking._id,
            orderId: booking.orderId,
            orderDate: booking.createdAt,
            status: booking.status === 'Converted' ? 'Confirmed' : 'Prebooking',
            items: booking.items || [],
            totalAmount: booking.totalAmount,
            deliveryAddress: booking.deliveryAddress,
            userEmail: booking.userEmail,
            isPrebooking: true
          }));
          
          // Combine orders and prebookings
          userOrders = [...userOrders, ...allPrebookings];
        }
      } catch (prebookingError) {
        console.error('Error fetching prebookings:', prebookingError);
      }
      
      console.log('Fetched orders:', userOrders.map(o => ({ id: o._id, status: o.status, orderId: o.orderId })));
        console.log('Current delivered orders set:', Array.from(deliveredOrders));
        
        // Initialize delivered orders set on first load
        if (orders.length === 0) {
          const initialDelivered = userOrders
            .filter(order => order.status === 'Delivered')
            .map(order => order._id);
          console.log('Initializing delivered orders:', initialDelivered);
          setDeliveredOrders(new Set(initialDelivered));
          
          // Load submitted feedback from localStorage
          const savedFeedback = localStorage.getItem('submittedFeedback');
          if (savedFeedback) {
            setSubmittedFeedback(new Set(JSON.parse(savedFeedback)));
          }
        } else {
          // Check for newly delivered orders that haven't had feedback submitted
          const newlyDelivered = userOrders.filter(order => 
            order.status === 'Delivered' && 
            !deliveredOrders.has(order._id) && 
            !submittedFeedback.has(order._id)
          );
          
          console.log('Checking for newly delivered orders:', newlyDelivered.map(o => ({ id: o._id, orderId: o.orderId })));
          
          if (newlyDelivered.length > 0) {
            // Show feedback modal for the first newly delivered order
            const orderToRate = newlyDelivered[0];
            console.log('🎉 Showing feedback modal for order:', orderToRate.orderId);
            setFeedbackOrder(orderToRate);
            setShowFeedbackModal(true);
            
            // Update delivered orders set
            setDeliveredOrders(prev => {
              const newSet = new Set(prev);
              newlyDelivered.forEach(order => newSet.add(order._id));
              console.log('Updated delivered orders set:', Array.from(newSet));
              return newSet;
            });
          }
        }
        
        setOrders(userOrders);
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

  const handleFeedbackSubmitted = (orderId) => {
    // Add to submitted feedback set
    setSubmittedFeedback(prev => {
      const newSet = new Set(prev);
      newSet.add(orderId);
      // Save to localStorage
      localStorage.setItem('submittedFeedback', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
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
          {orders.map((order) => {
            const isNewOrder = !['Delivered', 'Cancelled'].includes(order.status);
            return (
            <div key={order._id} className={`order-card ${isNewOrder ? 'new-order' : ''}`}>
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
                {(order.items || []).map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={item.image || '/assets/biryani.jpg'} 
                      alt={item.name} 
                      className="item-image" 
                      onError={(e) => { e.target.src = '/assets/biryani.jpg'; }}
                    />
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
              
              {order.status === 'Delivered' && !submittedFeedback.has(order._id) && (
                <div className="order-actions">
                  <button 
                    className="feedback-btn"
                    onClick={() => {
                      setFeedbackOrder(order);
                      setShowFeedbackModal(true);
                    }}
                  >
                    📝 Rate This Order
                  </button>
                </div>
              )}
              
              {order.status === 'Delivered' && submittedFeedback.has(order._id) && (
                <div className="order-actions">
                  <span className="feedback-submitted">
                    ✓ Feedback Submitted
                  </span>
                </div>
              )}
            </div>
          );
          })}
        </div>
      )}
      
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        orderData={feedbackOrder}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </div>
  );
}