import React, { useState, useEffect } from 'react';
import '../src/App.css';
import '../components/DetailedMenu.css';
import '../components/NavbarCart.css';
import { useCart } from '../lib/useCart';
import CartModal from './CartModal';

// Load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function DetailedMenu() {
  const [selectedSize, setSelectedSize] = useState('regular');
  const [showCart, setShowCart] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDescription, setShowDescription] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [newAddress, setNewAddress] = useState('');
  const [stockStatus, setStockStatus] = useState({});

  const {
    cart,
    selectedAddress,
    setSelectedAddress,
    userAddresses,
    setUserAddresses,
    tip,
    setTip,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    getTotalQuantity,
    confirmOrder
  } = useCart();

  useEffect(() => {
    const adminStock = localStorage.getItem('adminMenuStock');
    if (adminStock) {
      setStockStatus(JSON.parse(adminStock));
    }
  }, []);

  const isOutOfStock = (itemName) => {
    return stockStatus[itemName]?.outOfStock || false;
  };

  const addNewAddress = () => {
    if (newAddress.trim()) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const existingAddresses = JSON.parse(localStorage.getItem(`addresses_${user.email}`)) || [];
        const updatedAddresses = [...existingAddresses, newAddress.trim()];
        localStorage.setItem(`addresses_${user.email}`, JSON.stringify(updatedAddresses));
        setUserAddresses(updatedAddresses);
        setSelectedAddress(newAddress.trim());
        setNewAddress('');
        setShowAddressModal(false);
      }
    }
  };

  const handleConfirmOrder = async () => {
    if (paymentMethod === 'razorpay') {
      // Handle Razorpay payment
      const user = JSON.parse(localStorage.getItem('user'));
      const subtotal = calculateTotal();
      const deliveryFee = 30;
      const gst = Math.round(subtotal * 0.05);
      const totalAmount = subtotal + deliveryFee + gst + tip;

      try {
        const orderResponse = await fetch('http://localhost:3001/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount })
        });

        if (!orderResponse.ok) throw new Error('Failed to create payment order');

        const razorpayOrder = await orderResponse.json();
        const options = {
          key: 'rzp_test_JZhnqNEMQas344',
          amount: totalAmount * 100,
          currency: 'INR',
          name: 'SSB Biryani',
          description: 'Order Payment',
          order_id: razorpayOrder.id,
          handler: async function (response) {
            await confirmOrder(paymentMethod);
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || ''
          },
          theme: { color: '#e75b1e' }
        };

        const razorpayLoaded = await loadRazorpay();
        if (razorpayLoaded) {
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
            alert('Payment failed: ' + response.error.description);
          });
          rzp.open();
        } else {
          alert('Failed to load payment gateway.');
        }
      } catch (error) {
        alert('Failed to initiate payment.');
      }
    } else {
      await confirmOrder(paymentMethod);
    }
    setShowCart(false);
  };



  const toggleDescription = (itemId) => {
    setShowDescription(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Check if today is Sunday or Friday for special items
  const getCurrentDay = () => {
    const today = new Date().getDay();
    return {
      isSunday: today === 0,
      isFriday: today === 5
    };
  };

  const { isSunday, isFriday } = getCurrentDay();


  const menuData = {
    regular: [
      {
        id: 1,
        name: "Chicken Biryani",
        price: 125,
        image: "/assets/regular.avif",
        description: "Delicious Ambur Biryani with tender chicken and seeraga samba rice, served with brinjal curry and raita."
      },
      {
        id: 2,
        name: "Egg Biryani",
        price: 125,
        image: "/assets/egg.avif",
        description: "Fragrant rice cooked with spiced eggs, offering a satisfying meal."
      },
      {
        id: 3,
        name: "Plain Biryani",
        price: 125,
        image: "/assets/plain.avif",
        description: "Mildly flavoured aromatic rice that can be accompanied with various onion- tomato based gravies."
      }, {
        id: 4,
        name: "Large Chicken Biryani",
        price: 185,
        image: "/assets/regular.avif",
        description: "Delicious Ambur Biryani with tender chicken and seeraga samba rice, served with brinjal curry and raita."
      },
      {
        id: 5,
        name: "Large Egg Biryani",
        price: 175,
        image: "/assets/egg.avif",
        description: "Fragrant rice cooked with spiced eggs, offering a satisfying meal."
      },
      {
        id: 6,
        name: "Large Plain Biryani",
        price: 150,
        image: "/assets/plain.avif",
        description: "Mildly flavoured aromatic rice that can be accompanied with various onion- tomato based gravies."
      }
      // {
      //   id: 7,
      //   name: "Sunday Special Chicken 65",
      //   price: 125,
      //   image: "/assets/chicken_roll.jpg",
      //   description: "Crispy fried chicken with special spices",
      //   special: true
      // },

    ],
    large: [
      {
        id: 1,
        name: "Large Chicken Biryani",
        price: 185,
        image: "/assets/regular.avif",
        description: "Delicious Ambur Biryani with tender chicken and seeraga samba rice, served with brinjal curry and raita."
      },
      {
        id: 2,
        name: "Large Egg Biryani",
        price: 175,
        image: "/assets/egg.avif",
        description: "Fragrant rice cooked with spiced eggs, offering a satisfying meal."
      },
      {
        id: 3,
        name: "Large Plain Biryani",
        price: 150,
        image: "/assets/plain.avif",
        description: "Mildly flavoured aromatic rice that can be accompanied with various onion- tomato based gravies."
      }
    ]
  };

  return (
    <div className="detailed-menu">
      <div className="menu-header">
        <h1 className="menu-title">Our Biryani Menu</h1>
        <p className="menu-subtitle">Authentic flavors, perfect portions</p>

        {/* Cart Button */}
        <div className="cart-section">
          <button
            className="cart-btn cartbutton"
            onClick={() => setShowCart(!showCart)}
          >
            🛒 Cart ({getTotalQuantity()})
          </button>
        </div>
      </div>

      <CartModal
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        calculateTotal={calculateTotal}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        userAddresses={userAddresses}
        tip={tip}
        setTip={setTip}
        confirmOrder={handleConfirmOrder}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="address-modal">
          <div className="address-modal-content">
            <div className="address-modal-header">
              <h3>Select Delivery Address</h3>
              <button className="close-modal" onClick={() => setShowAddressModal(false)}>×</button>
            </div>

            <div className="address-options">
              <h4>Saved Addresses:</h4>
              {userAddresses.length > 0 ? (
                userAddresses.map((address, index) => (
                  <div key={index} className="address-option">
                    <input
                      type="radio"
                      name="address"
                      value={address}
                      checked={selectedAddress === address}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      id={`modal-address-${index}`}
                    />
                    <span className="address-text">{address}</span>
                  </div>
                ))
              ) : (
                <p className="no-addresses">No saved addresses found</p>
              )}

              <div className="new-address-section">
                <h4>Add New Address:</h4>
                <div className="new-address-input">
                  <input
                    type="text"
                    placeholder="Enter new delivery address"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="address-input"
                  />
                  <button onClick={addNewAddress} className="add-address-btn">
                    Use This Address
                  </button>
                </div>
              </div>
            </div>

            <div className="address-modal-footer">
              <div className="selected-address">
                <strong>Delivering to:</strong>
                <p>{selectedAddress || 'No address selected'}</p>
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowAddressModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleConfirmOrder} className="confirm-order-btn">
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sunday Special Section */}
      <div className="sunday-special-section">
        <h2 className="section-title" ><img src="/assets/sunday_special.png" alt="Sunday Special" /></h2>
        <div className="menu-grid">
          <div className="menu-item-card special-item ">
            <div className="special-badge">Sunday Only</div>
            <div className="item-image">
              <img src="/assets/chicken65.avif" alt="Sunday Special Chicken 65" />
            </div>
            <div className="item-content">
              <h3 className="item-name">Sunday Special Chicken 65</h3>
              {showDescription['sunday-chicken-65'] && (
                <p className="item-description">Boneless tender chickene, deep fried and served hot.</p>
              )}
              <button
                className="description-toggle-btn"
                onClick={() => toggleDescription('sunday-chicken-65')}
              >
                {showDescription['sunday-chicken-65'] ? 'Hide Details' : 'View Details'}
              </button>
              <div className="item-footer">
                <span className="item-price">₹125</span>
                {(() => {
                  const cartItem = cart.find(item => item.name === 'Sunday Special Chicken 65');
                  return cartItem ? (
                    <div className="quantity-controls-btn">
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}>-</button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}>+</button>
                    </div>
                  ) : (
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart({
                        name: 'Sunday Special Chicken 65',
                        price: 125,
                        image: '/assets/chicken65.avif'
                      }, 'regular', true)}
                      disabled={!isSunday}
                    >
                      {isSunday ? 'Add to Cart' : 'Available on Sunday'}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
          <div className="menu-item-card special-item">
            <div className="special-badge">Sunday Only</div>
            <div className="item-image">
              <img src="/assets/65biryani.avif" alt="Sunday Special Mutton Biryani" />
            </div>
            <div className="item-content">
              <h3 className="item-name">Chicken 65 Biryani</h3>
              {showDescription['sunday-chicken-65-biryani'] && (
                <p className="item-description">Spicy, 65 fried chicken and Biryani Rice with ground spices.</p>
              )}
              <button
                className="description-toggle-btn"
                onClick={() => toggleDescription('sunday-chicken-65-biryani')}
              >
                {showDescription['sunday-chicken-65-biryani'] ? 'Hide Details' : 'View Details'}
              </button>
              <div className="item-footer">
                <span className="item-price">₹150</span>
                {(() => {
                  const cartItem = cart.find(item => item.name === 'Chicken 65 Biryani Regular');
                  return cartItem ? (
                    <div className="quantity-controls-btn">
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}>-</button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}>+</button>
                    </div>
                  ) : (
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart({
                        name: 'Chicken 65 Biryani Regular',
                        price: 150,
                        image: '/assets/65biryani.avif'
                      }, 'regular', true)}
                      disabled={!isSunday}
                    >
                      {isSunday ? 'Add to Cart' : 'Available on Sunday'}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
          <div className="menu-item-card special-item">
            <div className="special-badge">Sunday Only</div>
            <div className="item-image">
              <img src="/assets/largebiryani.avif" alt="Sunday Special Mutton Biryani" />
            </div>
            <div className="item-content">
              <h3 className="item-name">Large Chicken 65 Biryani</h3>
              {showDescription['sunday-chicken-65-biryani-large'] && (
                <p className="item-description">Spicy, 65 fried chicken and Biryani Rice with ground spices.</p>
              )}
              <button
                className="description-toggle-btn"
                onClick={() => toggleDescription('sunday-chicken-65-biryani-large')}
              >
                {showDescription['sunday-chicken-65-biryani-large'] ? 'Hide Details' : 'View Details'}
              </button>
              <div className="item-footer">
                <span className="item-price">₹200</span>
                {(() => {
                  const cartItem = cart.find(item => item.name === 'Large Chicken 65 Biryani');
                  return cartItem ? (
                    <div className="quantity-controls-btn">
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}>-</button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}>+</button>
                    </div>
                  ) : (
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart({
                        name: 'Large Chicken 65 Biryani',
                        price: 200,
                        image: '/assets/largebiryani.avif'
                      }, 'large', true)}
                      disabled={!isSunday}
                    >
                      {isSunday ? 'Add to Cart' : 'Available on Sunday'}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="size-selector">
        <button
          className={`size-btn ${selectedSize === 'regular' ? 'active' : ''}`}
          onClick={() => setSelectedSize('regular')}
        >
          Regular Size
        </button>
        <button
          className={`size-btn ${selectedSize === 'large' ? 'active' : ''}`}
          onClick={() => setSelectedSize('large')}
        >
          Large Size
        </button>
      </div>

      <div className="menu-grid">
        {menuData[selectedSize].map((item) => (
          <div key={item.id} className={`menu-item-card ${item.special ? 'special-item' : ''} ${isOutOfStock(item.name) ? 'out-of-stock' : ''}`}>
            {item.special && <div className="special-badge">Sunday Special</div>}
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-content">
              <h3 className="item-name">{item.name}</h3>
              {showDescription[item.id] && (
                <p className="item-description">{item.description}</p>
              )}
              <button
                className="description-toggle-btn"
                onClick={() => toggleDescription(item.id)}
              >
                {showDescription[item.id] ? 'Hide Details' : 'View Details'}
              </button>
              <div className="item-footer">
                <span className="item-price">₹{item.price}</span>
                {(() => {
                  const cartItem = cart.find(cartItem => cartItem.name === item.name && cartItem.size === selectedSize);
                  return cartItem ? (
                    <div className="quantity-controls-btn">
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}>-</button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}>+</button>
                    </div>
                  ) : (
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item, selectedSize)}
                      disabled={isOutOfStock(item.name)}
                    >
                      {isOutOfStock(item.name) ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Friday Special Section */}
      <div className="friday-special-section">
        <h2 className="section-title"><img src="/assets/ONLY.png" alt="Friday Special Offer" /></h2>
        <div className="menu-grid">
          <div className="menu-item-card special-item friday-item">
            <div className="special-badge friday-badge">Friday Only</div>
            <div className="item-image">
              <img src="/assets/regular.avif" alt="Friday Special Offer" />
            </div>
            <div className="item-content">
              <h3 className="item-name">Chicken Biryani Special</h3>
              {showDescription['friday-special-1'] && (
                <p className="item-description">Friday special chicken biryani for just ₹100 only!</p>
              )}
              <button
                className="description-toggle-btn"
                onClick={() => toggleDescription('friday-special-1')}
              >
                {showDescription['friday-special-1'] ? 'Hide Details' : 'View Details'}
              </button>
              <div className="item-footer">
                <span className="item-price">₹100</span>
                {(() => {
                  const cartItem = cart.find(item => item.name === 'Friday Special Chicken Biryani');
                  return cartItem ? (
                    <div className="quantity-controls-btn">
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}>-</button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}>+</button>
                    </div>
                  ) : (
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart({
                        name: 'Friday Special Chicken Biryani',
                        price: 100,
                        image: '/assets/regular.avif'
                      }, 'regular', true)}
                      disabled={!isFriday}
                    >
                      {isFriday ? 'Add to Cart' : 'Available on Friday'}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
          <div className="menu-item-card special-item friday-item">
            <div className="special-badge friday-badge">Friday Only</div>
            <div className="item-image">
              <img src="/assets/egg.avif" alt="Friday Special Offer" />
            </div>
            <div className="item-content">
              <h3 className="item-name">Egg Biryani Special</h3>
              {showDescription['friday-special-2'] && (
                <p className="item-description">Friday special egg biryani for just ₹100 only!</p>
              )}
              <button
                className="description-toggle-btn"
                onClick={() => toggleDescription('friday-special-2')}
              >
                {showDescription['friday-special-2'] ? 'Hide Details' : 'View Details'}
              </button>
              <div className="item-footer">
                <span className="item-price">₹100</span>
                {(() => {
                  const cartItem = cart.find(item => item.name === 'Friday Special Egg Biryani');
                  return cartItem ? (
                    <div className="quantity-controls-btn">
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}>-</button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}>+</button>
                    </div>
                  ) : (
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart({
                        name: 'Friday Special Egg Biryani',
                        price: 100,
                        image: '/assets/egg.avif'
                      }, 'regular', true)}
                      disabled={!isFriday}
                    >
                      {isFriday ? 'Add to Cart' : 'Available on Friday'}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
          <div className="menu-item-card special-item friday-item">
            <div className="special-badge friday-badge">Friday Only</div>
            <div className="item-image">
              <img src="/assets/plain.avif" alt="Friday Special Offer" />
            </div>
            <div className="item-content">
              <h3 className="item-name">Plain Biryani Special</h3>
              {showDescription['friday-special-3'] && (
                <p className="item-description">Friday special plain biryani for just ₹100 only!</p>
              )}
              <button
                className="description-toggle-btn"
                onClick={() => toggleDescription('friday-special-3')}
              >
                {showDescription['friday-special-3'] ? 'Hide Details' : 'View Details'}
              </button>
              <div className="item-footer">
                <span className="item-price">₹100</span>
                {(() => {
                  const cartItem = cart.find(item => item.name === 'Friday Special Plain Biryani');
                  return cartItem ? (
                    <div className="quantity-controls-btn">
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}>-</button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}>+</button>
                    </div>
                  ) : (
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart({
                        name: 'Friday Special Plain Biryani',
                        price: 100,
                        image: '/assets/plain.avif'
                      }, 'regular', true)}
                      disabled={!isFriday}
                    >
                      {isFriday ? 'Add to Cart' : 'Available on Friday'}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}