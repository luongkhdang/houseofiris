import React from 'react';

interface ProgressIndicatorProps {
  total: number;
  currentIndex: number;
  onChange: (index: number) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ total, currentIndex, onChange }) => {
  return (
    <div className="flex justify-center mt-4 space-x-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full cursor-pointer ${
            index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onClick={() => onChange(index)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onChange(index);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={index === currentIndex ? 'Current photo' : `Go to photo ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;
