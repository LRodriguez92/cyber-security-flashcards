import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-8 pt-4 sm:pt-6 lg:pt-8">
      <h1 className="text-4xl font-bold text-white mb-2">
        Cybersecurity Flashcards
      </h1>
      <p className="text-blue-200">Test your knowledge of cybersecurity concepts</p>
    </div>
  );
};

export default Header; 