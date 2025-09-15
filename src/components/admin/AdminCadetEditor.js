import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ModalBackdrop = styled(motion.div)` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 3000; `;
const ModalContent = styled(motion.div)` background: white; width: 90%; max-width: 500px; border-radius: 15px; display: flex; flex-direction: column; overflow: hidden; `;
const ModalHeader = styled.div` padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; `;
const ModalTitle = styled.h3` margin: 0; font-size: 1.2rem; color: #1A2B4C; `;
const CloseButton = styled.button` background: none; border: none; cursor: pointer; padding: 0.5rem; line-height: 0; `;
const Form = styled.form` padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; `;
const FormGroup = styled.div` display: flex; flex-direction: column; gap: 0.5rem; `;
const Label = styled.label` font-weight: 600; color: #1A2B4C; `;
const FileInput = styled.input` border: 1px solid #ddd; border-radius: 8px; padding: 0.5rem; font-family: inherit; `;
const SaveButton = styled.button` background: #1A2B4C; color: white; border: none; padding: 0.8rem; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; &:disabled { background: #ccc; } `;
const Message = styled.p` text-align: center; font-weight: 500; min-height: 1.2rem; color: #1A2B4C; `;
const PhotoPreviewContainer = styled.div` display: flex; align-items: center; gap: 1rem; padding: 0.5rem; border: 1px solid #ddd; border-radius: 8px; `;
const PhotoPreview = styled.img` width: 70px; height: 70px; border-radius: 8px; object-fit: cover; `;
const InfoText = styled.span` font-size: 0.9rem; color: #555; `;

const AdminCadetEditor = ({ isOpen, onClose, cadet, onComplete }) => {
  const [photoFile, setPhotoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPhotoFile(null);
      setPdfFile(null);
      setMessage('');
      setIsUploading(false);
    }
  }, [isOpen]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!cadet || (!photoFile && !pdfFile)) return;
    setIsUploading(true);
    setMessage('Uploading files...');
    try {
      const updatedData = {};
      if (photoFile) {
        setMessage('Uploading new photo...');
        updatedData.photoURL = await uploadFile(photoFile);
      }
      if (pdfFile) {
        setMessage('Uploading new PDF...');
        updatedData.pdfURL = await uploadFile(pdfFile);
      }

      if (Object.keys(updatedData).length > 0) {
        setMessage('Updating record...');
        const cadetDocRef = doc(db, 'cadets', cadet.id);
        await updateDoc(cadetDocRef, updatedData);
      }
      
      setMessage('Update successful!');
      onComplete();
      setTimeout(onClose, 1500);
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && cadet && (
        <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ModalContent initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
            <ModalHeader>
              <ModalTitle>Edit {cadet.Name}</ModalTitle>
              <CloseButton onClick={onClose} disabled={isUploading}><X size={24} /></CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSave}>
              <FormGroup>
                <Label>Cadet Photo</Label>
                {cadet.photoURL ? (
                  <PhotoPreviewContainer>
                    <PhotoPreview src={cadet.photoURL} alt="Cadet" />
                    <InfoText>To replace this photo, choose a new file below.</InfoText>
                  </PhotoPreviewContainer>
                ) : null}
                 <FileInput 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)} 
                    style={{ marginTop: cadet.photoURL ? '1rem' : '0' }}
                 />
              </FormGroup>
              <FormGroup>
                <Label>Details PDF</Label>
                {cadet.pdfURL && <InfoText>A PDF is already uploaded. Choosing a new file will replace it.</InfoText>}
                <FileInput type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)} />
              </FormGroup>
              <Message>{message}</Message>
              <SaveButton type="submit" disabled={isUploading || (!photoFile && !pdfFile)}>
                {isUploading ? 'Working...' : 'Save Changes'}
              </SaveButton>
            </Form>
          </ModalContent>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};
export default AdminCadetEditor;