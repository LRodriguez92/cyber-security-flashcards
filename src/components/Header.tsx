import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-2 sm:mb-3 pt-1 sm:pt-2 lg:pt-3">
      <h1 className="text-4xl font-bold text-white mb-3 sm:mb-4">
        Cybersecurity Flashcards
      </h1>
      <p className="text-blue-200 mb-4 sm:mb-6">Test your knowledge of cybersecurity concepts</p>
    </div>
  );
};

export default Header; 