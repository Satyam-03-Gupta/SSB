import React, { useEffect } from 'react';
import Blog from "../components/Blog";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { setPageTitle } from "../lib/util";

const Blogpage = () => {
  useEffect(() => {
    setPageTitle('Blog - Latest Updates');
  }, []);

  return (
    <div>
      <Blog />
      <Contact />
      <Footer />
    </div>
  )
}

export default Blogpage

