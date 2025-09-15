import React from 'react';
import styled from 'styled-components';
import HeroSection from '../components/sections/HeroSection';
import PhotoSlideshow from '../components/sections/PhotoSlideshow';
import WingsSection from '../components/sections/WingsSection';
import AboutSection from '../components/sections/AboutSection';
import RegistrationForm from '../components/sections/RegistrationForm';

const HomeContainer = styled.div`
  width: 100%;
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <HeroSection />
      <AboutSection />
      <PhotoSlideshow />
      <WingsSection />
      <RegistrationForm />
    </HomeContainer>
  );
};

export default HomePage;