import React from 'react';
import { motion, useScroll } from 'framer-motion';
import styled from 'styled-components';

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: #FFBF00; // Gold accent color
  transform-origin: 0%;
  z-index: 2000; // Ensure it's above other content
`;

const ScrollProgressIndicator = () => {
  const { scrollYProgress } = useScroll();

  return (
    <ProgressBar style={{ scaleX: scrollYProgress }} />
  );
};

export default ScrollProgressIndicator;