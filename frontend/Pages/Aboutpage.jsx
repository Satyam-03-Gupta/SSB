import React, { useEffect } from "react";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import styles from '../src/Design.module.css';
import { setPageTitle } from "../lib/util";

const AboutPage = () => {
  useEffect(() => {
    setPageTitle('About Us - Our Story');
  }, []);

  return (
    <>
        <div className={styles.aboutContainer}>
            <About />
            <Contact />
            <Footer />
        </div>
    </>
  );
};

export default AboutPage;
