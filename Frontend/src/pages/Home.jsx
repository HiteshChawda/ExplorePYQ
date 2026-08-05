import React, { useEffect } from "react";
import { logout, getCurrentUser } from "../features/auth/services/auth.api";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";

import HeroSection from "../components/HeroSection";
import YoutubeCards from "../components/Youtubecards";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getCurrentUser();
        console.log(response);
      } catch (error) {
        navigate("/");
      }
    };

    checkUser();
  }, [navigate]);

  return(
    <>
    <Navbar />
    <HeroSection />
    <YoutubeCards/>
    <Footer/>
    </>
  );
};

export default Home;