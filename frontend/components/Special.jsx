import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import '../src/App.css';

export default function TodaySpecial() {
  const specials = [
    {
      id: 1,
      title: "Sunday Special Biryani",
      desc: "Aromatic basmati rice with tender chicken pieces, cooked with special Sunday spices and served with raita. A perfect weekend treat!",
      img: "/assets/order.png",
      price: "₹299",
      badge: "Sunday Only"
    },
    {
      id: 2,
      title: "Friday Offer - Any Biryani",
      desc: "Get any regular biryani for just ₹100! Choose from Chicken, Egg, or Plain Biryani. Limited time Friday special offer.",
      img: "/assets/order.png",
      price: "₹100",
      badge: "Friday Only"
    },
    {
      id: 3,
      title: "Chicken 65 Special",
      desc: "Crispy fried chicken with our signature spice blend, served with mint chutney. A perfect appetizer or main course.",
      img: "/assets/order.png",
      price: "₹125",
      badge: "Limited Time"
    },
  ];

  return (
    <div className="today_special">
      <div className="today_special_header">
        <span className="special_title">Today's Special</span>
        <span className="special_subtitle">
          Savor our Special Deluxe Burger Combo today – a perfect blend of premium chicken, 
          melted cheese, and our secret sauce, paired with golden fries. Irresistibly delicious!
        </span>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        spaceBetween={30}
        slidesPerView={1}
        className="today_special_swiper"
      >
        {specials.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className="cards professional-card"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className="special-badge animated-badge">{item.badge}</div>
              <div className="price-tag animated-price">{item.price}</div>
              <div className="card-center-btn">
                <button 
                  className="order-special-btn animated-btn"
                  onClick={() => {
                    // Add to cart
                    const cartItem = {
                      id: `special-${item.id}-${Date.now()}`,
                      name: item.title,
                      price: parseInt(item.price.replace('₹', '')),
                      image: item.img,
                      size: 'regular',
                      quantity: 1,
                      isSpecial: true
                    };
                    
                    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const newCart = [...existingCart, cartItem];
                    localStorage.setItem('cart', JSON.stringify(newCart));
                    
                    // Redirect to menu
                    window.location.href = '/menu';
                  }}
                >
                  Order Now
                </button>
              </div>
              <div className="overlays">
                <div className="overlays_body enhanced-overlay">
                  <h2 className="animated-title">{item.title}</h2>
                  <p className="animated-desc">{item.desc}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="special_menu_footer animated-footer">
        <p>Limited time offers - Order now before they're gone!</p>
      </div>
    </div>
  );
}
