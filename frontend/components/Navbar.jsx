import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/updatedlogo.png";
import '../src/App.css';
import './DetailedMenu.css'
import './NavbarCart.css';
import { useCart } from '../lib/useCart';
import CartModal from './CartModal';

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
const Profile = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar-profile">
      {user ? (
        <div className={`user-menu ${isDropdownOpen ? 'active' : ''}`}>
          <div className="user-avatar" onClick={toggleDropdown}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-dropdown">
            <a href="/profile">👤 Profile</a>
            <a href="/orders">🛒 My Orders</a>
            <button onClick={handleLogout}>🚪 Logout</button>
          </div>
        </div>
      ) : (
        <a href="/user/login" className="login-link">
          Login
        </a>
      )}
    </div>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCross, setShowCross] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const {
    cart,
    selectedAddress,
    setSelectedAddress,
    userAddresses,
    setUserAddresses,
    tip,
    setTip,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    getTotalQuantity,
    confirmOrder
  } = useCart();

  const handleConfirmOrder = async () => {
    if (paymentMethod === 'razorpay') {
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

        const razorpayOrder = await orderResponse.json();
        const razorpayLoaded = await loadRazorpay();

        if (razorpayLoaded) {
          const rzp = new window.Razorpay({
            key: 'rzp_test_JZhnqNEMQas344',
            amount: totalAmount * 100,
            currency: 'INR',
            name: 'SSB Biryani',
            order_id: razorpayOrder.id,
            handler: () => confirmOrder('razorpay'),
            prefill: { name: user.name, email: user.email },
            theme: { color: '#e75b1e' }
          });
          rzp.open();
        }
      } catch (error) {
        alert('Payment failed. Please try again.');
      }
    } else {
      await confirmOrder('cod');
    }
    setShowCart(false);
  };



  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <header>
      <nav className="navbar">

        <div className="navbar-brand">
          <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleNav}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="mobile-brand">SSB-<span style={{ color: 'white' }}>Biryani</span></div>
          <a href="/">
            <img src={logo} alt="Logo" className="logo" />
          </a>
        </div>


        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <li><a href="/" className={window.location.pathname === '/' ? 'active-page' : ''} onClick={closeNav}>MENU</a></li>
          <li><a href="/home" className={window.location.pathname === '/home' ? 'active-page' : ''} onClick={closeNav}>HOME</a></li>
          <li><a href="/about" className={window.location.pathname === '/about' ? 'active-page' : ''} onClick={closeNav}>ABOUT US</a></li>
          {/* <div className="dropdown"> */}
          <li><a href="/blog" className={window.location.pathname === '/blog' ? 'active-page' : ''} onClick={closeNav}>BLOG</a></li>
          <li><a href="/gallery" className={window.location.pathname === '/gallery' ? 'active-page' : ''} onClick={closeNav}>GALLERY</a></li>
          <li><a href="/pricing" className={window.location.pathname === '/pricing' ? 'active-page' : ''} onClick={closeNav}>PRICING</a></li>
          {/* </div> */}
          <li><a href="/orders" className={window.location.pathname === '/orders' ? 'active-page' : ''} onClick={closeNav}>ORDERS</a></li>
          <li><a href="/contact" className={window.location.pathname === '/contact' ? 'active-page' : ''} onClick={closeNav}>CONTACT US</a></li>
        </ul>

        <div className="navbar-actions">
          <button
            className="cart-btn"
            onClick={() => setShowCart(!showCart)}
          >
            🛒 Cart ({getTotalQuantity()})
          </button>
          <Profile />
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
          setUserAddresses={setUserAddresses}
          tip={tip}
          setTip={setTip}
          confirmOrder={handleConfirmOrder}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </nav>
    </header>
  );
}
