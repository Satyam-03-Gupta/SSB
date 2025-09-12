import '../src/App.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Footer Content */}
      <div className="footer_background">
        <div className="logo-cloud">
          <img src="/assets/ssblogo.png" alt="SSB Logo" className="footer_logo" />
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
              Enjoy our tasty Chicken Rolls—juicy seasoned chicken in a soft wrap. Delicious and easy
              for a quick bite on the move!
            </p>
            <a href="#">Read more</a>
          </div>

          <div className="main_footer">
            <h2>Contact Us</h2>
            <p>6 E Esplanade, St Albans VIC 3021, Australia</p>
            <p>+91 80005 89080</p>
            <a href="mailto:support@food.com">support@food.com</a>
          </div>

          <div className="main_footer">
            <h2>Opening Hours</h2>
            <p>Mon - Thu: 11:00 AM - 9:00 PM</p>
            <p>Fri - Sat: 11:00 AM - 5:00 PM</p>
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
