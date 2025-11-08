import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, getDocs, doc, getDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft } from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const PageContainer = styled.div` padding: 100px 2rem 4rem; max-width: 1400px; margin: 0 auto; `;
const Header = styled(motion.div)` text-align: center; margin-bottom: 2rem; `;
const Title = styled.h1` font-size: 3.5rem; font-weight: 800; color: #1A2B4C; `;
const BackButton = styled.button` background: #FFFFFF; border: 1px solid #ddd; color: #1A2B4C; padding: 0.75rem 1.5rem; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-family: inherit; font-size: 1rem; margin-bottom: 2rem; `;
const Grid = styled(motion.div)` display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; `;
const Card = styled(motion.button)` height: 200px; border-radius: 25px; cursor: pointer; background: #FFFFFF; color: #1A2B4C; border: 1px solid rgba(0, 0, 0, 0.1); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; transition: transform 0.2s, box-shadow 0.2s; &:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); } `;
const PhotoCard = styled(motion.div)` aspect-ratio: 1 / 1; border-radius: 15px; overflow: hidden; cursor: pointer; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; } &:hover img { transform: scale(1.05); } `;
const LoadingText = styled.p` text-align: center; font-size: 1.2rem; color: #555; padding: 3rem; `;
const NoItemsText = styled(LoadingText)` color: #888; `;

// ✨ --- NEW, UNIQUELY NAMED COMPONENT TO FORCE STYLE UPDATE --- ✨
const GalleryPhotoGrid = styled(motion.div)`
  display: grid;
  gap: 1rem;

  /* 5 columns on large screens */
  grid-template-columns: repeat(5, 1fr);

  /* 4 columns on smaller desktops */
  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  /* 3 columns on tablets */
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  /* 2 columns on mobile */
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
`;

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const GalleryPage = () => {
  const [view, setView] = useState('years');
  const [galleryYears, setGalleryYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const fetchYears = useCallback(async () => {
    setLoading(true);
    try {
      const configRef = doc(db, "config", "gallery");
      const configSnap = await getDoc(configRef);
      const years = configSnap.exists() ? configSnap.data().years.sort((a, b) => b - a) : [];
      setGalleryYears(years);
    } catch (error) {
      console.error("Error fetching years:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMonthsForYear = useCallback(async () => {
    if (!selectedYear) return;
    setLoading(true);
    try {
      const q = query(collection(db, "galleryImages"), where("year", "==", selectedYear));
      const querySnapshot = await getDocs(q);
      const monthsWithPhotos = new Set();
      querySnapshot.forEach(doc => {
        monthsWithPhotos.add(doc.data().month);
      });
      setAvailableMonths(Array.from(monthsWithPhotos).sort((a, b) => a - b));
      setView('months');
    } catch (error) {
      console.error("Error fetching months:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  const fetchPhotos = useCallback(async () => {
    if (!selectedYear || !selectedMonth) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "galleryImages"),
        where("year", "==", selectedYear),
        where("month", "==", selectedMonth),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedPhotos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPhotos(fetchedPhotos);
      setView('photos');
    } catch (error) {
      console.error("ERROR fetching photos:", error);
      alert("Could not fetch photos. Check the console for errors.");
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (view === 'years') fetchYears();
  }, [view, fetchYears]);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setView('months');
  };
  
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setView('photos');
  };

  const openLightbox = (index) => setLightboxIndex(index);

  useEffect(() => {
    if (view === 'months' && selectedYear) fetchMonthsForYear();
    if (view === 'photos' && selectedMonth) fetchPhotos();
  }, [view, selectedYear, selectedMonth, fetchMonthsForYear, fetchPhotos]);


  const renderContent = () => {
    if (loading) return <LoadingText>Loading...</LoadingText>;

    if (view === 'months') {
      return (
        <motion.div key="month-selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Header><Title>{selectedYear} Gallery</Title></Header>
          <BackButton onClick={() => { setView('years'); setSelectedYear(null); }}><ArrowLeft size={20}/> Back to Years</BackButton>
          {availableMonths.length > 0 ? (
            <Grid>
              {availableMonths.map(monthNum => (
                <Card key={monthNum} onClick={() => handleMonthSelect(monthNum)}>{monthNames[monthNum - 1]}</Card>
              ))}
            </Grid>
          ) : (
            <NoItemsText>No photos have been added for {selectedYear} yet.</NoItemsText>
          )}
        </motion.div>
      );
    }

    if (view === 'photos') {
      return (
        <motion.div key="photo-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Header><Title>{monthNames[selectedMonth - 1]} {selectedYear}</Title></Header>
          <BackButton onClick={() => { setView('months'); setSelectedMonth(null); }}><ArrowLeft size={20}/> Back to Months</BackButton>
          {photos.length > 0 ? (
            // ✨ Using the new, unique component here
            <GalleryPhotoGrid>
              {photos.map((photo, index) => (
                <PhotoCard key={photo.id} onClick={() => openLightbox(index)} layoutId={photo.id}>
                  <img src={photo.imageUrl} alt={photo.caption || `Gallery image`} />
                </PhotoCard>
              ))}
            </GalleryPhotoGrid>
          ) : (
            <NoItemsText>No photos found for this month.</NoItemsText>
          )}
        </motion.div>
      );
    }
    
    return (
        <motion.div key="year-selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Header><Title>Gallery</Title></Header>
            {galleryYears.length > 0 ? (
              <Grid>
                {galleryYears.map(year => (
                  <Card key={year} onClick={() => handleYearSelect(year)}>{year}</Card>
                ))}
              </Grid>
            ) : (
              <NoItemsText>The gallery is empty. Please add years and photos in the admin panel.</NoItemsText>
            )}
        </motion.div>
    );
  };

  return (
    <PageContainer>
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
      <Lightbox
        open={lightboxIndex > -1}
        close={() => setLightboxIndex(-1)}
        slides={photos.map(p => ({ src: p.imageUrl, title: p.caption }))}
        index={lightboxIndex}
      />
    </PageContainer>
  );
};

export default GalleryPage;