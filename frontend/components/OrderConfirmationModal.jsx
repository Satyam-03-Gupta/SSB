import React from 'react';
import './OrderConfirmationModal.css';

const OrderConfirmationModal = ({ isOpen, onClose, orderData }) => {
  if (!isOpen || !orderData) return null;

  return (
    <div className="order-modal-overlay">
      <div className="order-modal">
        <div className="order-modal-header">
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>
          <h2>Order Placed Successfully!</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="order-modal-body">
          <div className="order-id-section">
            <h3>Order ID: #{orderData.orderId}</h3>
            <p className="order-status">Your order has been confirmed and is being prepared</p>
          </div>
          
          <div className="order-details">
            <div className="detail-row">
              <span className="label">Delivery Address:</span>
              <span className="value">{orderData.deliveryAddress}</span>
            </div>
            <div className="detail-row">
              <span className="label">Payment Method:</span>
              <span className="value">{orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Total Amount:</span>
              <span className="value amount">₹{orderData.totalAmount}</span>
            </div>
            <div className="detail-row">
              <span className="label">Estimated Delivery:</span>
              <span className="value">10-15 minutes</span>
            </div>
          </div>
          
          <div className="order-items-summary">
            <h4>Items Ordered ({orderData.items.length})</h4>
            <div className="items-list">
              {orderData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span className="item-name">{item.name} ({item.size})</span>
                  <span className="item-qty">x{item.quantity}</span>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="order-modal-footer">
          <div className="tracking-info">
            <p>📱 You will receive SMS updates about your order status</p>
            <p>🚚 Track your order in the "My Orders" section</p>
          </div>
          <div className="modal-actions">
            <button className="track-order-btn" onClick={() => {
              onClose();
              window.location.href = '/orders';
            }}>
              Track Order
            </button>
            <button className="continue-shopping-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;