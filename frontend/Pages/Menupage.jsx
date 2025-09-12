import React from "react";
import DetailedMenu from "../components/DetailedMenu";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import styles from '../src/Design.module.css';

const MenuPage = () => {
  return (
    <>
      <div className={styles.menuContainer}>
        <DetailedMenu />
        <Contact />
        <Footer />
      </div>
    </>
  );
};

export default MenuPage;
