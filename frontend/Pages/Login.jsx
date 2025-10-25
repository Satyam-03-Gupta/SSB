import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Loginpage from "../components/loginpage";
import Footer from "../components/Footer";
import { setPageTitle } from "../lib/util";

const Login = () => {
  useEffect(() => {
    setPageTitle('Login - Access Your Account');
  }, []);

  return (
    <>
      <Navbar />
      <Loginpage />
      <Footer />
    </>
  );
};

export default Login;