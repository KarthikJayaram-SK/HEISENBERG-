// src/components/admin/AdminCadetEditor.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { X, CheckCircle } from 'lucide-react';
import { db } from '../../firebase'; // Still using Firestore for data
import { supabase } from '../../supabaseClient'; // Using Supabase for files
import { doc, updateDoc } from 'firebase/firestore';

// --- STYLES ---
const ModalBackdrop = styled(motion.div)` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 3000; `;
const ModalContent = styled(motion.div)` background: white; width: 90%; max-width: 500px; border-radius: 15px; display: flex; flex-direction: column; overflow: hidden; `;
const ModalHeader = styled.div` padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; `;
const ModalTitle = styled.h3` margin: 0; font-size: 1.2rem; color: #1A2B4C; `;
const CloseButton = styled.button` background: none; border: none; cursor: pointer; padding: 0.5rem; line-height: 0; `;
const Form = styled.form` padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; `;
const FormGroup = styled.div` display: flex; flex-direction: column; gap: 0.5rem; `;
const Label = styled.label` font-weight: 600; color: #1A2B4C; `;
// ✨ Added Input style
const Input = styled.input` border: 1px solid #ddd; border-radius: 8px; padding: 0.75rem; font-family: inherit; font-size: 1rem; `;
const FileInput = styled.input` border: 1px solid #ddd; border-radius: 8px; padding: 0.5rem; font-family: inherit; margin-top: 0.5rem; `;
const SaveButton = styled.button` background: #1A2B4C; color: white; border: none; padding: 0.8rem; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; &:disabled { background: #ccc; } `;
const Message = styled.p` text-align: center; font-weight: 500; min-height: 1.2rem; color: #1A2B4C; `;
const PhotoPreviewContainer = styled.div` display: flex; align-items: center; gap: 1rem; padding: 0.5rem; border: 1px solid #ddd; border-radius: 8px; `;
const PhotoPreview = styled.img` width: 70px; height: 70px; border-radius: 8px; object-fit: cover; `;
const InfoText = styled.span` font-size: 0.9rem; color: #555; `;
const UploadSuccess = styled.div` display: flex; align-items: center; gap: 0.5rem; color: #28a745; font-size: 0.9rem; margin-top: 0.5rem; `;
// ---

const AdminCadetEditor = ({ isOpen, onClose, cadet, onComplete }) => {
  // ✨ 1. Add state for Regimental No
  const [regimentalNo, setRegimentalNo] = useState('');
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newPdfFile, setNewPdfFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && cadet) {
      // ✨ 2. Initialize Regimental No from cadet data
      setRegimentalNo(cadet.regimentalNo || '');
      setNewPhotoFile(null);
      setNewPdfFile(null);
      setMessage('');
      setIsSubmitting(false);
    }
  }, [cadet, isOpen]);

  // SUPABASE UPLOAD FUNCTION (Unchanged)
  const uploadFileToSupabase = async (file, bucketPath) => {
    if (!file) return null;
    const filePath = `${bucketPath}/${file.name}_${Date.now()}`;
    setMessage(`Uploading ${file.name}...`);
    const { error } = await supabase.storage.from('cadet-files').upload(filePath, file);
    if (error) throw new Error(`Supabase Error: ${error.message}`);
    const { data } = supabase.storage.from('cadet-files').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!cadet) return;

    // ✨ 3. Check if Regimental No has changed
    const hasRegimentalNoChanged = regimentalNo !== (cadet.regimentalNo || '');
    const hasFileChanges = newPhotoFile || newPdfFile;

    // Check if *any* field has changed
    if (!hasFileChanges && !hasRegimentalNoChanged) {
      setMessage("No changes to save.");
      return;
    }

    setIsSubmitting(true);
    setMessage('Updating cadet...');

    try {
      const dataToUpdate = {};

      const newPhotoURL = await uploadFileToSupabase(newPhotoFile, 'photos');
      const newPdfURL = await uploadFileToSupabase(newPdfFile, 'dossiers');

      if (newPhotoURL) dataToUpdate.photoURL = newPhotoURL;
      if (newPdfURL) dataToUpdate.pdfURL = newPdfURL;
      // ✨ 4. Add Regimental No to update object if changed
      if (hasRegimentalNoChanged) dataToUpdate.regimentalNo = regimentalNo;

      // Only update if there are changes
      if (Object.keys(dataToUpdate).length > 0) {
        const cadetRef = doc(db, 'cadets', cadet.id);
        await updateDoc(cadetRef, dataToUpdate);
      } else {
        // Handle case where maybe only text fields changed (if you add them)
        // For now, this handles the regimentalNo change
        if (hasRegimentalNoChanged) {
           const cadetRef = doc(db, 'cadets', cadet.id);
           await updateDoc(cadetRef, { regimentalNo });
        }
      }


      setMessage('Cadet updated successfully!');
      onComplete();
      setTimeout(onClose, 1500);
    } catch (error) {
      console.error("Error updating cadet:", error);
      setMessage(`Error: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !cadet) return null;

  return (
    <AnimatePresence>
        <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalContent initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
                <ModalHeader>
                    <ModalTitle>Edit {cadet.Name}</ModalTitle>
                    <CloseButton onClick={onClose} disabled={isSubmitting}><X size={24} /></CloseButton>
                </ModalHeader>
                <Form onSubmit={handleSave}>
                    {/* File Inputs */}
                    <FormGroup>
                        <Label>Cadet Photo</Label>
                        {cadet.photoURL && (
                            <PhotoPreviewContainer>
                                <PhotoPreview src={cadet.photoURL} alt="Cadet" />
                                <InfoText>Current photo. Upload a new one to replace it.</InfoText>
                            </PhotoPreviewContainer>
                        )}
                        <FileInput type="file" accept="image/*" onChange={(e) => setNewPhotoFile(e.target.files ? e.target.files[0] : null)} />
                        {newPhotoFile && <UploadSuccess><CheckCircle size={16}/> Selected: {newPhotoFile.name}</UploadSuccess>}
                    </FormGroup>
                    <FormGroup>
                        <Label>Details PDF</Label>
                        {cadet.pdfURL && <InfoText>A PDF is already on file.</InfoText>}
                        <FileInput type="file" accept="application/pdf" onChange={(e) => setNewPdfFile(e.target.files ? e.target.files[0] : null)} />
                        {newPdfFile && <UploadSuccess><CheckCircle size={16}/> Selected: {newPdfFile.name}</UploadSuccess>}
                    </FormGroup>

                    {/* ✨ 5. Add Regimental No Input */}
                    <FormGroup>
                        <Label>Regimental No</Label>
                        <Input type="text" value={regimentalNo} onChange={(e) => setRegimentalNo(e.target.value)} />
                    </FormGroup>

                    {/* Add other editable fields (Name, Rank, Dept, Section) here if needed */}

                    <Message>{message}</Message>
                    <SaveButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Working...' : 'Save Changes'}
                    </SaveButton>
                </Form>
            </ModalContent>
        </ModalBackdrop>
    </AnimatePresence>
  );
};
export default AdminCadetEditor;