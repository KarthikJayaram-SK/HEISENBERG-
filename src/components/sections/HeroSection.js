import React, { useEffect } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

const HeroContainer = styled.div` height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; background-color: #F0F2F5; padding-bottom: 5rem; `;
const HeroContent = styled(motion.div)` text-align: center; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 2rem; display: flex; flex-direction: column; align-items: center; `;
const MainTitle = styled(motion.h1)` font-size: clamp(3.5rem, 8vw, 8rem); font-weight: 900; margin-bottom: 1.5rem; line-height: 1.1; span { text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); } `;
const ARMY_RED = '#D22B2B';
const AIR_LIGHT_BLUE = '#87CEEB';
const NAVY_DARK_BLUE = '#000080';
const WingsInfoContainer = styled(motion.div)` display: flex; justify-content: space-around; align-items: center; background-color: #FFFFFF; border-radius: 15px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); padding: 1.5rem 2rem; margin: 2.5rem 0; width: 100%; max-width: 1000px; @media (max-width: 768px) { flex-direction: column; gap: 1.5rem; padding: 2rem; } `;
const WingDetail = styled.div` display: flex; flex-direction: column; align-items: center; position: relative; padding: 0 1rem; flex: 1; &:not(:last-child)::after { content: ''; position: absolute; right: -1.25rem; top: 50%; transform: translateY(-50%); width: 1px; height: 60%; background-color: #E0E0E0; @media (max-width: 768px) { display: none; } } `;
const WingName = styled.h3` font-size: 1.6rem; font-weight: 700; margin: 0 0 0.5rem 0; color: ${props => props.color}; `;
const UnitName = styled.p` font-size: 0.9rem; line-height: 1.5; margin: 0; font-weight: 500; color: ${props => props.color}; opacity: 0.8; white-space: pre-line; `;
const SubTitle = styled(motion.h2)` font-size: clamp(1.2rem, 3vw, 2rem); font-weight: 400; color: #555; letter-spacing: 0.1em; margin-top: 1rem; `;
const ScrollIndicator = styled(motion.div)` position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: #888; cursor: pointer; `;
const ScrollText = styled.span` font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; `;

// --- ORDER and NAME corrected in this array ---
const wingsData = [
    { name: 'Air', color: AIR_LIGHT_BLUE, units: '1 (TN) AIR SQN NCC' },
    { name: 'Army', color: ARMY_RED, units: '1 (TN) BTY NCC\n1 (TN) MED NCC' },
    { name: 'Navy', color: NAVY_DARK_BLUE, units: '1 (TN) NAVAL TECH NCC' }
];

const HeroSection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const titleVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } } };
  const contentVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5 } } };

  return (
    <HeroContainer>
      <HeroContent style={{ x: useTransform(springMouseX, [-50, 50], [-15, 15]), y: useTransform(springMouseY, [-50, 50], [-15, 15]), }}>
        <MainTitle variants={titleVariants} initial="hidden" animate="visible">
          <span style={{ color: ARMY_RED }}>SAI</span>
          <span style={{ color: AIR_LIGHT_BLUE }}>RAM</span>{' '}
          <span style={{ color: NAVY_DARK_BLUE }}>NCC</span>
        </MainTitle>
        <WingsInfoContainer variants={contentVariants} initial="hidden" animate="visible">
            {wingsData.map(wing => (
                <WingDetail key={wing.name}>
                    <WingName color={wing.color}>{wing.name}</WingName>
                    <UnitName color={wing.color}>{wing.units}</UnitName>
                </WingDetail>
            ))}
        </WingsInfoContainer>
        <SubTitle variants={contentVariants} initial="hidden" animate="visible">
          Sri Sai Ram Engineering College
        </SubTitle>
      </HeroContent>
      <ScrollIndicator onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
        <ScrollText>Scroll Down</ScrollText>
        <ChevronDown size={20} />
      </ScrollIndicator>
    </HeroContainer>
  );
};

export default HeroSection;