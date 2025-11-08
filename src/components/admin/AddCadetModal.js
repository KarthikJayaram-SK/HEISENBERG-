// src/components/admin/AddCadetModal.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { css } from 'styled-components';
import { X, CheckCircle } from 'lucide-react';
import { db } from '../../firebase'; // Still using Firestore for data
import { supabase } from '../../supabaseClient'; // Using Supabase for files
import { collection, addDoc } from 'firebase/firestore';

// --- STYLES ---
const ModalBackdrop = styled(motion.div)` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 3000; `;
const ModalContent = styled(motion.div)` background: white; width: 90%; max-width: 600px; border-radius: 15px; display: flex; flex-direction: column; overflow: hidden; `;
const ModalHeader = styled.div` padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; `;
const ModalTitle = styled.h3` margin: 0; font-size: 1.2rem; color: #1A2B4C; `;
const CloseButton = styled.button` background: none; border: none; cursor: pointer; padding: 0.5rem; line-height: 0; `;
const Form = styled.form` padding: 1.5rem 2rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.5rem; @media (max-width: 576px) { grid-template-columns: 1fr; gap: 1rem; } `;
const FormGroup = styled.div` display: flex; flex-direction: column; gap: 0.5rem; ${props => props.fullWidth && css` grid-column: 1 / -1; `} `;
const Label = styled.label` font-weight: 600; color: #1A2B4C; font-size: 0.9rem; `;
const Input = styled.input` border: 1px solid #ddd; border-radius: 8px; padding: 0.75rem; font-family: inherit; font-size: 1rem; `;
const FileInput = styled.input` border: 1px solid #ddd; border-radius: 8px; padding: 0.5rem; font-family: inherit; font-size: 0.9rem; `;
const SaveButton = styled.button` background: #1A2B4C; color: white; border: none; padding: 0.8rem; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; grid-column: 1 / -1; margin-top: 1rem; &:disabled { background: #ccc; } `;
const Message = styled.p` text-align: center; font-weight: 500; min-height: 1.2rem; color: #1A2B4C; grid-column: 1 / -1; margin: 0; `;
const UploadSuccess = styled.div` display: flex; align-items: center; gap: 0.5rem; color: #28a745; font-size: 0.9rem; margin-top: 0.5rem; `;
// ---

const AddCadetModal = ({ isOpen, onClose, wing, batch, onComplete }) => {
  const [name, setName] = useState('');
  const [rank, setRank] = useState('');
  const [secID, setSecID] = useState('');
  // ✨ 1. Add state for Regimental No
  const [regimentalNo, setRegimentalNo] = useState('');
  const [dept, setDept] = useState('');
  const [section, setSection] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(''); setRank(''); setSecID('');
      setRegimentalNo(''); // ✨ 2. Reset Regimental No
      setDept(''); setSection(''); setPhotoFile(null); setPdfFile(null);
      setMessage(''); setIsSubmitting(false);
    }
  }, [isOpen]);

  // SUPABASE UPLOAD FUNCTION (Unchanged)
  const uploadFileToSupabase = async (file, bucketPath) => {
    if (!file) return '';
    const filePath = `${bucketPath}/${file.name}_${Date.now()}`;
    setMessage(`Uploading ${file.name}...`);
    const { error } = await supabase.storage.from('cadet-files').upload(filePath, file);
    if (error) throw new Error(`Supabase Error: ${error.message}`);
    const { data } = supabase.storage.from('cadet-files').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✨ 3. Add Regimental No to validation
    if (!name || !rank || !secID || !regimentalNo || !dept || !section) {
      setMessage('All text fields are required.');
      return;
    }
    setIsSubmitting(true);

    try {
      const photoURL = await uploadFileToSupabase(photoFile, 'photos');
      const pdfURL = await uploadFileToSupabase(pdfFile, 'dossiers');

      setMessage('Finalizing record in Firestore...');
      let formattedWing = wing.charAt(0).toUpperCase() + wing.slice(1);
      if (formattedWing === 'Airforce') formattedWing = 'Air';

      const newCadetData = {
        Name: name, rank: rank.toUpperCase(), Wing: formattedWing, Batch: batch,
        secID,
        regimentalNo, // ✨ 4. Include Regimental No in data
        dept, section, photoURL, pdfURL
      };

      await addDoc(collection(db, 'cadets'), newCadetData);

      setMessage('Cadet added successfully!');
      onComplete();
      setTimeout(onClose, 1500);
    } catch (error) {
      console.error("Error adding cadet:", error);
      setMessage(`Error: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ModalContent initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
            <ModalHeader>
              <ModalTitle>Add New Cadet to {batch}</ModalTitle>
              <CloseButton onClick={onClose} disabled={isSubmitting}><X size={24} /></CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup fullWidth><Label>Full Name</Label><Input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></FormGroup>
              <FormGroup><Label>SEC ID</Label><Input type="text" value={secID} onChange={(e) => setSecID(e.target.value)} required /></FormGroup>

              {/* ✨ 5. Add Regimental No Input */}
              <FormGroup>
                <Label>Regimental No</Label>
                <Input type="text" value={regimentalNo} onChange={(e) => setRegimentalNo(e.target.value)} required />
              </FormGroup>

              {/* Added Rank field back in based on previous logic */}
              <FormGroup><Label>Rank</Label><Input type="text" value={rank} onChange={(e) => setRank(e.target.value)} required /></FormGroup>
              <FormGroup><Label>Dept</Label><Input type="text" value={dept} onChange={(e) => setDept(e.target.value)} required /></FormGroup>
              <FormGroup><Label>Section</Label><Input type="text" value={section} onChange={(e) => setSection(e.target.value)} required /></FormGroup>

              {/* File Inputs */}
              <FormGroup fullWidth>
                <Label>Cadet Photo (Optional)</Label>
                <FileInput type="file" accept="image/png, image/jpeg" onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)} />
                {photoFile && <UploadSuccess><CheckCircle size={16} /> Selected: {photoFile.name}</UploadSuccess>}
              </FormGroup>
              <FormGroup fullWidth>
                <Label>Details PDF (Optional)</Label>
                <FileInput type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)} />
                {pdfFile && <UploadSuccess><CheckCircle size={16} /> Selected: {pdfFile.name}</UploadSuccess>}
              </FormGroup>

              <Message>{message}</Message>
              <SaveButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Add Cadet'}</SaveButton>
            </Form>
          </ModalContent>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};
export default AddCadetModal;