import { useState, useEffect } from 'react';
import { FaShieldAlt, FaSignOutAlt, FaClock, FaLock } from 'react-icons/fa';
import AdminProtectedRoute from './AdminProtectedRoute';
import notificationService from '../lib/notificationService';
import '../src/App.css';
import './AdminStyles.css';

export default function AdminDashboard() {
  const [sessionInfo, setSessionInfo] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [storeStatus, setStoreStatus] = useState({ isOpen: true, allowPrebooking: true, message: '' });
  const [prebookings, setPrebookings] = useState([]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Hide navbar for admin pages
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) navbar.style.display = 'none';
    
    return () => {
      const navbar = document.querySelector('nav');
      if (navbar) navbar.style.display = 'flex';
    };
  }, []);

  useEffect(() => {
    const loginTime = localStorage.getItem('adminLoginTime');
    if (loginTime) {
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      const elapsed = Date.now() - parseInt(loginTime);
      const remaining = Math.max(0, sessionDuration - elapsed);
      
      setSessionInfo({
        loginTime: new Date(parseInt(loginTime)).toLocaleString(),
        timeRemaining: Math.floor(remaining / 1000)
      });
      setTimeLeft(Math.floor(remaining / 1000));
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && sessionInfo.timeRemaining) {
      handleLogout();
    }
  }, [timeLeft]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoginTime');
    window.location.href = '/admin/login';
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/orders/admin/all');
      if (response.ok) {
        const allOrders = await response.json();
        setOrders(allOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (confirm('Are you sure you want to hide this order from admin view? (Order will remain visible to customer)')) {
      try {
        const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setOrders(orders.filter(order => order._id !== orderId));
        }
      } catch (error) {
        console.error('Error hiding order:', error);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchAllOrders();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    } else if (activeTab === 'store') {
      fetchStoreStatus();
      fetchPrebookings();
    }
  }, [activeTab]);

  useEffect(() => {
    notificationService.requestPermission();
    
    let orderIds = new Set();
    let isFirstLoad = true;
    
    const pollInterval = notificationService.startOrderPolling(async () => {
      try {
        const response = await fetch('http://localhost:3001/api/orders/admin/all');
        if (response.ok) {
          const newOrders = await response.json();
          const newOrderIds = new Set(newOrders.map(o => o._id));
          
          if (!isFirstLoad && orderIds.size > 0) {
            const hasNewOrder = newOrders.some(order => !orderIds.has(order._id));
            
            if (hasNewOrder) {
              console.log('🔔 New order detected in admin!');
              await notificationService.showNotification('New Order!', 'A new order has been placed');
            }
          }
          
          orderIds = newOrderIds;
          isFirstLoad = false;
          setOrders(newOrders);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
    
    return () => notificationService.stopOrderPolling(pollInterval);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  const handleEditMenuItem = (itemName) => {
    if (confirm(`Edit ${itemName}?`)) {
      alert(`Edit functionality for ${itemName} - Coming soon!`);
    }
  };

  const handleDeleteMenuItem = (itemName) => {
    if (confirm(`Are you sure you want to delete ${itemName}?`)) {
      alert(`${itemName} deleted successfully!`);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/contact');
      if (response.ok) {
        const contactData = await response.json();
        setContacts(contactData);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const deleteContact = async (contactId) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/contact/${contactId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setContacts(contacts.filter(contact => contact._id !== contactId));
          alert('Contact deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const callContact = (contact) => {
    window.open(`tel:${contact.phone}`, '_self');
  };

  const toggleStock = (itemName) => {
    const newMenuItems = {
      ...menuItems,
      [itemName]: {
        ...menuItems[itemName],
        outOfStock: !menuItems[itemName]?.outOfStock
      }
    };
    setMenuItems(newMenuItems);
    localStorage.setItem('adminMenuStock', JSON.stringify(newMenuItems));
    const status = menuItems[itemName]?.outOfStock ? 'In Stock' : 'Out of Stock';
    alert(`${itemName} marked as ${status}`);
  };

  const fetchStoreStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/store/status');
      if (response.ok) {
        const data = await response.json();
        setStoreStatus(data);
      }
    } catch (error) {
      console.error('Error fetching store status:', error);
    }
  };

  const updateStoreStatus = async (newStatus) => {
    try {
      const response = await fetch('http://localhost:3001/api/store/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStatus)
      });
      if (response.ok) {
        const data = await response.json();
        setStoreStatus(data.store);
        alert('Store status updated successfully!');
      }
    } catch (error) {
      console.error('Error updating store status:', error);
    }
  };

  const fetchPrebookings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/prebookings/all');
      if (response.ok) {
        const data = await response.json();
        setPrebookings(data);
      }
    } catch (error) {
      console.error('Error fetching prebookings:', error);
    }
  };

  const convertToOrder = async (booking) => {
    if (confirm(`Convert prebooking #${booking.orderId} to regular order for delivery?`)) {
      try {
        const orderData = {
          orderId: booking.orderId,
          userEmail: booking.userEmail,
          phoneNumber: booking.phoneNumber,
          deliveryAddress: booking.deliveryAddress,
          items: booking.items,
          subtotal: booking.subtotal,
          deliveryFee: booking.deliveryFee || 50,
          gst: booking.gst,
          totalAmount: booking.totalAmount,
          isConversion: true
        };

        const response = await fetch('http://localhost:3001/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        if (response.ok) {
          // Update prebooking status
          await fetch(`http://localhost:3001/api/prebookings/${booking._id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Converted' })
          });
          
          alert('Prebooking converted to order successfully! Order is now ready for rider.');
          fetchPrebookings();
          fetchAllOrders(); // Refresh orders to show in Recent Orders
        } else {
          alert('Failed to convert prebooking to order.');
        }
      } catch (error) {
        console.error('Error converting prebooking:', error);
        alert('Error converting prebooking to order.');
      }
    }
  };



  return (
    <AdminProtectedRoute>
      <div className="admin-dashboard">
        {/* Main Admin Content */}
        <div className="admin-container">
          <div className={`admin-sidebar ${isOpen ? 'active' : ''}`}>
            <div className="admin-header">
              <h2>🛡️ Admin Panel</h2>
            </div>
            
            <div className="admin-nav">
              <button 
                className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                📊 Dashboard
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('orders');
                  fetchAllOrders();
                }}
              >
                📦 Orders
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveTab('contacts')}
              >
                📞 Contacts
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
                onClick={() => setActiveTab('menu')}
              >
                🍽️ Menu
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'store' ? 'active' : ''}`}
                onClick={() => setActiveTab('store')}
              >
                🏪 Store Status
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                👥 Users
              </button>
            </div>

            <button className="admin-logout-all" onClick={handleLogout}>
              <FaSignOutAlt />
              Secure Logout
            </button>
          </div>

          <div className="admin-content">
            {activeTab === 'dashboard' && (
              <div className="dashboard-section">
                {/* Session Info */}
                <div className="admin-session-info">
                  <div>Session: {sessionInfo.loginTime}</div>
                  <div>Expires in: {formatTime(timeLeft)}</div>
                </div>

                {/* Security Badge */}
                <div className="security-badge">
                  <FaShieldAlt />
                  Secure Admin Session
                </div>
                
                <div className="dashboard-header">
                  <div className={`admin-hamburger ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h1>Admin Dashboard</h1>

                </div>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <h3>{orders.length}</h3>
                      <p>Total Orders</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                      <h3>{orders.filter(o => o.status === 'Pending').length}</h3>
                      <p>Pending Orders</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <h3>₹{orders.reduce((sum, o) => sum + o.totalAmount, 0)}</h3>
                      <p>Total Revenue</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                      <h3>{orders.filter(o => o.status === 'Delivered').length}</h3>
                      <p>Completed Orders</p>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h2>Recent Orders</h2>
                  <div className="activity-list">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="activity-item">
                        <div className="activity-icon">📦</div>
                        <div className="activity-details">
                          <p>Order #{order.orderId} - {order.userEmail}</p>
                          <small>{new Date(order.orderDate).toLocaleString()}</small>
                        </div>
                        <div className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-management">
                <div className="orders-header">
                  <div className={`admin-hamburger ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h1>Order Management</h1>
                  <div className="header-buttons">
                    <button onClick={fetchAllOrders} className="refresh-btn">
                      🔄 Refresh
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="loading">Loading orders...</div>
                ) : (
                  <div className="orders-table">
                    {orders.length === 0 ? (
                      <p>No orders found</p>
                    ) : (
                      orders.map((order) => {
                        const isNewOrder = !['Delivered', 'Cancelled'].includes(order.status);
                        return (
                        <div key={order._id} className={`order-row ${isNewOrder ? 'new-order' : ''}`}>
                          <div className="order-info">
                            <h3>Order #{order.orderId}</h3>
                            <p>Customer: {order.userEmail}</p>
                            <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
                            <p>Total: ₹{order.totalAmount}</p>
                          </div>
                          
                          <div className="order-items">
                            <h4>Items:</h4>
                            {order.items.map((item, index) => (
                              <div key={index} className="item-summary">
                                {item.name} x{item.quantity} (₹{item.price * item.quantity})
                              </div>
                            ))}
                          </div>
                          
                          <div className="order-actions">
                            <select 
                              value={order.status} 
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="status-select"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            
                            <button 
                              onClick={() => deleteOrder(order._id)}
                              className="delete-btn"
                            >
                              👁️‍🗨️ Hide
                            </button>
                          </div>
                        </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="contacts-management">
                <div className="contacts-header">
                  <div className={`admin-hamburger ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h1>Contact Management</h1>
                </div>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>No contacts found</td>
                        </tr>
                      ) : (
                        contacts.map((contact) => (
                          <tr key={contact._id}>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.phone}</td>
                            <td>{contact.subject}</td>
                            <td className="message-cell">{contact.message}</td>
                            <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div className="action-buttons">
                                <button className="btn-reply" onClick={() => callContact(contact)}>📞 Call</button>
                                <button className="btn-delete" onClick={() => deleteContact(contact._id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="menu-management">
                <div className="menu-header">
                  <div className={`admin-hamburger ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h1>Menu Management</h1>
                  <button className="btn-add-menu">+ Add New Item</button>
                </div>
                <div className="menu-grid">
                  <div className="menu-admin-card">
                    <img src="/assets/regular.avif" alt="Chicken Biryani" />
                    <div className="menu-card-content">
                      <h3>Chicken Biryani</h3>
                      <p>₹125</p>
                      <div className="menu-card-actions">
                        <button className="btn-edit" onClick={() => handleEditMenuItem('Chicken Biryani')}>Edit</button>
                        <button 
                          className={`btn-reply ${menuItems['Chicken Biryani']?.outOfStock ? 'btn-delete' : ''}`}
                          onClick={() => toggleStock('Chicken Biryani')}
                        >
                          {menuItems['Chicken Biryani']?.outOfStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteMenuItem('Chicken Biryani')}>Delete</button>
                      </div>
                    </div>
                  </div>
                  <div className="menu-admin-card">
                    <img src="/assets/egg.avif" alt="Egg Biryani" />
                    <div className="menu-card-content">
                      <h3>Egg Biryani</h3>
                      <p>₹125</p>
                      <div className="menu-card-actions">
                        <button className="btn-edit" onClick={() => handleEditMenuItem('Egg Biryani')}>Edit</button>
                        <button 
                          className={`btn-reply ${menuItems['Egg Biryani']?.outOfStock ? 'btn-delete' : ''}`}
                          onClick={() => toggleStock('Egg Biryani')}
                        >
                          {menuItems['Egg Biryani']?.outOfStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteMenuItem('Egg Biryani')}>Delete</button>
                      </div>
                    </div>
                  </div>
                  <div className="menu-admin-card">
                    <img src="/assets/plain.avif" alt="Plain Biryani" />
                    <div className="menu-card-content">
                      <h3>Plain Biryani</h3>
                      <p>₹125</p>
                      <div className="menu-card-actions">
                        <button className="btn-edit" onClick={() => handleEditMenuItem('Plain Biryani')}>Edit</button>
                        <button 
                          className={`btn-reply ${menuItems['Plain Biryani']?.outOfStock ? 'btn-delete' : ''}`}
                          onClick={() => toggleStock('Plain Biryani')}
                        >
                          {menuItems['Plain Biryani']?.outOfStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteMenuItem('Plain Biryani')}>Delete</button>
                      </div>
                    </div>
                  </div>
                  <div className="menu-admin-card">
                    <img src="/assets/regular.avif" alt="Large Chicken Biryani" />
                    <div className="menu-card-content">
                      <h3>Large Chicken Biryani</h3>
                      <p>₹185</p>
                      <div className="menu-card-actions">
                        <button className="btn-edit" onClick={() => handleEditMenuItem('Large Chicken Biryani')}>Edit</button>
                        <button 
                          className={`btn-reply ${menuItems['Large Chicken Biryani']?.outOfStock ? 'btn-delete' : ''}`}
                          onClick={() => toggleStock('Large Chicken Biryani')}
                        >
                          {menuItems['Large Chicken Biryani']?.outOfStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteMenuItem('Large Chicken Biryani')}>Delete</button>
                      </div>
                    </div>
                  </div>
                  <div className="menu-admin-card">
                    <img src="/assets/egg.avif" alt="Large Egg Biryani" />
                    <div className="menu-card-content">
                      <h3>Large Egg Biryani</h3>
                      <p>₹175</p>
                      <div className="menu-card-actions">
                        <button className="btn-edit" onClick={() => handleEditMenuItem('Large Egg Biryani')}>Edit</button>
                        <button 
                          className={`btn-reply ${menuItems['Large Egg Biryani']?.outOfStock ? 'btn-delete' : ''}`}
                          onClick={() => toggleStock('Large Egg Biryani')}
                        >
                          {menuItems['Large Egg Biryani']?.outOfStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteMenuItem('Large Egg Biryani')}>Delete</button>
                      </div>
                    </div>
                  </div>
                  <div className="menu-admin-card">
                    <img src="/assets/plain.avif" alt="Large Plain Biryani" />
                    <div className="menu-card-content">
                      <h3>Large Plain Biryani</h3>
                      <p>₹150</p>
                      <div className="menu-card-actions">
                        <button className="btn-edit" onClick={() => handleEditMenuItem('Large Plain Biryani')}>Edit</button>
                        <button 
                          className={`btn-reply ${menuItems['Large Plain Biryani']?.outOfStock ? 'btn-delete' : ''}`}
                          onClick={() => toggleStock('Large Plain Biryani')}
                        >
                          {menuItems['Large Plain Biryani']?.outOfStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteMenuItem('Large Plain Biryani')}>Delete</button>
                      </div>
                    </div>
                  </div>
                  <div className="menu-admin-card">
                    <img src="/assets/chicken65.avif" alt="Sunday Special Chicken 65" />
                    <div className="menu-card-content">
                      <h3>Sunday Special Chicken 65</h3>
                      <p>₹125</p>
                      <div className="menu-card-actions">
                        <button className="btn-edit" onClick={() => handleEditMenuItem('Sunday Special Chicken 65')}>Edit</button>
                        <button 
                          className={`btn-reply ${menuItems['Sunday Special Chicken 65']?.outOfStock ? 'btn-delete' : ''}`}
                          onClick={() => toggleStock('Sunday Special Chicken 65')}
                        >
                          {menuItems['Sunday Special Chicken 65']?.outOfStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteMenuItem('Sunday Special Chicken 65')}>Delete</button>
                      </div>
                    </div>
                  </div>
                  <div className="menu-admin-card">
                    <img src="/assets/65biryani.avif" alt="Chicken 65 Biryani Regular" />
                    <div className="menu-card-content">
                      <h3>Chicken 65 Biryani Regular</h3>
                      <p>₹150</p>
                      <div className="menu-card-actions">
                        <button className="btn-edit" onClick={() => handleEditMenuItem('Chicken 65 Biryani Regular')}>Edit</button>
                        <button 
                          className={`btn-reply ${menuItems['Chicken 65 Biryani Regular']?.outOfStock ? 'btn-delete' : ''}`}
                          onClick={() => toggleStock('Chicken 65 Biryani Regular')}
                        >
                          {menuItems['Chicken 65 Biryani Regular']?.outOfStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteMenuItem('Chicken 65 Biryani Regular')}>Delete</button>
                      </div>
                    </div>
                  </div>
                  <div className="menu-admin-card">
                    <img src="/assets/largebiryani.avif" alt="Large Chicken 65 Biryani" />
                    <div className="menu-card-content">
                      <h3>Large Chicken 65 Biryani</h3>
                      <p>₹200</p>
                      <div className="menu-card-actions">
                        <button className="btn-edit" onClick={() => handleEditMenuItem('Large Chicken 65 Biryani')}>Edit</button>
                        <button 
                          className={`btn-reply ${menuItems['Large Chicken 65 Biryani']?.outOfStock ? 'btn-delete' : ''}`}
                          onClick={() => toggleStock('Large Chicken 65 Biryani')}
                        >
                          {menuItems['Large Chicken 65 Biryani']?.outOfStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteMenuItem('Large Chicken 65 Biryani')}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'store' && (
              <div className="store-management">
                <div className="store-header">
                  <div className={`admin-hamburger ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h1>Store Status Management</h1>
                  <button onClick={fetchStoreStatus} className="refresh-btn">🔄 Refresh</button>
                </div>
                
                <div className="store-controls">
                  <div className="store-status-card">
                    <h3>Current Status: {storeStatus.isOpen ? '🟢 Open' : '🔴 Closed'}</h3>
                    
                    <div className="store-form">
                      <label>
                        <input 
                          type="checkbox" 
                          checked={storeStatus.isOpen}
                          onChange={(e) => setStoreStatus({...storeStatus, isOpen: e.target.checked})}
                        />
                        Store is Open
                      </label>
                      
                      <label>
                        <input 
                          type="checkbox" 
                          checked={storeStatus.allowPrebooking}
                          onChange={(e) => setStoreStatus({...storeStatus, allowPrebooking: e.target.checked})}
                        />
                        Allow Prebooking
                      </label>
                      
                      <label>
                        Closure Message:
                        <textarea 
                          value={storeStatus.message}
                          onChange={(e) => setStoreStatus({...storeStatus, message: e.target.value})}
                          placeholder="Message to show when store is closed"
                        />
                      </label>
                      
                      <button 
                        onClick={() => updateStoreStatus(storeStatus)}
                        className="update-store-btn"
                      >
                        Update Store Status
                      </button>
                    </div>
                  </div>
                  
                  <div className="prebookings-section">
                    <h3>Prebookings ({prebookings.filter(booking => booking.status !== 'Converted').length})</h3>
                    <button onClick={fetchPrebookings} className="refresh-btn">Load Prebookings</button>
                    
                    <div className="prebookings-list">
                      {prebookings.filter(booking => booking.status !== 'Converted').map((booking) => (
                        <div key={booking._id} className="prebooking-card">
                          <h4>Order #{booking.orderId}</h4>
                          <p>Customer: {booking.userEmail}</p>
                          <p>Phone: {booking.phoneNumber}</p>
                          <p>Address: {booking.deliveryAddress}</p>
                          <p>Preferred Date: {new Date(booking.preferredDate).toLocaleDateString()}</p>
                          <p>Total: ₹{booking.totalAmount}</p>
                          <p>Status: {booking.status}</p>
                          {booking.status === 'Pending' && (
                            <button 
                              onClick={() => convertToOrder(booking)}
                              className="convert-order-btn"
                            >
                              🚀 Ready for Delivery
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-management">
                <div className="users-header">
                  <div className={`admin-hamburger ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h1>User Management</h1>
                </div>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>No users found</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}