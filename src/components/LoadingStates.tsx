import React from 'react';
import { X, Clock } from 'lucide-react';

// Loading skeleton component
export const CardSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full min-h-[300px] sm:h-96 bg-slate-700 rounded-2xl">
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-8 h-8 bg-slate-600 rounded-full mb-4"></div>
        <div className="w-3/4 h-4 bg-slate-600 rounded mb-2"></div>
        <div className="w-full h-8 bg-slate-600 rounded"></div>
      </div>
    </div>
  </div>
);

// Success feedback component
export const SuccessToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2">
    <div className="flex items-center justify-between">
      <span>{message}</span>
      <button 
        onClick={onClose} 
        className="text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Error feedback component
export const ErrorToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2">
    <div className="flex items-center justify-between">
      <span>{message}</span>
      <button 
        onClick={onClose} 
        className="text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);



// Progress indicator component
export const ProgressIndicator = ({ 
  current, 
  total, 
  label 
}: { 
  current: number; 
  total: number; 
  label: string; 
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-white/80 mb-1">
        <span>{label}</span>
        <span>{current} / {total}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${label}: ${current} of ${total} completed`}
        />
      </div>
    </div>
  );
};

// Loading spinner component
export const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-slate-600 border-t-blue-500 ${sizeClasses[size]}`} />
  );
}; 