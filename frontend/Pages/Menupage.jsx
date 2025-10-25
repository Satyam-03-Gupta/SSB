import React, { useEffect } from "react";
import DetailedMenu from "../components/DetailedMenu";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import styles from '../src/Design.module.css';
import { setPageTitle } from "../lib/util";

const MenuPage = () => {
  useEffect(() => {
    setPageTitle('Menu - Order Delicious Biryani');
  }, []);

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
