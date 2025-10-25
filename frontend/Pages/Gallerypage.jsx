import React, { useEffect } from 'react';
import Gallery from "../components/Gallery";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { setPageTitle } from "../lib/util";

const Gallerypage = () => {
  useEffect(() => {
    setPageTitle('Gallery - Food Photos');
  }, []);

  return (
    <div>
      <Gallery />
      <Contact />
      <Footer />
    </div>
  )
}

export default Gallerypage;
