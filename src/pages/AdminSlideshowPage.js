// src/pages/AdminSlideshowPage.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, doc, writeBatch, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore for data
import { supabase } from '../supabaseClient'; // 1. IMPORT SUPABASE
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImagePlus, Trash2, Save } from 'lucide-react';

// --- STYLES (No Change) ---
const PageContainer = styled.div` padding: 100px 2rem 4rem; max-width: 1200px; margin: 0 auto; `;
const Header = styled.div` text-align: center; margin-bottom: 3rem; `;
const Title = styled.h1` font-size: 2.5rem; color: #1A2B4C; `;
const InfoText = styled.p` color: #555; `;
const ImageGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; `;
const ImageCard = styled.div` background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); position: relative; aspect-ratio: 1 / 1; touch-action: none; img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; } `;
const DeleteButton = styled.button` position: absolute; top: 8px; right: 8px; background: rgba(255,0,0,0.7); color: white; border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; &:hover { background: red; } `;
const UploadContainer = styled.div` margin: 2rem 0; padding: 2rem; border: 2px dashed #ccc; border-radius: 15px; text-align: center; background: #f8f9fa; display: flex; flex-direction: column; align-items: center; gap: 1rem; `;
const UploadButton = styled.button` background: #1A2B4C; color: white; border: none; padding: 0.8rem 1.5rem; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; &:disabled { background: #ccc; } `;
const LoadingOverlay = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.8); display: flex; justify-content: center; align-items: center; z-index: 9999; font-size: 1.2rem; font-weight: 600; color: #1A2B4C; `;
const WingSelector = styled.select` padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #ccc; font-size: 1rem; font-family: inherit; font-weight: 500; `;
const SaveButtonContainer = styled.div` display: flex; justify-content: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e0e0e0; `;
const SaveAndExitButton = styled.button` background: #28a745; color: white; border: none; padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 600; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; transition: background-color 0.2s ease-in-out; &:hover { background: #218838; } `;
// ---

const SortableImage = ({ image, index, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
        <ImageCard ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <img src={image.imageUrl} alt={`Slide ${index + 1}`} />
            <DeleteButton
                onPointerDown={e => e.stopPropagation()} // Prevent drag on button click
                onClick={(e) => {
                    e.stopPropagation(); 
                    onDelete(image);
                }}
            >
                <Trash2 size={16} />
            </DeleteButton>
        </ImageCard>
    );
};

const AdminSlideshowPage = () => {
    const navigate = useNavigate();
    // 2. REMOVE CLOUDINARY CREDENTIALS
    // const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    // const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [targetCollection, setTargetCollection] = useState('slideshowImages'); 
    
    const fetchImages = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetching images from Firestore based on targetCollection
            const q = query(collection(db, targetCollection), orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);
            const fetchedImages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setImages(fetchedImages);
        } catch (error) {
            console.error("Failed to fetch images:", error);
            alert("Failed to load images. Check console for details.");
            setImages([]);
        } finally {
            setIsLoading(false);
        }
    }, [targetCollection]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]); // Dependency array includes fetchImages

    const handleDragEnd = async (event) => {
        // ... (logic to reorder images in Firestore - no change here) ...
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;
        const oldIndex = images.findIndex(img => img.id === active.id);
        const newIndex = images.findIndex(img => img.id === over.id);
        const newOrder = arrayMove(images, oldIndex, newIndex);
        setImages(newOrder); // Update local state immediately
        // Update Firestore order
        const batch = writeBatch(db);
        newOrder.forEach((item, index) => {
          const docRef = doc(db, targetCollection, item.id);
          batch.update(docRef, { order: index + 1 }); // Use index + 1 for order
        });
        try {
          await batch.commit();
        } catch (error) {
          console.error("Failed to save new order:", error);
          alert("Failed to save new order. Refreshing list.");
          await fetchImages(); // Re-fetch on error
        }
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

    // 4. UPDATED UPLOAD HANDLER
    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setIsLoading(true);
        try {
            // Use Supabase upload
            const imageUrl = await uploadFileToSupabase(file, `slideshows/${targetCollection}`);
            
            if (imageUrl) {
                // Determine the order for the new image
                const newOrder = images.length > 0 ? Math.max(...images.map(img => img.order)) + 1 : 1;
                // Add the new image URL and order to Firestore
                await addDoc(collection(db, targetCollection), { imageUrl, order: newOrder });
                await fetchImages(); // Refresh the list
            } else {
              throw new Error("Upload succeeded but no URL was returned.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert(`Failed to upload image. Error: ${error.message}`);
        } finally {
            setIsLoading(false);
            event.target.value = null; // Reset file input
        }
    };

    const handleDelete = async (imageToDelete) => {
        // ... (logic to delete image doc from Firestore - no change here) ...
        // Note: Does not delete from Supabase storage automatically.
        if (!window.confirm("Are you sure?")) return;
        setIsLoading(true);
        try {
            await deleteDoc(doc(db, targetCollection, imageToDelete.id));
            // After deleting, re-fetch and potentially re-order remaining images
            await fetchImages();
            // Optional: Re-number the 'order' field for remaining images
            const remainingImages = images.filter(img => img.id !== imageToDelete.id);
            const batch = writeBatch(db);
            remainingImages.sort((a, b) => a.order - b.order).forEach((item, index) => {
               const docRef = doc(db, targetCollection, item.id);
               batch.update(docRef, { order: index + 1 });
            });
            await batch.commit();
            await fetchImages(); // Fetch again to reflect re-ordering
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete image.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAndExit = () => {
        navigate('/'); // Navigate to homepage or relevant page
    };

    // --- JSX REMAINS LARGELY THE SAME ---
    return (
        <PageContainer>
            {isLoading && <LoadingOverlay>Loading...</LoadingOverlay>}
            <Header>
                <Title>Manage Slideshow Photos</Title>
                <InfoText>Select a slideshow, then drag and drop photos to change their order.</InfoText>
            </Header>
            <UploadContainer>
                <div>
                    <label htmlFor="collection-select" style={{ marginRight: '1rem', fontWeight: 600 }}>Manage Slideshow For:</label>
                    <WingSelector id="collection-select" value={targetCollection} onChange={(e) => setTargetCollection(e.target.value)}>
                        <option value="slideshowImages">General (Homepage)</option>
                        <option value="armySlideshowImages">Army Wing</option>
                        <option value="navySlideshowImages">Navy Wing</option>
                        <option value="airSlideshowImages">Air Wing</option>
                    </WingSelector>
                </div>
                {/* Hidden file input triggers handleUpload */}
                <input type="file" id="photoUpload" style={{ display: 'none' }} onChange={handleUpload} accept="image/jpeg, image/png, image/webp"/>
                <UploadButton onClick={() => document.getElementById('photoUpload').click()} disabled={isLoading}>
                    <ImagePlus size={20}/> Add New Photo
                </UploadButton>
            </UploadContainer>
            
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images} strategy={rectSortingStrategy}>
                    <ImageGrid>
                        {images.map((image, index) => (
                            <SortableImage key={image.id} image={image} index={index} onDelete={handleDelete} />
                        ))}
                    </ImageGrid>
                </SortableContext>
            </DndContext>

            <SaveButtonContainer>
                <SaveAndExitButton onClick={handleSaveAndExit}>
                    <Save size={20} />
                    Save and Go to Homepage
                </SaveAndExitButton>
            </SaveButtonContainer>
        </PageContainer>
    );
};

export default AdminSlideshowPage;