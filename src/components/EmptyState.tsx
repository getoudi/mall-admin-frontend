import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, message, actionLabel, onAction }) => {
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-12 text-center space-y-4 border-2 border-dashed border-outline-variant">
      <Icon className="w-16 h-16 mx-auto text-outline-variant" />
      <p className="text-on-surface-variant">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary-container text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
