import React from 'react';
import { MessagingCenterModal } from '@/features/messaging';

export interface MessagesPortalProps {
  onClose: () => void;
}

export const MessagesPortal: React.FC<MessagesPortalProps> = ({ onClose }) => (
  <MessagingCenterModal
    isOpen={true}
    onClose={onClose}
    isFullScreen={true}
  />
);
