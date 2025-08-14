import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-2 sm:mb-3 pt-1">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
        Cybersecurity Flashcards
      </h1>
      <p className="text-blue-200 text-sm sm:text-base mb-4 sm:mb-6">Test your knowledge of cybersecurity concepts</p>
    </div>
  );
};

export default Header; 