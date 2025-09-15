import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ElfsightWidget from '../components/ui/ElfsightWidget'; // 1. Import your new component

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

const FeedContainer = styled(motion.div)`
  /* The widget is responsive by itself, this container just holds it */
`;

const EventsPage = () => {
  return (
    <PageContainer>
      <Header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Title>Events & Activities</Title>
        <Subtitle>Our journey, live from Instagram.</Subtitle>
      </Header>

      <FeedContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* 2. Use the component here */}
        <ElfsightWidget />
      </FeedContainer>
    </PageContainer>
  );
};

export default EventsPage;