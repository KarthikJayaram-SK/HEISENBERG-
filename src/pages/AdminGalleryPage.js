// src/pages/AdminGalleryPage.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { collection, getDocs, doc, writeBatch, addDoc, deleteDoc, runTransaction, orderBy, query, where, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore for data
import { supabase } from '../supabaseClient'; // 1. IMPORT SUPABASE
import { ImagePlus, Trash2, Plus } from 'lucide-react';

// --- STYLES (No Change) ---
const PageContainer = styled.div` padding: 100px 2rem 4rem; max-width: 1200px; margin: 0 auto; `;
const Header = styled.div` text-align: center; margin-bottom: 3rem; `;
const Title = styled.h1` font-size: 2.5rem; color: #1A2B4C; `;
const ControlPanel = styled.div` background: #f8f9fa; padding: 2rem; border-radius: 15px; border: 2px dashed #ccc; margin-bottom: 3rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; `;
const SelectorGroup = styled.div` display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; justify-content: center; `;
const YearSelector = styled.select` padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #ccc; font-size: 1rem; font-family: inherit; font-weight: 500; min-width: 150px; `;
const AddYearContainer = styled.div` display: flex; gap: 0.5rem; align-items: center; `;
const YearInput = styled.input` border: 1px solid #ddd; border-radius: 8px; padding: 0.5rem; font-family: inherit; font-size: 1rem; width: 100px; `;
const AddButton = styled.button` background: #28a745; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; `;
const UploadButton = styled.button` background: #1A2B4C; color: white; border: none; padding: 0.8rem 1.5rem; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; &:disabled { background: #ccc; } `;
const YearSection = styled.div` margin-bottom: 3rem; `;
const YearTitle = styled.h2` font-size: 1.8rem; color: #1A2B4C; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; `;
const DeleteYearButton = styled.button` background: #fbebeb; color: #c53030; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; `;
const ImageGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; `;
const ImageCard = styled.div` background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); position: relative; aspect-ratio: 1 / 1; img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; } `;
const DeletePhotoButton = styled.button` position: absolute; top: 8px; right: 8px; background: rgba(255,0,0,0.7); color: white; border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; &:hover { background: red; } `;
const Caption = styled.p` position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); color: white; margin: 0; padding: 1.5rem 0.8rem 0.8rem; font-size: 0.9rem; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; `;
const LoadingOverlay = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.8); display: flex; justify-content: center; align-items: center; z-index: 9999; font-size: 1.2rem; font-weight: 600; color: #1A2B4C; `;
// ---

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const AdminGalleryPage = () => {
  // 2. REMOVE CLOUDINARY CREDENTIALS
  // const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  // const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  const [galleryYears, setGalleryYears] = useState([]);
  const [photosByYear, setPhotosByYear] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [newYear, setNewYear] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // ... (fetch config and existing photos from Firestore - no change here) ...
      const configRef = doc(db, "config", "gallery");
      const configSnap = await getDoc(configRef);
      const years = configSnap.exists() ? configSnap.data().years.sort((a,b) => b - a) : [];
      setGalleryYears(years);
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[0]);
      }
      const photosQuery = query(collection(db, "galleryImages"), orderBy("timestamp", "desc"));
      const photosSnapshot = await getDocs(photosQuery);
      const allPhotos = photosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const groupedPhotos = allPhotos.reduce((acc, photo) => {
        const year = photo.year;
        if (!acc[year]) acc[year] = [];
        acc[year].push(photo);
        return acc;
      }, {});
      setPhotosByYear(groupedPhotos);
    } catch (error) {
      console.error("Failed to fetch gallery data:", error);
      alert("Failed to load gallery data. Check console.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddYear = async () => {
    // ... (logic to add a new year to config - no change here) ...
    if (!newYear || galleryYears.includes(newYear)) {
      alert("Please enter a valid, unique year."); return;
    }
    setIsLoading(true);
    const configRef = doc(db, "config", "gallery");
    await runTransaction(db, async (transaction) => {
      const configDoc = await transaction.get(configRef);
      if (!configDoc.exists()) {
        transaction.set(configRef, { years: [newYear] });
      } else {
        const existingYears = configDoc.data().years || [];
        transaction.update(configRef, { years: [...existingYears, newYear] });
      }
    });
    setNewYear('');
    await fetchData();
  };

  // 3. NEW SUPABASE UPLOAD FUNCTION
  const uploadFileToSupabase = async (file, bucketPath) => {
    if (!file) return null;
    const filePath = `${bucketPath}/${file.name}_${Date.now()}`;
    const { error } = await supabase.storage
      .from('cadet-files') // Your public bucket name
      .upload(filePath, file);
    if (error) throw new Error(`Supabase Error: ${error.message}`);
    const { data } = supabase.storage.from('cadet-files').getPublicUrl(filePath);
    return data.publicUrl;
  };
  
  // 4. UPDATED PHOTO UPLOAD HANDLER
  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0 || !selectedYear || !selectedMonth) {
        alert("Please select a year and a month first.");
        return;
    }
    setIsLoading(true);
    try {
        const uploadPromises = files.map(file => 
          uploadFileToSupabase(file, `gallery/${selectedYear}/${selectedMonth}`) // Use Supabase upload
        );
        const uploadedUrls = await Promise.all(uploadPromises);
        
        const batch = writeBatch(db);
        uploadedUrls.forEach(imageUrl => {
            if (imageUrl) { // Check if upload was successful
                const newPhotoRef = doc(collection(db, "galleryImages"));
                batch.set(newPhotoRef, {
                    imageUrl: imageUrl, // Save Supabase URL
                    year: selectedYear,
                    month: parseInt(selectedMonth),
                    caption: '', // You might want to add a caption input later
                    timestamp: Date.now()
                });
            }
        });
        await batch.commit();
        await fetchData(); // Refresh the displayed photos
    } catch (error) {
        console.error("Error uploading images:", error);
        alert(`One or more images failed to upload. Error: ${error.message}`);
    } finally {
        setIsLoading(false);
        event.target.value = null; // Reset file input
    }
  };

  const handleDeletePhoto = async (photo) => {
    // ... (logic to delete photo doc from Firestore - no change here) ...
    // Note: This does NOT delete the file from Supabase storage automatically.
    // You might want to add Supabase file deletion later if needed.
    if (!window.confirm("Are you sure?")) return;
    setIsLoading(true);
    await deleteDoc(doc(db, "galleryImages", photo.id));
    await fetchData();
  };

  const handleDeleteYear = async (yearToDelete) => {
    // ... (logic to delete year from config and all associated photos from Firestore - no change here) ...
    // Note: Also does NOT delete files from Supabase storage automatically.
    if (!window.confirm(`Delete ENTIRE "${yearToDelete}" gallery? Cannot be undone.`)) return;
    setIsLoading(true);
    const photosQuery = query(collection(db, "galleryImages"), where("year", "==", yearToDelete));
    const photosSnapshot = await getDocs(photosQuery);
    const deleteBatch = writeBatch(db);
    photosSnapshot.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
    const configRef = doc(db, "config", "gallery");
    await runTransaction(db, async (transaction) => {
      const configDoc = await transaction.get(configRef);
      if (configDoc.exists()) {
        const updatedYears = configDoc.data().years.filter(y => y !== yearToDelete);
        transaction.update(configRef, { years: updatedYears });
      }
    });
    await fetchData();
  };

  // --- JSX REMAINS LARGELY THE SAME ---
  return (
    <PageContainer>
      {isLoading && <LoadingOverlay>Loading...</LoadingOverlay>}
      <Header>
        <Title>Manage Gallery Photos</Title>
      </Header>
      <ControlPanel>
        <AddYearContainer>
          <YearInput type="number" placeholder="e.g., 2024" value={newYear} onChange={e => setNewYear(e.target.value)} />
          <AddButton onClick={handleAddYear}><Plus size={16}/> Add Year</AddButton>
        </AddYearContainer>
        <SelectorGroup>
          <YearSelector value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            <option value="" disabled>-- Select Year --</option>
            {galleryYears.map(year => <option key={year} value={year}>{year}</option>)}
          </YearSelector>
          <YearSelector value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {months.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </YearSelector>
        </SelectorGroup>
        {/* The hidden file input triggers the handlePhotoUpload */}
        <input type="file" id="galleryPhotoUpload" style={{ display: 'none' }} onChange={handlePhotoUpload} accept="image/jpeg, image/png, image/webp" multiple />
        <UploadButton onClick={() => document.getElementById('galleryPhotoUpload').click()} disabled={!selectedYear || isLoading}>
          <ImagePlus size={20}/> Upload Photos to {selectedYear || '...'}
        </UploadButton>
      </ControlPanel>
      {galleryYears.map(year => (
        <YearSection key={year}>
          <YearTitle>
            {year} Gallery
            <DeleteYearButton onClick={() => handleDeleteYear(year)}><Trash2 size={14}/> Delete Year</DeleteYearButton>
          </YearTitle>
          <ImageGrid>
            {(photosByYear[year] || []).map(photo => (
              <ImageCard key={photo.id}>
                <img src={photo.imageUrl} alt={photo.caption || `Gallery image for ${year}`} />
                {photo.caption && <Caption>{photo.caption}</Caption>}
                <DeletePhotoButton onClick={() => handleDeletePhoto(photo)}><Trash2 size={16} /></DeletePhotoButton>
              </ImageCard>
            ))}
          </ImageGrid>
        </YearSection>
      ))}
    </PageContainer>
  );
};

export default AdminGalleryPage;