import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { X } from 'lucide-react';

const ModalBackdrop = styled(motion.div)` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 2000; `;
const ModalContent = styled(motion.div)` background: white; width: 90%; height: 90%; max-width: 1000px; border-radius: 15px; display: flex; flex-direction: column; overflow: hidden; `;
const ModalHeader = styled.div` padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; `;
const ModalTitle = styled.h3` margin: 0; font-size: 1.2rem; color: #1A2B4C; `;
const CloseButton = styled.button` background: none; border: none; cursor: pointer; padding: 0.5rem; line-height: 0; `;
const PDFViewer = styled.iframe` flex-grow: 1; border: none; width: 100%; height: 100%; `;

// --- STYLES FOR THE "NOT AVAILABLE" MESSAGE ---
const EmptyStateContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
`;
const EmptyStateTitle = styled.h3` font-size: 1.5rem; color: #1A2B4C; margin-bottom: 0.5rem; `;
const EmptyStateText = styled.p` color: #555; max-width: 400px; margin-bottom: 2rem; `;

// --- NEW: CONTAINER FOR CADET DETAILS ---
const DetailsContainer = styled.div`
  padding: 1.5rem;
  font-family: sans-serif;
`;
const DetailItem = styled.div`
  margin-bottom: 0.75rem;
`;
const DetailLabel = styled.span`
  font-weight: 700;
  color: #1A2B4C;
  margin-right: 0.5rem;
`;
const DetailValue = styled.span`
  color: #555;
`;


const CadetDetailModal = ({ isOpen, onClose, cadet }) => {
  return (
    <AnimatePresence>
      {isOpen && cadet && (
        <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ModalContent initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <ModalHeader>
              <ModalTitle>{cadet.Name}'s Dossier</ModalTitle>
              <CloseButton onClick={onClose}><X size={24} /></CloseButton>
            </ModalHeader>
            {cadet.pdfURL ? (
              <PDFViewer src={cadet.pdfURL} title={`${cadet.Name}'s Details`} />
            ) : (
              <EmptyStateContainer>
                <EmptyStateTitle>Dossier Not Yet Deployed</EmptyStateTitle>
                <EmptyStateText>
                  This cadet's digital profile is being prepared. Check back soon for their detailed records and achievements!
                </EmptyStateText>

                {/* --- NEW: DISPLAY CADET DETAILS HERE --- */}
                <DetailsContainer>
                  <DetailItem>
                    <DetailLabel>SEC ID:</DetailLabel>
                    <DetailValue>{cadet.secID}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Department:</DetailLabel>
                    <DetailValue>{cadet.dept}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Section:</DetailLabel>
                    <DetailValue>{cadet.section}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Batch:</DetailLabel>
                    <DetailValue>{cadet.Batch}</DetailValue>
                  </DetailItem>
                </DetailsContainer>

              </EmptyStateContainer>
            )}
          </ModalContent>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

export default CadetDetailModal;