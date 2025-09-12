import React from "react";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import styles from '../src/Design.module.css';


const Homepage = () => {
  return (
    <>
    <div className={styles.priceContainer}>
      <Navbar />
      <Menu />
      <Contact />
      <Footer />
    </div>
    </>
  );
};

export default Homepage;
