import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import ProfileComponent from "../components/Profile";
import Footer from "../components/Footer";
import { setPageTitle } from "../lib/util";

const Profile = () => {
  useEffect(() => {
    setPageTitle('Profile - Manage Account');
  }, []);

  return (
    <>
      <Navbar />
      <ProfileComponent />
      <Footer />
    </>
  );
};

export default Profile;