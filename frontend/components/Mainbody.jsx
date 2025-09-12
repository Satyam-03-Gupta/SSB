import { useEffect } from "react";
import TypeIt from "typeit";
import '../src/App.css';

export default function Main() {
  useEffect(() => {
    new TypeIt("#hero-type", {
      waitUntilVisible: true,
      speed: 170,
      loop: true,
    })
      .type("-BOOK NOW!")
      .pause(1000)
      .delete()
      .type("-ORDER NOW!")
      .pause(1000)
      .delete()
      .go();
  }, []);

  return (
    <div className="bodypart">
      <section>
        <h1 className="title">
          Order your best food <span id="hero-type" className="type"></span>
        </h1>
      </section>
      <div className="bodydetails">

        <span className="subtitle">Get the tastiest food now!</span>

        <span className="subextra">
          Experience culinary bliss at our fast food paradise. From sizzling
          burgers to crispy fries, every bite is a flavor-packed adventure. Join
          us for a fast, fresh, and delicious journey.
        </span>

        <button
          className="buttom"
          onClick={() => {
            const element = document.querySelector(".our_menu");
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - 105;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }}
        >
          Let's Explore
        </button>

        <span className="mouse">
          <span className="roller mouse"></span>
        </span>
      </div>
    </div>
  );
}
