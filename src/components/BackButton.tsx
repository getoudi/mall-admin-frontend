import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label }) => {
  return (
    <button
      className="flex items-center gap-2 p-2 hover:bg-surface-container rounded-full transition-colors mb-4"
      onClick={onClick}
    >
      <ChevronLeft className="w-5 h-5" />
      {label && <span className="font-medium">{label}</span>}
    </button>
  );
};

export default BackButton;
