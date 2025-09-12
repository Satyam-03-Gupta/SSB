import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../src/App.css';
import api from '../lib/axios.js';

export default function OurMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const scrollToSection = (itemId) => {
    let targetSelector;
    
    switch(itemId) {
      case 1: // Price List
        targetSelector = '.menu-grid';
        break;
      case 2: // Sunday SPL
        targetSelector = '.sunday-special-section';
        break;
      case 3: // Friday Offer
        targetSelector = '.friday-special-section';
        break;
      default:
        targetSelector = '.menu-grid';
    }
    
    console.log('Looking for:', targetSelector);
    const targetElement = document.querySelector(targetSelector);
    console.log('Found element:', targetElement);
    
    if (targetElement) {
      const elementPosition = targetElement.offsetTop;
      const offsetPosition = elementPosition - 200;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    } else {
      console.log('Element not found, scrolling to menu-grid');
      const fallback = document.querySelector('.menu-grid');
      if (fallback) {
        const elementPosition = fallback.offsetTop;
        const offsetPosition = elementPosition - 200;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/api/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        console.log('Using fallback static data');
        // Fallback to static data
        setMenuItems([
          {
            id: 1,
            name: "Price List",
            img: "/assets/menu1.jpg",
            button: "Order Now",
            closed: false,
          },
          {
            id: 2,
            name: "Sunday SPL",
            img: "/assets/menu2.jpg",
            button: "Order Now",
            closed: false,
          },
          {
            id: 3,
            name: "Friday Offer",
            img: "/assets/menu4.jpg",
            button: "Order Now",
            closed: false,
          },
          {
            id: 4,
            name: "Holiday Update",
            img: "/assets/menu3.jpg",
            button: "Shop Closed",
            closed: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) return <div>Loading menu...</div>;
  return (
    <div className="our_menu">
      <span className="title_menu">Our Menu</span>
      <span className="about_menu">
        <p>The following is a list of foods available in our restaurant</p>
      </span>

      {/* Menu Items */}
      <div className="menu_container_wrap">
        {menuItems.map((item) => (
          <div className="menu_container" key={item.id}>
            <img src={item.img} alt={item.name} className="order-image" />
            <span className="inside order-footer">
              <button
                className={`order-btn ${item.closed ? "disabled" : ""}`}
                disabled={item.closed}
                onClick={!item.closed ? () => navigate('/menu') : undefined}
              >
                {item.button}
              </button>
            </span>

          </div>
        ))}
      </div>
    </div>
  );
}
