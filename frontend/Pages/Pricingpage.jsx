import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import styles from '../src/Design.module.css';
import { setPageTitle } from "../lib/util";

const Homepage = () => {
  useEffect(() => {
    setPageTitle('Pricing - Subscription Plans');
  }, []);

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
