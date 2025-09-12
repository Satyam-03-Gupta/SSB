import React, { useState } from 'react';
import './NavbarCart.css';

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
    return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Location formatting error:', error);
    return 'Current Location';
  }
};

const CartModal = ({ 
  showCart, 
  setShowCart, 
  cart, 
  removeFromCart, 
  updateQuantity, 
  calculateTotal, 
  selectedAddress, 
  setSelectedAddress, 
  userAddresses, 
  setUserAddresses,
  tip, 
  setTip, 
  confirmOrder,
  paymentMethod,
  setPaymentMethod 
}) => {
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ address: '', latitude: null, longitude: null });
  const [locationLoading, setLocationLoading] = useState(false);
  
  if (!showCart) return null;

  const addNewAddress = () => {
    if (!newAddress.address.trim()) {
      alert('Please enter an address');
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const addresses = JSON.parse(localStorage.getItem(`addresses_${user.email}`)) || [];
      addresses.push(newAddress);
      localStorage.setItem(`addresses_${user.email}`, JSON.stringify(addresses));
      setUserAddresses([...userAddresses, newAddress]);
      setSelectedAddress(newAddress);
      setNewAddress({ address: '', latitude: null, longitude: null });
      setShowAddAddress(false);
    }
  };

  return (
    <div className="cart-modal">
      <div className="cart-content">
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="close-cart" onClick={() => setShowCart(false)}>×</button>
        </div>
        
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>Size: {item.size}</p>
                    <p>₹{item.price} each</p>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-item-total">
                    ₹{item.price * item.quantity}
                  </div>
                  <button 
                    className="remove-item" 
                    onClick={() => removeFromCart(item.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            
            <div className="address-section">
              <h4>Delivery Address:</h4>
              {userAddresses.length > 0 ? (
                <div className="address-list">
                  {userAddresses.map((addressObj, index) => (
                    <label key={index} className="address-option">
                      <input
                        type="radio"
                        name="address"
                        value={index}
                        checked={selectedAddress === addressObj}
                        onChange={() => setSelectedAddress(addressObj)}
                      />
                      <span className="address-text">
                        {typeof addressObj === 'string' ? addressObj : addressObj.address}
                        {addressObj.latitude && addressObj.longitude && (
                          <small className="coordinates"> (📍 {addressObj.latitude.toFixed(4)}, {addressObj.longitude.toFixed(4)})</small>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="no-addresses">No saved addresses</p>
              )}
              
              <button 
                className="add-address-btn" 
                onClick={() => setShowAddAddress(!showAddAddress)}
              >
                {showAddAddress ? 'Cancel' : '+ Add New Address'}
              </button>
              
              {showAddAddress && (
                <div className="add-address-form">
                  <input
                    type="text"
                    placeholder="Enter new address"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                    className="address-input"
                  />
                  <label className="location-checkbox">
                    <input
                      type="checkbox"
                      onChange={async (e) => {
                        if (e.target.checked) {
                          setLocationLoading(true);
                          try {
                            const position = await getCurrentLocation();
                            const address = await getAddressFromCoords(position.coords.latitude, position.coords.longitude);
                            setNewAddress({
                              address: newAddress.address || address,
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude
                            });
                          } catch (error) {
                            alert('Could not get current location');
                          } finally {
                            setLocationLoading(false);
                          }
                        } else {
                          setNewAddress({...newAddress, latitude: null, longitude: null});
                        }
                      }}
                    />
                    📍 {locationLoading ? 'Getting location...' : 'Use current location'}
                  </label>
                  <div className="address-form-buttons">
                    <button onClick={addNewAddress} className="save-address-btn">Save Address</button>
                  </div>
                </div>
              )}
            </div>

            {paymentMethod !== undefined && (
              <div className="payment-section">
                <h4>Payment Method:</h4>
                <div className="payment-options">
                  <div className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      id="cod"
                    />
                    <label htmlFor="cod">💵 Cash on Delivery</label>
                  </div>
                  <div className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      id="razorpay"
                    />
                    <label htmlFor="razorpay">💳 Pay Online (Razorpay)</label>
                  </div>
                </div>
              </div>
            )}

            <div className="tip-section">
              <h4>Add Tip for Delivery Partner:</h4>
              <div className="tip-options">
                <button 
                  className={`tip-btn ${tip === 10 ? 'active' : ''}`}
                  onClick={() => setTip(10)}
                >
                  ₹10
                </button>
                <button 
                  className={`tip-btn ${tip === 20 ? 'active' : ''}`}
                  onClick={() => setTip(20)}
                >
                  ₹20
                </button>
                <button 
                  className={`tip-btn ${tip === 40 ? 'active' : ''}`}
                  onClick={() => setTip(40)}
                >
                  ₹40
                </button>
                <button 
                  className={`tip-btn ${tip === 50 ? 'active' : ''}`}
                  onClick={() => setTip(50)}
                >
                  ₹50
                </button>
              </div>
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>₹30</span>
              </div>
              <div className="summary-row">
                <span>GST (5%):</span>
                <span>₹{Math.round(calculateTotal() * 0.05)}</span>
              </div>
              {tip > 0 && (
                <div className="summary-row">
                  <span>Tip:</span>
                  <span>₹{tip}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{calculateTotal() + 30 + Math.round(calculateTotal() * 0.05) + tip}</span>
              </div>
              
              <button className="place-order-btn" onClick={() => confirmOrder(paymentMethod)}>
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;