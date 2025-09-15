import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Users, Target, Trophy, Calendar, ChevronLeft, Edit, Plus, Trash2 } from 'lucide-react';
import { armyRankOrder, navyRankOrder, airForceRankOrder } from '../rankStructure';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import CadetDetailModal from '../components/ui/CadetDetailModal';
import AdminCadetEditor from '../components/admin/AdminCadetEditor';
import AddCadetModal from '../components/admin/AddCadetModal';
import AddBatchModal from '../components/admin/AddBatchModal';

// --- (Styled Components are unchanged) ---
const PageContainer = styled(motion.div)` min-height: 100vh; padding-top: 72px; background-color: #F0F2F5; `;
const BackButton = styled(motion.button)` position: fixed; top: 100px; left: 2rem; z-index: 100; background: #FFFFFF; border: 1px solid rgba(0, 0, 0, 0.1); color: #1A2B4C; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); `;
const HeroSection = styled.div` height: 50vh; background: url(${props => props.$bgImage}) center/cover; position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 4rem; `;
const HeroOverlay = styled.div` position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, rgba(10, 21, 41, 0.8) 0%, transparent 100%); `;
const HeroContent = styled(motion.div)` text-align: center; padding: 2rem; position: absolute; bottom: 2rem; `;
const WingTitle = styled(motion.h1)` font-size: 4rem; font-weight: 900; margin-bottom: 0.5rem; color: #FFFFFF; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); `;
const WingMotto = styled(motion.p)` font-size: 1.5rem; color: rgba(255, 255, 255, 0.9); font-style: italic; text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5); `;
const ContentSection = styled.section` max-width: 1200px; margin: 0 auto; padding: 0 2rem 4rem; `;
const SectionGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 4rem; `;
const InfoCard = styled(motion.div)` background: #FFFFFF; border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 20px; padding: 2rem; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); `;
const CardIcon = styled.div` width: 50px; height: 50px; background: #F0F2F5; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1A2B4C; margin-bottom: 1rem; `;
const CardTitle = styled.h3` font-size: 1.5rem; font-weight: 600; color: #1A2B4C; margin-bottom: 1rem; `;
const CardDescription = styled.p` color: #555; line-height: 1.6; `;
const SelectionGrid = styled(motion.div)` display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 4rem; `;
const SelectionCardContainer = styled(motion.div)` position: relative; `;
const SelectionCard = styled.button` height: 150px; width: 100%; border-radius: 25px; cursor: pointer; background: #FFFFFF; color: #1A2B4C; border: 1px solid rgba(0, 0, 0, 0.1); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem; font-size: 1.8rem; font-weight: 700; `;
const AddBatchCard = styled(SelectionCard)` border-style: dashed; color: #6c757d; `;
const DeleteBatchButton = styled.button` position: absolute; top: 1rem; right: 1rem; background: #fbebeb; color: #c53030; border: none; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; &:hover { background: #c53030; color: white; } `;
const DetailsHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; `;
const BackToBatchButton = styled(motion.button)` background: #FFFFFF; border: 1px solid #ddd; color: #1A2B4C; padding: 0.75rem 1.5rem; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; `;
const AddNewCadetButton = styled(BackToBatchButton)` border-color: #1A2B4C; color: #1A2B4C; &:hover { background: #1A2B4C; color: white; }`;
const RankSection = styled.div` margin-bottom: 3rem; `;
const RankTitle = styled.h3` font-size: 1.5rem; color: #1A2B4C; text-align: center; margin-bottom: 2rem; font-weight: 600; letter-spacing: 1px; `;
const CadetGrid = styled.div` display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; `;
const CadetCard = styled(motion.div)` text-align: center; width: 200px; background: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; position: relative; `;
const CadetPhotoContainer = styled.div` height: 200px; background-color: #e9ecef; display: flex; align-items: center; justify-content: center; color: #adb5bd; cursor: pointer; `;
const CadetPhoto = styled.img` width: 100%; height: 100%; object-fit: cover; `;
const CadetName = styled.p` font-weight: 700; font-size: 1.1rem; padding: 0.75rem 0.5rem 0.25rem; margin: 0; color: #1A2B4C; cursor: pointer; `;
const NoCadetsMessage = styled.p` color: #6c757d; font-style: italic; text-align: center; padding: 2rem; `;
const LoadingText = styled.p` text-align: center; font-size: 1.2rem; color: #555; padding: 3rem; `;
const AdminEditButton = styled.button` position: absolute; top: 8px; right: 8px; background: rgba(26, 43, 76, 0.8); color: white; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(5px); z-index: 10; transition: background 0.2s; &:hover { background: #FFBF00; color: #1A2B4C; } `;
const CadetInfo = styled.p` font-size: 0.85rem; color: #6c757d; margin: 0; padding: 0 0.5rem 0.75rem; line-height: 1.4; `;

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
                  <div onClick={() => onCadetClick(cadet)}>
                    <CadetName>{cadet.Name}</CadetName>
                    <CadetInfo>{cadet.secID}</CadetInfo>
                    <CadetInfo>{`${cadet.dept}, Section ${cadet.section}`}</CadetInfo>
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

const wingData = {
  army: {
    title: 'Army', motto: 'Service Before Self', image: 'https://img.etimg.com/thumb/width-1600,height-900,imgsize-305892,resizemode-75,msid-107807698/news/defence/army-plans-rs-57000-crore-project-to-replace-t-72-tanks-with-modern-combat-vehicles.jpg',
    info: [ { icon: Users, title: 'Leadership Development', description: 'Comprehensive training in military leadership, decision-making, and team management skills.' }, { icon: Target, title: 'Combat Training', description: 'Weapons handling, tactical training, and field exercises to build combat readiness.' }, { icon: Trophy, title: 'Physical Fitness', description: 'Rigorous physical training programs to maintain peak physical condition and endurance.' } ],
  },
  navy: {
    title: 'Navy', motto: 'Victory on Sea', image: 'https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/02/Screenshot-2024-02-08-at-42905-PM.png',
    info: [ { icon: Users, title: 'Naval Operations', description: 'Training in ship handling, navigation, and maritime operations for future naval officers.' }, { icon: Trophy, title: 'Seamanship', description: 'Comprehensive knowledge of naval traditions, marine engineering, and oceanography.' }, { icon: Calendar, title: 'Sea Training', description: 'Practical experience aboard naval vessels and coastal training facilities.' } ],
  },
  airforce: {
    title: 'Air', motto: 'Touch the Sky With Glory', image: 'https://th.bing.com/th/id/OIP.fkJWC2RbMq5Pm5qAbfkepAHaEI?w=334&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    info: [ { icon: Users, title: 'Aviation Training', description: 'Introduction to aircraft systems, flight principles, and aerospace technology.' }, { icon: Target, title: 'Air Power Studies', description: 'Understanding of air warfare tactics, strategic operations, and military aviation.' }, { icon: Trophy, title: 'Technical Skills', description: 'Advanced training in electronics, radar systems, and aircraft maintenance.' } ],
  }
};

const WingPage = () => {
  const { wingType } = useParams();
  const navigate = useNavigate();
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddCadetModalOpen, setIsAddCadetModalOpen] = useState(false);
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [selectedCadet, setSelectedCadet] = useState(null);
  const [cadetsByRank, setCadetsByRank] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth();

  const handleDataChange = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const fetchBatches = useCallback(async () => {
    if (!wingType) return;
    try {
      const docRef = doc(db, "config", "batches");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const batchData = docSnap.data();
        const sortedBatches = (batchData[wingType] || []).sort((a, b) => {
          const numA = parseInt(a.split('.')[0], 10);
          const numB = parseInt(b.split('.')[0], 10);
          return numA - numB;
        });
        setBatches(sortedBatches);
      } else {
        setBatches([]);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  }, [wingType]);

  const fetchCadets = useCallback(async () => {
    // --- THIS IS THE FIX ---
    // We get the clean batch name (without the "1. " prefix) for the query
    const cleanBatchName = selectedBatch.includes('.') ? selectedBatch.substring(selectedBatch.indexOf(' ') + 1) : selectedBatch;

    if (!wingType || !cleanBatchName) return;
    
    setLoading(true);
    let formattedWing = wingType.charAt(0).toUpperCase() + wingType.slice(1);
    if (formattedWing === 'Airforce') {
      formattedWing = 'Air';
    }

    // Use the cleanBatchName in the query
    const q = query(collection(db, "cadets"), where("Wing", "==", formattedWing), where("Batch", "==", cleanBatchName));
    
    try {
      const querySnapshot = await getDocs(q);
      const fetchedCadets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const grouped = fetchedCadets.reduce((acc, cadet) => {
        const rank = cadet.rank || "Unranked";
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
  }, [wingType, selectedBatch]);
  
  useEffect(() => {
    fetchBatches();
  }, [wingType, refreshKey, fetchBatches]);

  useEffect(() => {
    if (selectedBatch) {
      fetchCadets();
    } else {
      setCadetsByRank({});
    }
  }, [selectedBatch, fetchCadets, refreshKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedBatch(null);
  }, [wingType]);

  const handleDeleteBatch = async (batchToDelete) => {
    // The batch name here still includes the prefix, e.g., "1. 2022-2025"
    if (!window.confirm(`Are you sure you want to delete the "${batchToDelete.substring(batchToDelete.indexOf(' ') + 1)}" batch and ALL its cadets? This cannot be undone.`)) return;
    
    // We need the clean name to query for cadets to delete
    const cleanBatchNameToDelete = batchToDelete.includes('.') ? batchToDelete.substring(batchToDelete.indexOf(' ') + 1) : batchToDelete;

    try {
      let formattedWing = wingType.charAt(0).toUpperCase() + wingType.slice(1);
      if (formattedWing === 'Airforce') formattedWing = 'Air';
      
      const q = query(collection(db, "cadets"), where("Wing", "==", formattedWing), where("Batch", "==", cleanBatchNameToDelete));
      const querySnapshot = await getDocs(q);
      
      const firestoreBatch = writeBatch(db);
      querySnapshot.forEach(doc => firestoreBatch.delete(doc.ref));
      await firestoreBatch.commit();

      const batchDocRef = doc(db, 'config', 'batches');
      await updateDoc(batchDocRef, {
        [wingType]: arrayRemove(batchToDelete) // We remove the full name with prefix from the config
      });
      handleDataChange();
    } catch (error) {
      console.error("Error deleting batch:", error);
      alert("Failed to delete batch.");
    }
  };

  const handleCadetClick = (cadet) => {
    setSelectedCadet(cadet);
    setIsDetailModalOpen(true);
  };
  
  const handleAdminEditClick = (cadet) => {
    setSelectedCadet(cadet);
    setIsEditModalOpen(true);
  };

  if (!wingType || !wingData[wingType]) return null; 
  const wing = wingData[wingType];

  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/')}><ArrowLeft size={24} /></BackButton>
      <HeroSection $bgImage={wing.image}>
        <HeroOverlay />
        <HeroContent>
          <WingTitle>{wing.title}</WingTitle>
          <WingMotto>"{wing.motto}"</WingMotto>
        </HeroContent>
      </HeroSection>
      <ContentSection>
        <SectionGrid>
          {wing.info.map((info, index) => (
            <InfoCard key={index}>
              <CardIcon><info.icon size={28} /></CardIcon>
              <CardTitle>{info.title}</CardTitle>
              <CardDescription>{info.description}</CardDescription>
            </InfoCard>
          ))}
        </SectionGrid>
        <AnimatePresence mode="wait">
          {!selectedBatch ? (
            <motion.div key="batch-selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SelectionGrid>
                {batches.map((batchName) => (
                  <SelectionCardContainer key={batchName}>
                    {user && <DeleteBatchButton onClick={() => handleDeleteBatch(batchName)}><Trash2 size={16} /></DeleteBatchButton>}
                    <SelectionCard onClick={() => setSelectedBatch(batchName)}>
                      {batchName.includes('.') ? batchName.substring(batchName.indexOf(' ') + 1) : batchName}
                    </SelectionCard>
                  </SelectionCardContainer>
                ))}
                {user && (
                  <SelectionCardContainer>
                    <AddBatchCard onClick={() => setIsAddBatchModalOpen(true)}>
                      <Plus size={32} /> Add Batch
                    </AddBatchCard>
                  </SelectionCardContainer>
                )}
              </SelectionGrid>
            </motion.div>
          ) : (
            <motion.div key="details-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DetailsHeader>
                <BackToBatchButton onClick={() => setSelectedBatch(null)}>
                  <ChevronLeft size={20} /> Back to Batch Selection
                </BackToBatchButton>
                {user && (
                  <AddNewCadetButton onClick={() => setIsAddCadetModalOpen(true)}>
                    <Plus size={20} /> Add New Cadet
                  </AddNewCadetButton>
                )}
              </DetailsHeader>
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
      
      <CadetDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} cadet={selectedCadet} />
      {user && (
        <>
          <AdminCadetEditor 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            cadet={selectedCadet} 
            onComplete={handleDataChange} 
          />
          <AddCadetModal
            isOpen={isAddCadetModalOpen}
            onClose={() => setIsAddCadetModalOpen(false)}
            wing={wingType}
            batch={selectedBatch ? (selectedBatch.includes('.') ? selectedBatch.substring(selectedBatch.indexOf(' ') + 1) : selectedBatch) : ''}
            onComplete={handleDataChange}
          />
          <AddBatchModal
            isOpen={isAddBatchModalOpen}
            onClose={() => setIsAddBatchModalOpen(false)}
            wing={wingType}
            onComplete={handleDataChange}
          />
        </>
      )}
    </PageContainer>
  );
};
export default WingPage;