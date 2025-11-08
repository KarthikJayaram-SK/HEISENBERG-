// src/pages/WingPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Users, Target, Trophy, Calendar, ChevronLeft, Edit, Plus, Trash2, ChevronRight } from 'lucide-react';
import { armyRankOrder, navyRankOrder, airForceRankOrder } from '../rankStructure';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, writeBatch, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import CadetDetailModal from '../components/ui/CadetDetailModal';
import AdminCadetEditor from '../components/admin/AdminCadetEditor';
import AddCadetModal from '../components/admin/AddCadetModal';
import AddBatchModal from '../components/admin/AddBatchModal';

// --- STYLES (Unchanged) ---
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  padding-top: 72px;
  background-color: #F0F2F5;
`;
const BackButton = styled(motion.button)`
  position: fixed;
  top: 100px;
  left: 2rem;
  z-index: 1001;
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #1A2B4C;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;
const HeroSection = styled.div`
  height: 88vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rem;
  overflow: hidden;
  background: #1A2B4C;
`;
const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(10, 21, 41, 0.7) 0%, transparent 60%);
  z-index: 2;
  pointer-events: none;
`;
const HeroContent = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  position: relative;
  z-index: 3;
  pointer-events: none;
`;
const WingTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: #FFFFFF;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;
const WingMotto = styled(motion.p)`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
`;
const CarouselWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;
const SlideContainer = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
`;
const BlurredBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$bgImage});
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.8);
  transform: scale(1.1);
`;
const MainImage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$bgImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
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
  z-index: 4;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: #1A2B4C;
  &.prev { left: 2rem; }
  &.next { right: 2rem; }
`;
const DotsContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 4;
`;
const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid white;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.5);
  transition: background 0.3s ease;
  &.active {
    background: #FFFFFF;
  }
`;
const ContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
`;
const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;
const InfoCard = styled(motion.div)`
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;
const CardIcon = styled.div`
  width: 50px;
  height: 50px;
  background: #F0F2F5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1A2B4C;
  margin-bottom: 1rem;
`;
const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1A2B4C;
  margin-bottom: 1rem;
`;
const CardDescription = styled.p`
  color: #555;
  line-height: 1.6;
`;
const SelectionGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;
const SelectionCardContainer = styled(motion.div)`
  position: relative;
`;
const SelectionCard = styled.button`
  height: 150px;
  width: 100%;
  border-radius: 25px;
  cursor: pointer;
  background: #FFFFFF;
  color: #1A2B4C;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  font-size: 1.8rem;
  font-weight: 700;
`;
const AddBatchCard = styled(SelectionCard)`
  border-style: dashed;
  color: #6c757d;
`;
const DeleteBatchButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #fbebeb;
  color: #c53030;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  &:hover {
    background: #c53030;
    color: white;
  }
`;
const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;
const BackToBatchButton = styled(motion.button)`
  background: #FFFFFF;
  border: 1px solid #ddd;
  color: #1A2B4C;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
`;
const AddNewCadetButton = styled(BackToBatchButton)`
  border-color: #1A2B4C;
  color: #1A2B4C;
  &:hover {
    background: #1A2B4C;
    color: white;
  }
`;
const RankSection = styled.div`
  margin-bottom: 3rem;
`;
const RankTitle = styled.h3`
  font-size: 1.5rem;
  color: #1A2B4C;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
  letter-spacing: 1px;
`;
const CadetGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`;
const CadetCard = styled(motion.div)`
  text-align: center;
  width: 200px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  overflow: hidden;
  position: relative;
`;
const CadetPhotoContainer = styled.div`
  height: 200px;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  cursor: pointer;
`;
const CadetPhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const CadetName = styled.p`
  font-weight: 700;
  font-size: 1.1rem;
  padding: 0.75rem 0.5rem 0.25rem;
  margin: 0;
  color: #1A2B4C;
  cursor: pointer;
`;
const NoCadetsMessage = styled.p`
  color: #6c757d;
  font-style: italic;
  text-align: center;
  padding: 2rem;
`;
const LoadingText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  padding: 3rem;
`;
const AdminEditButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(26, 43, 76, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(5px);
  z-index: 10;
  transition: background 0.2s;
  &:hover {
    background: #FFBF00;
    color: #1A2B4C;
  }
`;
// ✨ Updated CadetInfo style
const CadetInfo = styled.p`
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
  padding: 0 0.5rem 0.25rem; /* Reduced bottom padding slightly */
  line-height: 1.4;
  white-space: nowrap; /* Prevent wrapping */
  overflow: hidden; /* Hide overflow */
  text-overflow: ellipsis; /* Add ellipsis (...) for overflow */
`;
// ---

// BatchDetails Component
const BatchDetails = ({ wing, cadetsByRank, loading, onCadetClick, onAdminEdit }) => {
  const { user } = useAuth();
  const getRankOrder = () => {
    switch (wing) {
      case 'army': return armyRankOrder;
      case 'navy': return navyRankOrder;
      case 'airforce': return airForceRankOrder;
      default: return [];
    }
  };
  const rankOrder = getRankOrder();

  if (loading) return <LoadingText>Loading batch details...</LoadingText>;
  if (Object.keys(cadetsByRank).length === 0 && !loading) return <NoCadetsMessage>No cadets found for this batch.</NoCadetsMessage>;

  return (
    <div>
      {rankOrder.map(rank => (
        (cadetsByRank[rank] && cadetsByRank[rank].length > 0) && (
          <RankSection key={rank}>
            <RankTitle>{rank}</RankTitle>
            <CadetGrid>
              {cadetsByRank[rank].map((cadet) => (
                <CadetCard key={cadet.id} whileHover={{ y: -5 }}>
                  {user && <AdminEditButton onClick={() => onAdminEdit(cadet)}><Edit size={16} /></AdminEditButton>}
                  <CadetPhotoContainer onClick={() => onCadetClick(cadet)}>
                    {cadet.photoURL ? <CadetPhoto src={cadet.photoURL} alt={cadet.Name} /> : <Users size={48} />}
                  </CadetPhotoContainer>
                  {/* Wrap info in a clickable div with padding */}
                  <div onClick={() => onCadetClick(cadet)} style={{ paddingBottom: '0.75rem', cursor: 'pointer' }}>
                    <CadetName>{cadet.Name}</CadetName>
                    <CadetInfo>{cadet.secID}</CadetInfo>

                    {/* ✨ ADD REGIMENTAL NUMBER HERE */}
                    {cadet.regimentalNo && <CadetInfo>{cadet.regimentalNo}</CadetInfo>}

                    <CadetInfo>{`${cadet.dept}, Sec ${cadet.section}`}</CadetInfo>
                  </div>
                </CadetCard>
              ))}
            </CadetGrid>
          </RankSection>
        )
      ))}
    </div>
  );
};

// --- wingData (Unchanged) ---
const wingData = {
  army: {
    title: 'Army', motto: 'Service Before Self',
    info: [ { icon: Users, title: 'Leadership Development', description: 'Comprehensive training in military leadership, decision-making, and team management skills.' }, { icon: Target, title: 'Combat Training', description: 'Weapons handling, tactical training, and field exercises to build combat readiness.' }, { icon: Trophy, title: 'Physical Fitness', description: 'Rigorous physical training programs to maintain peak physical condition and endurance.' } ],
  },
  navy: {
    title: 'Navy', motto: 'Victory on Sea',
    info: [ { icon: Users, title: 'Naval Operations', description: 'Training in ship handling, navigation, and maritime operations for future naval officers.' }, { icon: Trophy, title: 'Seamanship', description: 'Comprehensive knowledge of naval traditions, marine engineering, and oceanography.' }, { icon: Calendar, title: 'Sea Training', description: 'Practical experience aboard naval vessels and coastal training facilities.' } ],
  },
  airforce: {
    title: 'Air', motto: 'Touch the Sky With Glory',
    info: [ { icon: Users, title: 'Aviation Training', description: 'Introduction to aircraft systems, flight principles, and aerospace technology.' }, { icon: Target, title: 'Air Power Studies', description: 'Understanding of air warfare tactics, strategic operations, and military aviation.' }, { icon: Trophy, title: 'Technical Skills', description: 'Advanced training in electronics, radar systems, and aircraft maintenance.' } ],
  }
};

// WingPage Component
const WingPage = () => {
  const { wingType } = useParams();
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddCadetModalOpen, setIsAddCadetModalOpen] = useState(false);
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [selectedCadet, setSelectedCadet] = useState(null);
  const [cadetsByRank, setCadetsByRank] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger re-fetches
  const { user } = useAuth(); // Get auth state

  // Determine the correct string for Firestore queries ('air' vs 'airforce')
  const wingCategoryForQuery = wingType === 'airforce' ? 'air' : wingType;

  // Fetch slideshow images based on wing
  useEffect(() => {
    const fetchSlides = async () => {
      if (!wingCategoryForQuery) return;
      try {
        const q = query(
          collection(db, `${wingCategoryForQuery}SlideshowImages`),
          orderBy("order", "asc"),
          limit(20) // Limit to 20 slides for performance
        );
        const querySnapshot = await getDocs(q);
        const fetchedSlides = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSlides(fetchedSlides);
      } catch (error) {
        console.error("Error fetching slideshow images:", error);
      }
    };
    fetchSlides();
  }, [wingCategoryForQuery]); // Re-fetch if wing changes

  // Slideshow next/prev logic
  const nextSlide = useCallback(() => {
    if (slides.length > 0) setCurrentSlide(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    if (slides.length > 0) setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-advance slideshow
  useEffect(() => {
    if (slides.length <= 1) return; // Don't auto-advance if only 0 or 1 slide
    const slideshowTimer = setTimeout(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearTimeout(slideshowTimer); // Clear timer on unmount or slide change
  }, [currentSlide, slides.length, nextSlide]);

  // Function to trigger data refresh
  const handleDataChange = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Fetch available batches for the current wing
  const fetchBatches = useCallback(async () => {
    if (!wingType) return;
    try {
      const docRef = doc(db, "config", "batches");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const batchData = docSnap.data();
        // Sort batches numerically based on the leading number (e.g., "1. 2022-2025")
        const sortedBatches = (batchData[wingType] || []).sort((a, b) => {
          const numA = parseInt(a.split('.')[0], 10);
          const numB = parseInt(b.split('.')[0], 10);
          return numA - numB;
        });
        setBatches(sortedBatches);
      } else {
        setBatches([]); // No batches found
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  }, [wingType]); // Re-fetch if wing changes

  // Fetch cadets for the selected batch and wing
  const fetchCadets = useCallback(async () => {
    // Extract only the batch year range (e.g., "2022-2025") for the query
    const cleanBatchName = selectedBatch.includes('.') ? selectedBatch.substring(selectedBatch.indexOf(' ') + 1) : selectedBatch;
    if (!wingType || !cleanBatchName) return;

    setLoading(true);
    // Format wing name consistently for Firestore query ('Air' vs 'Airforce')
    let formattedWing = wingType.charAt(0).toUpperCase() + wingType.slice(1);
    if (formattedWing === 'Airforce') {
      formattedWing = 'Air'; // Use 'Air' as stored in Firestore
    }

    const q = query(collection(db, "cadets"), where("Wing", "==", formattedWing), where("Batch", "==", cleanBatchName));

    try {
      const querySnapshot = await getDocs(q);
      const fetchedCadets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Group cadets by rank
      const grouped = fetchedCadets.reduce((acc, cadet) => {
        const rank = cadet.rank || "Unranked"; // Handle cases with no rank
        if (!acc[rank]) acc[rank] = [];
        acc[rank].push(cadet);
        return acc;
      }, {});
      setCadetsByRank(grouped);
    } catch (error) {
      console.error("Error fetching cadets:", error);
    } finally {
      setLoading(false);
    }
  }, [wingType, selectedBatch]); // Dependencies for fetching cadets

  // Fetch batches on initial load and when wingType or refreshKey changes
  useEffect(() => {
    fetchBatches();
  }, [wingType, refreshKey, fetchBatches]);

  // Fetch cadets when selectedBatch changes or refreshKey changes
  useEffect(() => {
    if (selectedBatch) {
      fetchCadets();
    } else {
      setCadetsByRank({}); // Clear cadets when no batch is selected
    }
  }, [selectedBatch, fetchCadets, refreshKey]);

  // Reset selectedBatch and scroll to top when wingType changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedBatch(null);
  }, [wingType]);

  // Function to handle deleting a batch (requires admin)
  const handleDeleteBatch = async (batchToDelete) => {
    // Extract clean batch name for cadet query
    const cleanBatchNameToDelete = batchToDelete.includes('.') ? batchToDelete.substring(batchToDelete.indexOf(' ') + 1) : batchToDelete;
    if (!window.confirm(`Are you sure you want to delete the "${cleanBatchNameToDelete}" batch and ALL its cadets? This cannot be undone.`)) return;

    try {
      setLoading(true);
      let formattedWing = wingType.charAt(0).toUpperCase() + wingType.slice(1);
      if (formattedWing === 'Airforce') formattedWing = 'Air';

      // Query for cadets in the batch to delete
      const q = query(collection(db, "cadets"), where("Wing", "==", formattedWing), where("Batch", "==", cleanBatchNameToDelete));
      const querySnapshot = await getDocs(q);

      // Delete all cadets in the batch using Firestore Batch
      const firestoreBatch = writeBatch(db);
      querySnapshot.forEach(doc => firestoreBatch.delete(doc.ref));
      await firestoreBatch.commit();

      // Remove the batch name from the config document
      const batchDocRef = doc(db, 'config', 'batches');
      await updateDoc(batchDocRef, {
        [wingType]: arrayRemove(batchToDelete) // Use the full batch name (e.g., "1. 2022-2025")
      });
      handleDataChange(); // Trigger re-fetch of batches
    } catch (error) {
      console.error("Error deleting batch:", error);
      alert("Failed to delete batch.");
    } finally {
      setLoading(false);
    }
  };

  // Open cadet detail modal
  const handleCadetClick = (cadet) => {
    setSelectedCadet(cadet);
    setIsDetailModalOpen(true);
  };

  // Open cadet edit modal (for admin)
  const handleAdminEditClick = (cadet) => {
    setSelectedCadet(cadet);
    setIsEditModalOpen(true);
  };

  // Handle case where wingType is invalid
  if (!wingType || !wingData[wingType]) {
     // You might want to navigate back or show a 404 page here
     console.error("Invalid wing type:", wingType);
     return <PageContainer><div>Invalid Wing Type</div></PageContainer>; // Simple fallback
  }
  const wing = wingData[wingType]; // Get data for the current wing

  // --- JSX Rendering ---
  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><ArrowLeft size={24} /></BackButton>

      {/* Hero Section */}
      <HeroSection>
        {/* Slideshow */}
        <CarouselWrapper>
          <AnimatePresence>
            {slides.length > 0 && (
              <SlideContainer
                key={currentSlide} // Key change triggers animation
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              >
                <BlurredBackground $bgImage={slides[currentSlide].imageUrl} />
                <MainImage $bgImage={slides[currentSlide].imageUrl} />
              </SlideContainer>
            )}
          </AnimatePresence>
        </CarouselWrapper>
        {/* Slideshow Navigation */}
        {slides.length > 1 && (
          <>
            <NavArrow className="prev" onClick={prevSlide} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><ChevronLeft size={24} /></NavArrow>
            <NavArrow className="next" onClick={nextSlide} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><ChevronRight size={24} /></NavArrow>
            <DotsContainer>
              {slides.map((_, index) => (
                <Dot key={index} className={index === currentSlide ? 'active' : ''} onClick={() => setCurrentSlide(index)} />
              ))}
            </DotsContainer>
          </>
        )}
        <HeroOverlay />
        <HeroContent initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <WingTitle>{wing.title}</WingTitle>
          <WingMotto>"{wing.motto}"</WingMotto>
        </HeroContent>
      </HeroSection>

      {/* Main Content Area */}
      <ContentSection>
        {/* Wing Info Cards */}
        <SectionGrid>
          {wing.info.map((info, index) => (
            <InfoCard key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <CardIcon><info.icon size={28} /></CardIcon>
              <CardTitle>{info.title}</CardTitle>
              <CardDescription>{info.description}</CardDescription>
            </InfoCard>
          ))}
        </SectionGrid>

        {/* Conditional Rendering: Batch Selection or Batch Details */}
        <AnimatePresence mode="wait">
          {!selectedBatch ? (
            // Batch Selection View
            <motion.div key="batch-selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SelectionGrid>
                {batches.map((batchName) => (
                  <SelectionCardContainer key={batchName} whileHover={{ scale: 1.03 }}>
                    {user && <DeleteBatchButton onClick={(e) => {e.stopPropagation(); handleDeleteBatch(batchName);}}><Trash2 size={16} /></DeleteBatchButton>}
                    <SelectionCard onClick={() => setSelectedBatch(batchName)}>
                      {batchName.includes('.') ? batchName.substring(batchName.indexOf(' ') + 1) : batchName}
                    </SelectionCard>
                  </SelectionCardContainer>
                ))}
                {user && ( // Show Add Batch button only if admin
                  <SelectionCardContainer whileHover={{ scale: 1.03 }}>
                    <AddBatchCard onClick={() => setIsAddBatchModalOpen(true)}>
                      <Plus size={32} /> Add Batch
                    </AddBatchCard>
                  </SelectionCardContainer>
                )}
              </SelectionGrid>
            </motion.div>
          ) : (
            // Batch Details View
            <motion.div key="details-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DetailsHeader>
                <BackToBatchButton onClick={() => setSelectedBatch(null)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ChevronLeft size={20} /> Back to Batch Selection
                </BackToBatchButton>
                {user && ( // Show Add Cadet button only if admin
                  <AddNewCadetButton onClick={() => setIsAddCadetModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Plus size={20} /> Add New Cadet
                  </AddNewCadetButton>
                )}
              </DetailsHeader>
              {/* Render the BatchDetails component */}
              <BatchDetails
                wing={wingType}
                cadetsByRank={cadetsByRank}
                loading={loading}
                onCadetClick={handleCadetClick}
                onAdminEdit={handleAdminEditClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ContentSection>

      {/* Modals */}
      <CadetDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} cadet={selectedCadet} />
      {user && ( // Render admin modals only if admin is logged in
        <>
          <AdminCadetEditor
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            cadet={selectedCadet}
            onComplete={handleDataChange} // Refresh data on complete
          />
          <AddCadetModal
            isOpen={isAddCadetModalOpen}
            onClose={() => setIsAddCadetModalOpen(false)}
            wing={wingType}
            batch={selectedBatch ? (selectedBatch.includes('.') ? selectedBatch.substring(selectedBatch.indexOf(' ') + 1) : selectedBatch) : ''}
            onComplete={handleDataChange} // Refresh data on complete
          />
          <AddBatchModal
            isOpen={isAddBatchModalOpen}
            onClose={() => setIsAddBatchModalOpen(false)}
            wing={wingType}
            onComplete={handleDataChange} // Refresh data on complete
          />
        </>
      )}
    </PageContainer>
  );
};
export default WingPage;