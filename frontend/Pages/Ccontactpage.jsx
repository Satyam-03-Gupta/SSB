import React from "react";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import styles from '../src/Design.module.css';

const ContactPage = () => {
  return (
    <>
      <div className={styles.contactContainer}>
        <Contact />
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
