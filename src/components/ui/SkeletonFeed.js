import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { background-color: #e0e0e0; }
  50% { background-color: #f0f0f0; }
  100% { background-color: #e0e0e0; }
`;

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const SkeletonCard = styled.div`
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const SkeletonFeed = () => {
  // Create an array of 8 items to render 8 skeleton cards
  const items = Array.from({ length: 8 });

  return (
    <SkeletonContainer>
      {items.map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </SkeletonContainer>
  );
};

export default SkeletonFeed;