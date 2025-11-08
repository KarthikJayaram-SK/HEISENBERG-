import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const SlideshowContainer = styled.section`
  padding: 120px 0 4rem 0; /* ✨ Changed padding to fit at the top */
  background: #FFFFFF;     /* ✨ Changed background to white */
  overflow: hidden;
`;
const SlideshowContent = styled.div` max-width: 100%; margin: 0 auto; display: flex; flex-direction: column; align-items: center; position: relative; `;
const SectionTitle = styled(motion.h2)` font-size: 3rem; font-weight: 700; text-align: center; margin-bottom: 3rem; color: #1A2B4C; padding: 0 1rem; @media (max-width: 768px) { font-size: 2.2rem; margin-bottom: 2rem; } `;
const CarouselWrapper = styled.div` position: relative; width: 100%; height: 600px; display: flex; justify-content: center; align-items: center; perspective: 1500px; @media (max-width: 1024px) { height: 500px; } @media (max-width: 768px) { height: 400px; perspective: 800px; } @media (max-width: 480px) { height: 300px; } `;
const SlideCard = styled(motion.div)` position: absolute; width: 70%; max-width: 900px; height: 100%; border-radius: 20px; background-size: cover; background-position: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); background-image: url(${props => props.$bgImage}); transform-style: preserve-3d; `;
const NavArrow = styled(motion.button)` position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255, 255, 255, 0.7); border: none; border-radius: 50%; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center; cursor: pointer; z-index: 10; backdrop-filter: blur(5px); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); color: #1A2B4C; &.prev { left: calc(50% - 450px - 70px); } &.next { right: calc(50% - 450px - 70px); } @media (max-width: 1200px) { &.prev { left: 2rem; } &.next { right: 2rem; } } @media (max-width: 768px) { width: 45px; height: 45px; &.prev { left: 1rem; } &.next { right: 1rem; } } `;
const DotsContainer = styled.div` display: flex; justify-content: center; gap: 15px; margin-top: 3rem; @media (max-width: 768px) { margin-top: 2rem; } `;
const Dot = styled(motion.button)` width: 12px; height: 12px; border-radius: 50%; border: none; cursor: pointer; background: ${props => (props.$active ? '#1A2B4C' : '#c7d0e1')}; transition: background 0.3s ease; `;

const NavySlideshow = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        // ✨ This line fetches from the Navy collection
        const q = query(collection(db, "navySlideshowImages"), orderBy("order", "asc"), limit(20));
        const querySnapshot = await getDocs(q);
        const fetchedSlides = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSlides(fetchedSlides);
      } catch (error) {
        console.error("Error fetching Navy slideshow images:", error);
      }
    };
    fetchSlides();
  }, []);

  const nextSlide = useCallback(() => { if (slides.length > 0) setCurrentSlide(prev => (prev + 1) % slides.length); }, [slides.length]);
  const prevSlide = () => { if (slides.length > 0) setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length); };
  const goToSlide = (index) => setCurrentSlide(index);
  useEffect(() => { if (slides.length <= 1) return; const timer = setTimeout(nextSlide, 5000); return () => clearTimeout(timer); }, [currentSlide, slides.length, nextSlide]);
  if (slides.length === 0) return null;

  return (
    <SlideshowContainer>
      <SlideshowContent>
        <SectionTitle>Navy Wing Gallery</SectionTitle>
        <CarouselWrapper>
          <AnimatePresence>
            {slides.map((slide, index) => {
              const offset = index - currentSlide;
              let adjustedOffset = offset;
              if (offset > slides.length / 2) adjustedOffset = offset - slides.length;
              else if (offset < -slides.length / 2) adjustedOffset = offset + slides.length;
              const isCurrent = adjustedOffset === 0;
              const scale = isCurrent ? 1 : 0.7;
              const rotateY = adjustedOffset * -30;
              const translateX = adjustedOffset * 25;
              const opacity = isCurrent ? 1 : 0.4;
              const zIndex = slides.length - Math.abs(adjustedOffset);
              if (Math.abs(adjustedOffset) > 2) return null;
              return (
                <SlideCard
                  key={slide.id}
                  $bgImage={slide.imageUrl}
                  initial={false}
                  animate={{
                    transform: `translateX(${translateX}%) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
              );
            })}
          </AnimatePresence>
        </CarouselWrapper>
        {slides.length > 1 && (
            <>
                <NavArrow className="prev" onClick={prevSlide} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><ChevronLeft size={32} /></NavArrow>
                <NavArrow className="next" onClick={nextSlide} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><ChevronRight size={32} /></NavArrow>
            </>
        )}
        <DotsContainer>
          {slides.map((_, index) => (
            <Dot
              key={index}
              $active={index === currentSlide}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          ))}
        </DotsContainer>
      </SlideshowContent>
    </SlideshowContainer>
  );
};
export default NavySlideshow;