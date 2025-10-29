
import React from 'react';
import { X } from 'lucide-react'; // Using lucide-react for icons

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className={`relative bg-brand-surface rounded-2xl shadow-xl p-6 m-4 ${sizeClasses[size]} w-full transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow`}
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <style>{`
          @keyframes modalShow {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-xl font-semibold text-brand-light">{title}</h3>}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-brand-muted hover:text-brand-light hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
