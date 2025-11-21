import React from 'react';
import BaseModal from '../ui/BaseModal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-6">
        <p className="text-[var(--text-secondary)]">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-[var(--background-tertiary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--border-color)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white font-semibold rounded-[var(--border-radius)] hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmationModal;