import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      {/* Modal Container */}
      <div
        className="w-full max-w-[520px] bg-surface-container border border-outline-variant rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant/40">
          <h2 className="font-headline-md text-headline-md text-on-surface" id="modal-title">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-sm rounded-lg hover:bg-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Close modal"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-lg flex flex-col gap-lg overflow-y-auto max-h-[716px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
