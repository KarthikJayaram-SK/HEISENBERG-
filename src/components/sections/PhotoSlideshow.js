import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

import image1 from '../../assets/1.jpg';
import image2 from '../../assets/2.jpg';
import image3 from '../../assets/3.jpg';
import image4 from '../../assets/4.jpg';
import image6 from '../../assets/6.jpg';
import image7 from '../../assets/7.jpg';
import image8 from '../../assets/8.jpg';

const SlideshowContainer = styled.section` padding: 6rem 2rem; `;
const SlideshowContent = styled.div` max-width: 1200px; margin: 0 auto; `;
const SectionTitle = styled(motion.h2)` font-size: 3rem; font-weight: 700; text-align: center; margin-bottom: 4rem; color: #1A2B4C; `;
const SlideContainer = styled.div` position: relative; width: 100%; height: 600px; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); `;
const Slide = styled(motion.div)` position: absolute; width: 100%; height: 100%; background: url(${props => props.$bgImage}) center/cover; `;
const Controls = styled.div` display: flex; justify-content: center; align-items: center; gap: 1.5rem; margin-top: 2rem; `;
const NavButton = styled(motion.button)` background: #FFFFFF; border: 1px solid rgba(0, 0, 0, 0.1); color: #1A2B4C; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); `;
const PlayButton = styled(NavButton)` width: 70px; height: 70px; background: #1A2B4C; color: #FFFFFF; `;
const ProgressBar = styled(motion.div)` position: absolute; bottom: 0; left: 0; height: 5px; background: #FFBF00; `;

const slides = [
  { id: 1, image: image1 }, { id: 2, image: image2 }, { id: 3, image: image3 },
  { id: 4, image: image4 },  { id: 6, image: image6 },
  { id: 7, image: image7 }, { id: 8, image: image8 },
];

const PhotoSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentSlide, nextSlide]);

  return (
    <SlideshowContainer>
      <SlideshowContent>
        <SectionTitle initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          Glimpses of Glory
        </SectionTitle>
        <SlideContainer>
          <AnimatePresence>
            <Slide key={currentSlide} $bgImage={slides[currentSlide].image} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
          </AnimatePresence>
          {isPlaying && <ProgressBar key={currentSlide} initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 5, ease: 'linear' }} />}
        </SlideContainer>
        <Controls>
          <NavButton onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <ChevronLeft size={24} />
          </NavButton>
          <PlayButton onClick={() => setIsPlaying(!isPlaying)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </PlayButton>
          <NavButton onClick={nextSlide} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <ChevronRight size={24} />
          </NavButton>
        </Controls>
      </SlideshowContent>
    </SlideshowContainer>
  );
};

export default PhotoSlideshow;