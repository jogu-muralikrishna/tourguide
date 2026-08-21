import React from 'react';
import { AdminPortal } from './admin/AdminPortal';

interface AdminTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminTerminal: React.FC<AdminTerminalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#08080f]">
      <AdminPortal onClose={onClose} />
    </div>
  );
};
