import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = "" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-slate-900/95 backdrop-blur-md rounded-lg border border-slate-600/50 shadow-2xl transition-all duration-300 ease-out w-full max-w-md sm:max-w-lg ${className}`} 
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
          <div className="p-3 sm:p-4">
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              {title && (
                <h3 className="text-white font-semibold text-lg">{title}</h3>
              )}
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors p-1 ml-auto"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Content */}
            {children}
          </div>
        </div>
      </div>
  );
};

export default Modal;
