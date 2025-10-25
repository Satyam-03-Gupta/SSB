import React, { useEffect } from "react";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import styles from '../src/Design.module.css';
import { setPageTitle } from "../lib/util";

const ContactPage = () => {
  useEffect(() => {
    setPageTitle('Contact Us - Get In Touch');
  }, []);

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
