import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const ModalBackdrop = styled(motion.div)` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 3000; `;
const ModalContent = styled(motion.div)` background: white; width: 90%; max-width: 500px; border-radius: 15px; display: flex; flex-direction: column; overflow: hidden; `;
const ModalHeader = styled.div` padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; `;
const ModalTitle = styled.h3` margin: 0; font-size: 1.2rem; color: #1A2B4C; `;
const CloseButton = styled.button` background: none; border: none; cursor: pointer; padding: 0.5rem; line-height: 0; `;
const Form = styled.form` padding: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; `;
const FormGroup = styled.div` display: flex; flex-direction: column; gap: 0.5rem; &.full-width { grid-column: 1 / -1; } `;
const Label = styled.label` font-weight: 600; color: #1A2B4C; font-size: 0.9rem; `;
const Input = styled.input` border: 1px solid #ddd; border-radius: 8px; padding: 0.75rem; font-family: inherit; font-size: 1rem; `;
const FileInput = styled.input` border: 1px solid #ddd; border-radius: 8px; padding: 0.5rem; font-family: inherit; `;
const SaveButton = styled.button` background: #1A2B4C; color: white; border: none; padding: 0.8rem; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; grid-column: 1 / -1; &:disabled { background: #ccc; } `;
const Message = styled.p` text-align: center; font-weight: 500; min-height: 1.2rem; color: #1A2B4C; grid-column: 1 / -1; `;

const AddCadetModal = ({ isOpen, onClose, wing, batch, onComplete }) => {
  const [name, setName] = useState('');
  const [rank, setRank] = useState('');
  const [secID, setSecID] = useState('');
  const [dept, setDept] = useState('');
  const [section, setSection] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(''); setRank(''); setSecID(''); setDept('');
      setSection(''); setPhotoFile(null); setPdfFile(null);
      setMessage(''); setIsUploading(false);
    }
  }, [isOpen]);

  // This helper function uploads a single file to Cloudinary
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error.message || 'Cloudinary upload failed');
    }
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !rank || !secID || !dept || !section) {
      setMessage('All text fields are required.');
      return;
    }
    setIsUploading(true);
    setMessage('Creating cadet record...');
    try {
      let photoURL = '';
      let pdfURL = '';

      if (photoFile) {
        setMessage('Uploading photo...');
        photoURL = await uploadFile(photoFile);
      }
      if (pdfFile) {
        setMessage('Uploading PDF...');
        pdfURL = await uploadFile(pdfFile);
      }

      setMessage('Finalizing record...');
      let formattedWing = wing.charAt(0).toUpperCase() + wing.slice(1);
      if (formattedWing === 'Airforce') {
        formattedWing = 'Air';
      }
      const newCadetData = {
        Name: name, rank: rank.toUpperCase(), Wing: formattedWing, Batch: batch,
        secID, dept, section, photoURL, pdfURL
      };
      await addDoc(collection(db, 'cadets'), newCadetData);
      
      setMessage('Cadet added successfully!');
      onComplete();
      setTimeout(onClose, 1500);
    } catch (error) {
      console.error("Error adding cadet:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ModalContent initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
            <ModalHeader>
              <ModalTitle>Add New Cadet to {batch}</ModalTitle>
              <CloseButton onClick={onClose} disabled={isUploading}><X size={24} /></CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup className="full-width"><Label>Full Name</Label><Input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></FormGroup>
              <FormGroup><Label>SEC ID</Label><Input type="text" value={secID} onChange={(e) => setSecID(e.target.value)} required /></FormGroup>
              <FormGroup><Label>Rank (e.g., CDT, CPL)</Label><Input type="text" value={rank} onChange={(e) => setRank(e.target.value)} required /></FormGroup>
              <FormGroup><Label>Dept</Label><Input type="text" value={dept} onChange={(e) => setDept(e.target.value)} required /></FormGroup>
              <FormGroup><Label>Section</Label><Input type="text" value={section} onChange={(e) => setSection(e.target.value)} required /></FormGroup>
              <FormGroup className="full-width"><Label>Cadet Photo (Optional)</Label><FileInput type="file" accept="image/png, image/jpeg" onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)} /></FormGroup>
              <FormGroup className="full-width"><Label>Details PDF (Optional)</Label><FileInput type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)} /></FormGroup>
              <Message>{message}</Message>
              <SaveButton type="submit" disabled={isUploading}>{isUploading ? 'Saving...' : 'Add Cadet'}</SaveButton>
            </Form>
          </ModalContent>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};
export default AddCadetModal;