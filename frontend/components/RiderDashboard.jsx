import React, { useState, useEffect } from 'react';
import notificationService from '../lib/notificationService';
import '../src/App.css';

const RiderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const riderData = localStorage.getItem('rider');
    if (!riderData) {
      window.location.href = '/rider/login';
      return;
    }
    setRider(JSON.parse(riderData));
    fetchOrders();
    notificationService.requestPermission();
  }, []);

  useEffect(() => {
    if (orders.length === 0) return; // Don't start polling until we have initial orders
    
    let orderIds = new Set(orders.map(o => o._id));
    
    const pollInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem('riderToken');
        const response = await fetch('http://localhost:3001/api/rider/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const newOrders = await response.json();
          const hasNewOrder = newOrders.some(order => !orderIds.has(order._id));
          
          if (hasNewOrder && orderIds.size > 0) {
            console.log('🔔 New order detected for rider!');
            notificationService.showNotification('New Delivery!', 'A new order is ready for delivery');
          }
          
          orderIds = new Set(newOrders.map(o => o._id));
          setOrders(newOrders);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
    
    return () => clearInterval(pollInterval);
  }, [orders.length > 0]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('riderToken');
      const response = await fetch('http://localhost:3001/api/rider/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Rider orders:', data.map(o => ({ id: o.orderId, status: o.status })));
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('riderToken');
      const response = await fetch(`http://localhost:3001/api/rider/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchOrders();
        // alert('Order status updated successfully');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const openGoogleMaps = (address) => {
    // Check if address contains coordinates (Location: lat, lng format or direct coordinates)
    const coordMatch = address.match(/Location:\s*([\d.-]+),\s*([\d.-]+)/) || 
                      address.match(/([\d.-]+),\s*([\d.-]+)/);
    
    let googleMapsUrl;
    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    } else {
      const encodedAddress = encodeURIComponent(address);
      googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    }
    
    window.open(googleMapsUrl, '_blank');
  };

  const getUsernameFromEmail = (email) => {
    return email.split('@')[0];
  };

  const generateQRCode = async (order) => {
    try {
      const response = await fetch('http://localhost:3001/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: order.totalAmount, 
          orderId: order.orderId 
        })
      });
      
      const data = await response.json();
      setQrCode(data.qrCode);
      setShowQR(order);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('riderToken');
    localStorage.removeItem('rider');
    window.location.href = '/rider/login';
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-container">
      <div className={`rider-sidebar ${isOpen ? 'active' : ''}`}>
        <div className="admin-header">
          <h2>🚴♂️ Rider Panel</h2>
        </div>
         <div className="stats-grid-2">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{orders.filter(o => o.status === 'Pending').length}</h3>
                <p>Pending Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚚</div>
              <div className="stat-info">
                <h3>{orders.filter(o => o.status === 'Out for Delivery').length}</h3>
                <p>Out for Delivery</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{orders.filter(o => o.status === 'Delivered').length}</h3>
                <p>Delivered Today</p>
              </div>
            </div>
          </div>
        <div className="admin-nav">
          <button className="admin-nav-item active">📦 Orders</button>
        </div>
        <button onClick={handleLogout} className="admin-logout">Logout</button>
      </div>

      <div className="admin-content">
        <div className="dashboard-section">
          <div className="rider-header">
            <div className={`admin-hamburger ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h1>Welcome, {rider?.name}</h1>

          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{orders.filter(o => o.status === 'Pending').length}</h3>
                <p>Pending Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚚</div>
              <div className="stat-info">
                <h3>{orders.filter(o => o.status === 'Out for Delivery').length}</h3>
                <p>Out for Delivery</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{orders.filter(o => o.status === 'Delivered').length}</h3>
                <p>Delivered Today</p>
              </div>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  {/* <th>Order ID</th> */}
                  <th>Username</th>
                  {/* <th>Phone</th> */}
                  {/* <th>Address</th> */}
                  <th>Items</th>
                  {/* <th>Total</th>
                  <th>Status</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                      No orders available
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const isNewOrder = !['Delivered', 'Cancelled'].includes(order.status);
                    return (
                    <tr key={order._id} className={isNewOrder ? 'new-order' : ''}>
                    {/* <td>#{order.orderId}</td> */}
                    <td>{getUsernameFromEmail(order.userEmail)}</td>
                    {/* <td>
                      {order.phoneNumber && order.paymentMethod === 'cod' ? (
                        <a href={`tel:${order.phoneNumber}`} className="phone-call-btn">
                          📞 {order.phoneNumber}
                        </a>
                      ) : (
                        order.phoneNumber || 'N/A'
                      )}
                    </td> */}
                    {/* <td>{order.deliveryAddress}</td> */}
                    <td>{order.items?.reduce((total, item) => total + item.quantity, 0)} items</td>
                    {/* <td>₹{order.totalAmount}</td> */}
                    {/* <td>
                      <span className={`order-status ${order.status}`}>
                        {order.status?.replace('_', ' ')}
                      </span>
                    </td> */}
                    <td>
                      <div className="action-buttons">
                        {(order.status === 'Pending' || order.status === 'Confirmed' || order.status === 'Preparing') && (
                          <button 
                            className="btn-edit"
                            onClick={() => updateOrderStatus(order._id, 'Out for Delivery')}
                          >
                            Pick Up
                          </button>
                        )}
                        {order.status === 'Out for Delivery' && (
                          <button 
                            className="btn-edit"
                            onClick={() => window.location.href = `/rider/delivery/${order._id}`}
                          >
                            Start Delivery
                          </button>
                        )}
                        {order.status === 'Delivered' && (
                          <span className="completed-status">✅ Completed</span>
                        )}
                        {order.status === 'Cancelled' && (
                          <span className="cancelled-status">❌ Cancelled</span>
                        )}
                        {!['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status) && (
                          <span className="unknown-status">Status: {order.status}</span>
                        )}
                      </div>
                    </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <div className="qr-modal-header">
              <h3>Payment QR Code</h3>
              <button className="close-qr" onClick={() => setShowQR(null)}>×</button>
            </div>
            <div className="qr-modal-body">
              <div className="order-details">
                <h4>Order #{showQR.orderId}</h4>
                <p>Amount: ₹{showQR.totalAmount}</p>
                <p>Customer can scan this QR code to pay</p>
              </div>
              <div className="qr-code-container">
                {qrCode && <img src={qrCode} alt="Payment QR Code" className="qr-code" />}
              </div>
              <div className="qr-instructions">
                <p>📱 Customer can scan with any UPI app</p>
                <p>💳 Payment will be instant</p>
              </div>
              <div className="qr-actions">
                <button 
                  className="btn-reply qr-delivered-btn"
                  onClick={() => {
                    updateOrderStatus(showQR._id, 'Delivered');
                    setShowQR(null);
                  }}
                >
                  Mark as Delivered
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;