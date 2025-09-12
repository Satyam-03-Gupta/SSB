import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [selectedAddress, setSelectedAddress] = useState('');
  const [userAddresses, setUserAddresses] = useState([]);
  const [tip, setTip] = useState(0);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  }, [cart]);

  // Load user addresses on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const addresses = JSON.parse(localStorage.getItem(`addresses_${user.email}`)) || [];
      if (user.location?.address) {
        const userAddress = {
          address: user.location.address,
          latitude: user.location.latitude,
          longitude: user.location.longitude
        };
        addresses.unshift(userAddress);
      }
      setUserAddresses(addresses);
      if (addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
    }
  }, []);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        handleCartUpdate();
      }
    };

    const handleCustomCartUpdate = (e) => {
      setCart(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCustomCartUpdate);
    
    const interval = setInterval(handleCartUpdate, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCustomCartUpdate);
      clearInterval(interval);
    };
  }, []);

  const addToCart = (item, size = 'regular', isSpecial = false) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/user/login';
      return;
    }
    
    const existingItem = cart.find(cartItem => 
      cartItem.name === item.name && cartItem.size === size
    );
    
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const cartItem = {
        id: `${item.id || item.name}-${size}-${Date.now()}`,
        name: item.name,
        price: item.price,
        image: item.image,
        size: size,
        quantity: 1,
        isSpecial: isSpecial
      };
      setCart(prevCart => [...prevCart, cartItem]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    setTip(0);
    localStorage.removeItem('cart');
  };

  const confirmOrder = async (paymentMethod = 'cod') => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to place order');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!selectedAddress || (typeof selectedAddress === 'string' && !selectedAddress.trim()) || (typeof selectedAddress === 'object' && !selectedAddress.address)) {
      alert('Please select or enter a delivery address');
      return;
    }

    const subtotal = calculateTotal();
    const deliveryFee = 30;
    const gst = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + deliveryFee + gst + tip;

    const orderData = {
      orderId: Date.now().toString(),
      userEmail: user.email,
      phoneNumber: user.phone || '',
      deliveryAddress: typeof selectedAddress === 'string' ? selectedAddress : selectedAddress.address,
      deliveryCoordinates: selectedAddress.latitude && selectedAddress.longitude ? {
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude
      } : null,
      items: cart,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      gst: gst,
      tip: tip,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      isNewOrder: true
    };

    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        clearCart();
        window.location.href = '/orders';
        return true;
      } else {
        alert('Failed to place order. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
      return false;
    }
  };

  return {
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
    clearCart,
    confirmOrder
  };
};