import React, { useEffect } from "react";
import Main from "../components/Mainbody";
import About from "../components/About";
import Special from "../components/Special";
import Menu from "../components/Menu";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { setPageTitle } from "../lib/util";

const Homepage = () => {
  useEffect(() => {
    setPageTitle('Home - Premium Biryani Delivery');
  }, []);

  return (
    <>
      <Main />
      <Special />
      <Menu />
      <Contact />
      <Footer />
    </>
  );
};

export default Homepage;
