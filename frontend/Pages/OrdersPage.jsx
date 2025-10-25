import React, { useEffect } from "react";
import Orders from "../components/Orders";
import Footer from "../components/Footer";
import { setPageTitle } from "../lib/util";

const OrdersPage = () => {
  useEffect(() => {
    setPageTitle('Orders - Track Your Delivery');
  }, []);

  return (
    <>
      <Orders />
      <Footer />
    </>
  );
};

export default OrdersPage;