// src/pages/EventsPage.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
// ✨ 1. Import the new ElfsightWidget component
import ElfsightWidget from '../components/ui/ElfsightWidget'; // Adjust path if needed

const PageContainer = styled.div`
  padding: 100px 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #1A2B4C;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-top: 0.5rem;
`;

// Renamed for clarity, holds the Elfsight widget
const WidgetDisplayContainer = styled(motion.div)`
  /* Add any specific styling for the widget container here if needed */
  /* For example, max-width or margins */
`;

const EventsPage = () => {
  return (
    <PageContainer>
      <Header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Title>Events & Activities</Title>
        <Subtitle>Our journey, live from Instagram.</Subtitle>
      </Header>

      <WidgetDisplayContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* ✨ 2. Use the new ElfsightWidget component here */}
        <ElfsightWidget />
      </WidgetDisplayContainer>
    </PageContainer>
  );
};

export default EventsPage;