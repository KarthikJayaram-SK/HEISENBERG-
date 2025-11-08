// src/pages/HomePage.js
import React from 'react';
import styled from 'styled-components';
import HeroSection from '../components/sections/HeroSection';
import PhotoSlideshow from '../components/sections/PhotoSlideshow';
import WingsSection from '../components/sections/WingsSection';
import AboutSection from '../components/sections/AboutSection';
import RegistrationForm from '../components/sections/RegistrationForm';
import Chatbot from '../components/sections/Chatbot';
import { useAuth } from '../contexts/AuthContext'; // ✨ 1. Import useAuth

const HomeContainer = styled.div`
  width: 100%;
`;

const HomePage = () => {
  const { currentUser } = useAuth(); // ✨ 2. Get the current user

  return (
    <HomeContainer>
      <HeroSection />
      {/* --- Photo Slideshow is now here --- */}
      
      {/* ✨ 3. Pass the currentUser prop down */}
      <PhotoSlideshow currentUser={currentUser} /> 
      <Chatbot />
      <AboutSection />
      <WingsSection id="wings" />
      <RegistrationForm />
    </HomeContainer>
  );
};

export default HomePage;