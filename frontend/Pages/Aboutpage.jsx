import React from "react";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import styles from '../src/Design.module.css';



const AboutPage = () => {
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
