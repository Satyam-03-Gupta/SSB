import React from 'react'
import '../src/App.css';


const About = () => {
  return (
    <div className="aboutus">
      <div className="about-info">
        <h1 className="design ">About us</h1>
        <h2 className="design2">IT STARTED, QUITE SIMPLY, LIKE THIS...</h2>
        <div className="aside_container">
          <span className="design3">Indulge your taste buds at Delicious Fast Food, where each bite is a burst of flavor.
            From our carefully crafted burgers to crispy fries, we're dedicated to delivering top-notch quality in
            every dish. Join us for good times, great food, and a memorable dining experience that's all about
            savoring deliciousness. <br></br>
            Indulge in quality ingredients meticulously chosen for their taste. Every item on our menu reflects a
            commitment to excellence, ensuring each visit is a flavor-packed journey. At Delicious Fast Food, we
            make every moment a delicious memory. <br></br>
            Beyond just a restaurant, we're a community hub where warmth and hospitality meet delectable fast food.
            Gather with friends and family, and immerse yourself in the joy of good times and great flavors.
            Delicious Fast Food welcomes you to a world where satisfaction is served on every plate.
          </span>

          <span className="aside_container_image"><img className="aside_image" src="/assets/about-main.jpg" alt="" />
            <img className="aside_image_2" src="/assets/about-inset.jpg" alt="" />
          </span>
        </div>
      </div>
    </div>
  )
}

export default About
