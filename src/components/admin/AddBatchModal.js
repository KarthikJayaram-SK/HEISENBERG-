import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { db } from '../../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const ModalBackdrop = styled(motion.div)` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 3000; `;
const ModalContent = styled(motion.div)` background: white; width: 90%; max-width: 400px; border-radius: 15px; display: flex; flex-direction: column; overflow: hidden; `;
const ModalHeader = styled.div` padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; `;
const ModalTitle = styled.h3` margin: 0; font-size: 1.2rem; color: #1A2B4C; `;
const CloseButton = styled.button` background: none; border: none; cursor: pointer; padding: 0.5rem; line-height: 0; `;
const Form = styled.form` padding: 2rem; display: flex; flex-direction: column; gap: 1rem; `;
const Label = styled.label` font-weight: 600; color: #1A2B4C; font-size: 0.9rem; `;
const Input = styled.input` border: 1px solid #ddd; border-radius: 8px; padding: 0.75rem; font-family: inherit; font-size: 1rem; `;
const SaveButton = styled.button` background: #1A2B4C; color: white; border: none; padding: 0.8rem; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; &:disabled { background: #ccc; } `;
const Message = styled.p` text-align: center; font-weight: 500; min-height: 1.2rem; color: #1A2B4C; `;

const AddBatchModal = ({ isOpen, onClose, wing, onComplete }) => {
  const [batchName, setBatchName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batchName.trim()) {
      setMessage('Batch name cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    setMessage('Adding batch...');

    try {
      const batchDocRef = doc(db, 'config', 'batches');
      await updateDoc(batchDocRef, {
        [wing]: arrayUnion(batchName.trim())
      });
      setMessage('Batch added successfully!');
      onComplete();
      setTimeout(() => {
        onClose();
        setBatchName('');
        setMessage('');
      }, 1000);
    } catch (error) {
      console.error("Error adding batch:", error);
      setMessage('Failed to add batch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ModalContent initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
            <ModalHeader>
              <ModalTitle>Add New Batch</ModalTitle>
              <CloseButton onClick={onClose}><X size={24} /></CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <Label>Batch Name (e.g., 2025-2028)</Label>
              <Input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />
              <Message>{message}</Message>
              <SaveButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Batch'}
              </SaveButton>
            </Form>
          </ModalContent>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

export default AddBatchModal;