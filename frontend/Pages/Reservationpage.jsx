import React, { useEffect } from "react";
import Reservation from "../components/Reservation";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { setPageTitle } from "../lib/util";

const ReservationPage = () => {
  useEffect(() => {
    setPageTitle('Reservation - Book Your Table');
  }, []);

  return (
    <>
      <Reservation />
      <Contact />
      <Footer />
    </>
  );
};

export default ReservationPage;
