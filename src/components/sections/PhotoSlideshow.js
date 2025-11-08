import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, startOfWeek, startOfMonth, isValid } from "date-fns";

// ---------- Styled Components ----------
const SlideshowContainer = styled.section`
  padding: 6rem 0;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: #f0f2f5;
  overflow: hidden;
`;

const SlideshowContent = styled.div`
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4rem;
  color: #1a2b4c;
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 2000px;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const SlideCard = styled(motion.div)`
  position: absolute;
  width: 60%;
  max-width: 900px;
  height: 100%;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background-image: url(${(props) => props.$bgImage});
  transform-style: preserve-3d;
`;

const NavArrow = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 20;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: #1a2b4c;

  &.prev {
    left: 2rem;
  }
  &.next {
    right: 2rem;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 3rem;
`;

const Dot = styled(motion.button)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: ${(props) => (props.$active ? "#1A2B4C" : "#c7d0e1")};
`;

const ViewCountText = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #1A2B4C;
  font-weight: 500;
`;

const GraphContainer = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  max-width: 1200px;
  width: 90%;
  margin: 3rem auto 0;
`;

const ToggleButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const ToggleButton = styled(motion.button)`
  background: ${(props) => (props.$active ? "#1A2B4C" : "#c7d0e1")};
  color: ${(props) => (props.$active ? "#fff" : "#1A2B4C")};
  border: none;
  border-radius: 20px;
  padding: 10px 25px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
`;

// ---------- Component ----------
const PhotoSlideshow = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewMode, setViewMode] = useState("daily");
  const [viewData, setViewData] = useState([]);

  const adminUID = "ECxt1VpvDmMtcYPD1IvFsnGg57u2";
  const isAdmin = currentUser?.uid === adminUID;

  // Track Firebase Auth user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  // Fetch slides (dummy fallback)
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const q = query(collection(db, "slideshowImages"), orderBy("order", "asc"), limit(20));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setSlides([
            { id: 1, imageUrl: "https://picsum.photos/800/400?random=1" },
            { id: 2, imageUrl: "https://picsum.photos/800/400?random=2" },
            { id: 3, imageUrl: "https://picsum.photos/800/400?random=3" },
          ]);
        } else {
          setSlides(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      } catch {
        setSlides([
          { id: 1, imageUrl: "https://picsum.photos/800/400?random=1" },
          { id: 2, imageUrl: "https://picsum.photos/800/400?random=2" },
          { id: 3, imageUrl: "https://picsum.photos/800/400?random=3" },
        ]);
      }
    };
    fetchSlides();
  }, []);

  // Fetch view data (dummy fallback)
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const q = query(collection(db, "slideshowDailyViews"), orderBy("date", "asc"));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setViewData([
            { date: "2025-11-01", views: 5 },
            { date: "2025-11-02", views: 9 },
            { date: "2025-11-03", views: 14 },
            { date: "2025-11-04", views: 19 },
            { date: "2025-11-05", views: 25 },
            { date: "2025-11-06", views: 31 },
            { date: "2025-11-07", views: 38 },
          ]);
        } else {
          const fetchedData = snapshot.docs
            .map((doc) => ({
              date: doc.id,
              views: Number(doc.data().views) || 0,
            }))
            .filter((d) => isValid(parseISO(d.date)));
          setViewData(fetchedData);
        }
      } catch {
        setViewData([
          { date: "2025-11-01", views: 5 },
          { date: "2025-11-02", views: 9 },
          { date: "2025-11-03", views: 14 },
          { date: "2025-11-04", views: 19 },
          { date: "2025-11-05", views: 25 },
          { date: "2025-11-06", views: 31 },
          { date: "2025-11-07", views: 38 },
        ]);
      }
    };
    fetchGraphData();
  }, []);

  const groupData = (mode) => {
    const grouped = {};
    viewData.forEach((d) => {
      let key;
      const parsedDate = parseISO(d.date);
      if (!isValid(parsedDate)) return;
      if (mode === "weekly") key = format(startOfWeek(parsedDate), "yyyy-MM-dd");
      else if (mode === "monthly") key = format(startOfMonth(parsedDate), "yyyy-MM");
      else key = format(parsedDate, "yyyy-MM-dd");
      grouped[key] = (grouped[key] || 0) + d.views;
    });
    return Object.keys(grouped).map((key) => ({ date: key, views: grouped[key] }));
  };

  const chartData = groupData(viewMode);
  const viewCount = chartData.length ? chartData[chartData.length - 1].views : 0;

  const nextSlide = () => slides.length && setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => slides.length && setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (!slides.length) return null;

  return (
    <SlideshowContainer>
      <SlideshowContent>
        <SectionTitle
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Glimpses of Glory
        </SectionTitle>

        <CarouselWrapper>
          <AnimatePresence>
            {slides.map((slide, index) => {
              const offset = index - currentSlide;
              let adjustedOffset = offset;
              if (offset > slides.length / 2) adjustedOffset = offset - slides.length;
              else if (offset < -slides.length / 2) adjustedOffset = offset + slides.length;
              if (Math.abs(adjustedOffset) > 2) return null;

              const isCurrent = adjustedOffset === 0;
              return (
                <SlideCard
                  key={slide.id}
                  $bgImage={slide.imageUrl}
                  animate={{
                    x: `${adjustedOffset * 35}%`,
                    rotateY: adjustedOffset * -25,
                    scale: isCurrent ? 1 : 0.7,
                    opacity: isCurrent ? 1 : 0.3,
                    zIndex: slides.length - Math.abs(adjustedOffset),
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
              );
            })}
          </AnimatePresence>

          {slides.length > 1 && (
            <>
              <NavArrow className="prev" onClick={prevSlide} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ChevronLeft size={32} />
              </NavArrow>
              <NavArrow className="next" onClick={nextSlide} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ChevronRight size={32} />
              </NavArrow>
            </>
          )}
        </CarouselWrapper>

        <DotsContainer>
          {slides.map((_, index) => (
            <Dot
              key={index}
              $active={index === currentSlide}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </DotsContainer>

        {isAdmin && (
          <>
            <ViewCountText>Viewed by {viewCount} members</ViewCountText>

            <GraphContainer>
              <motion.h3
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: "center", color: "#1A2B4C", marginBottom: "1rem" }}
              >
                View Analytics
              </motion.h3>

              <ToggleButtons>
                {["daily", "weekly", "monthly"].map((mode) => (
                  <ToggleButton
                    key={mode}
                    $active={viewMode === mode}
                    onClick={() => setViewMode(mode)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </ToggleButton>
                ))}
              </ToggleButtons>

              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#1A2B4C" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </GraphContainer>
          </>
        )}
      </SlideshowContent>
    </SlideshowContainer>
  );
};

export default PhotoSlideshow;
