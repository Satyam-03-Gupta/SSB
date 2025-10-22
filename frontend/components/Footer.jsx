import '../src/App.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Footer Content */}
      <div className="footer_background">
        <div className="logo-cloud">
          <img src="/assets/biryaniride.png" alt="SSB Logo" className="footer_logo" />
        </div>
        <div className="footer_container">
          <div className="main_footer">
            <h2>About Us</h2>
            <p>
              Delicious Fast Food welcomes you to a world where satisfaction is served on every plate.
            </p>
            <a href="#">Read more</a>
          </div>

          <div className="main_footer">
            <h2>New Menu</h2>
            <p>
              Enjoy our tasty Chicken 65 Biryani—juicy seasoned chicken and fragrant rice, served with raita. Delicious and easy
              for a quick bite on the move!
            </p>
            <a href="#">Read more</a>
          </div>

          <div className="main_footer">
            <h2>Contact Us</h2>
            <p>30, Madambakkam Main Rd, Madambakkam, Rajakilpakkam, Chennai, Tamil Nadu 600073</p>
            <p>+91 99625 252110</p>
            <p>Website: 9330378959</p>
            <a href="mailto:bca.kingshuk@gmail.com">bca.kingshuk@gmail.com</a>
          </div>

          <div className="main_footer">
            <h2>Opening Hours</h2>
            <p>Sun - Sat: 10:00 AM - 3:00 PM</p>
            <p>Tue - Every AMMAVASI: Holiday</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright_footer">
        <div className="scroller">
          <div className="scroller_inner">
            <h4>Copyright © 2023 FastFood Restaurant | Powered by Kingshuk</h4>
            <h4>Fast Food Restaurant</h4>
            <h4>Copyright © 2023 FastFood Restaurant | Powered by Kingshuk</h4>
            <h4>Fast Food Restaurant</h4>
          </div>
        </div>
      </div>
    </footer>
  );
}
