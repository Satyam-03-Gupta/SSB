import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../src/App.css';

const RiderDeliveryPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const handleBackToDashboard = () => {
    navigate('/rider/dashboard');
  };
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('riderToken');
      if (!token) {
        navigate('/rider/login');
        return;
      }
      
      const response = await fetch(`http://localhost:3001/api/rider/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      console.log('Generating QR for amount:', order.totalAmount, 'orderId:', order.orderId);
      
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('QR response:', data);
      
      if (data.qrCode) {
        setQrCode(data.qrCode);
        setShowQR(true);
      } else {
        throw new Error('No QR code received');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code: ' + error.message);
    }
  };

  const markAsDelivered = async () => {
    try {
      const token = localStorage.getItem('riderToken');
      const response = await fetch(`http://localhost:3001/api/rider/orders/${order._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Delivered' })
      });

      if (response.ok) {
        alert('Order marked as delivered!');
        handleBackToDashboard();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const openGoogleMaps = () => {
    const address = order.deliveryAddress;
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

  if (loading) return <div className="delivery-loading">Loading order details...</div>;
  if (!order) return <div className="delivery-error">Order not found</div>;

  return (
    <div className="delivery-page">
      <div className="delivery-header">
        <button className="back-btn" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>
        <h1>Delivery Details</h1>
      </div>

      <div className="delivery-content">
        {/* Google Maps Section */}
        <div className="map-section">
          <div className="map-header">
            <h3>📍 Delivery Location</h3>
            <button className="maps-btn" onClick={openGoogleMaps}>
              Open in Google Maps
            </button>
          </div>
          <div className="address-display">
            <p>{order.deliveryAddress}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="order-details-section">
          <h3>📦 Order #{order.orderId}</h3>
          <div className="customer-info">
            <p><strong>Customer:</strong> {order.userEmail.split('@')[0]}</p>
            <p><strong>Payment:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            {order.phoneNumber && order.paymentMethod === 'cod' && (
              <p><strong>Phone:</strong> 
                <a href={`tel:${order.phoneNumber}`} className="phone-call-btn">
                  📞 {order.phoneNumber}
                </a>
              </p>
            )}
          </div>

          {/* Items List */}
          <div className="items-list">
            <h4>Items Ordered:</h4>
            {order.items.map((item, index) => (
              <div key={index} className="delivery-item">
                <img 
                  src={item.image || '/assets/biryani.jpg'} 
                  alt={item.name} 
                  className="item-img"
                  onError={(e) => { e.target.src = '/assets/biryani.jpg'; }}
                />
                <div className="item-info">
                  <h5>{item.name}</h5>
                  <p>Size: {item.size} | Qty: {item.quantity}</p>
                  <p className="item-price">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary */}
          <div className="bill-summary">
            <h4>Bill Summary:</h4>
            <div className="bill-row">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="bill-row">
              <span>Delivery Fee:</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div className="bill-row">
              <span>GST (5%):</span>
              <span>₹{order.gst}</span>
            </div>
            {order.tip > 0 && (
              <div className="bill-row">
                <span>Tip:</span>
                <span>₹{order.tip}</span>
              </div>
            )}
            <div className="bill-row total">
              <span>Total Amount:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="delivery-actions">
          {order.paymentMethod === 'cod' ? (
            <>
              {!showQR ? (
                <button className="qr-btn" onClick={generateQRCode}>
                  Show QR Code for Payment
                </button>
              ) : (
                <div className="qr-section">
                  <h4>Payment QR Code</h4>
                  <div className="qr-display">
                    <img src={qrCode} alt="Payment QR Code" className="qr-image" />
                  </div>
                  <p>Customer can scan to pay ₹{order.totalAmount}</p>
                </div>
              )}
              <button className="delivered-btn" onClick={markAsDelivered}>
                Mark as Delivered
              </button>
            </>
          ) : (
            <button className="delivered-btn" onClick={markAsDelivered}>
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderDeliveryPage;