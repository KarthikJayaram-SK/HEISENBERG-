import React, { useEffect } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

import nccCrest from '../../assets/ncc-crest.png';
import armyInsignia from '../../assets/army-logo.png';
import navyInsignia from '../../assets/navy-logo.png';
import airforceInsignia from '../../assets/airforce-logo.png';
import sairamLogo from '../../assets/sairam-logo.png';

const HeroContainer = styled.div`
  min-height: 100vh;
  height: auto;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  @media (max-width: 768px) {
    align-items: flex-start;
    padding-top: 100px;
    padding-bottom: 3rem;
  }
`;
const HeroContent = styled(motion.div)`
  text-align: center;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 0.5rem;
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 2rem;
  }
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;
const NccLogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
`;
const NccCrest = styled.img`
  height: 120px;
  @media (max-width: 768px) {
    height: 100px;
  }
  @media (max-width: 480px) {
    height: 80px;
  }
`;
const NccTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const NccTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  letter-spacing: 1px;
  margin: 0;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;
const WingInsignias = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;
const InsigniaImage = styled.img`
  height: 40px;
  opacity: 0.7;
  @media (max-width: 768px) {
    height: 30px;
  }
  @media (max-width: 480px) {
    height: 25px;
  }
`;
const SairamLogo = styled.img`
  height: 130px;
  @media (max-width: 768px) {
    height: 110px;
  }
  @media (max-width: 480px) {
    height: 90px;
  }
`;
const MainTitle = styled(motion.h1)`
  font-size: clamp(3rem, 7vw, 7rem);
  font-weight: 900;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  line-height: 1.1;
  span {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
`;
const ARMY_RED = '#D22B2B';
const AIR_LIGHT_BLUE = '#87CEEB';
const NAVY_DARK_BLUE = '#000080';
const WingsInfoContainer = styled(motion.div)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 2rem;
  margin: 1rem 0;
  width: 100%;
  max-width: 1000px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    width: 90%;
  }
`;
const WingDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 0 1rem;
  flex: 1;
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 60%;
    background-color: #E0E0E0;
    @media (max-width: 768px) {
      display: none;
    }
  }
`;
const WingName = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${props => props.color};
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;
const UnitName = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  font-weight: 500;
  color: ${props => props.color};
  opacity: 0.8;
  white-space: pre-line;
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;
const SubTitle = styled(motion.h2)`
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 400;
  color: #555;
  letter-spacing: 0.1em;
  margin-top: 0.5rem;
`;
const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  cursor: pointer;
`;
const ScrollText = styled.span`
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const wingsData = [
    { name: 'Air', color: AIR_LIGHT_BLUE, units: '1 (TN) AIR SQN NCC' },
    { name: 'Army', color: ARMY_RED, units: '1 (TN) BTY NCC\n1 (TN) MED NCC' },
    { name: 'Navy', color: NAVY_DARK_BLUE, units: '4 (TN) NAVAL TECH NCC' }
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
  const sairamNccVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } } };

  return (
    <HeroContainer>
      <HeroContent style={{ x: useTransform(springMouseX, [-50, 50], [-15, 15]), y: useTransform(springMouseY, [-50, 50], [-15, 15]), }}>
        
        <LogoContainer variants={titleVariants} initial="hidden" animate="visible">
          <SairamLogo src={sairamLogo} alt="Sri Sairam Engineering College Logo" />
          <NccLogoGroup>
            <NccCrest src={nccCrest} alt="NCC Crest" />
            <NccTextGroup>
              <NccTitle>NATIONAL CADET CORPS</NccTitle>
              <WingInsignias>
                <InsigniaImage src={armyInsignia} alt="Army Insignia" />
                <InsigniaImage src={navyInsignia} alt="Navy Insignia" />
                <InsigniaImage src={airforceInsignia} alt="Air Force Insignia" />
              </WingInsignias>
            </NccTextGroup>
          </NccLogoGroup>
        </LogoContainer>

        <MainTitle variants={sairamNccVariants} initial="hidden" animate="visible">
          <span style={{ color: ARMY_RED }}>SAI</span>
          <span style={{ color: NAVY_DARK_BLUE }}>RAM</span>{' '}
          <span style={{ color: AIR_LIGHT_BLUE }}>NCC</span>
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