import React from 'react';
import type { Domain } from '../types/flashcard';
import { getDomainColor } from '../utils/colorUtils';

interface DomainFilterProps {
  domains: Domain[];
  selectedDomains: string[];
  onDomainChange: (domainId: string) => void;
}

const DomainFilter: React.FC<DomainFilterProps> = ({ domains, selectedDomains, onDomainChange }) => {
  return (
    <div className="mb-4 sm:mb-8">
      <div className="grid grid-cols-2 gap-2 justify-items-center sm:flex sm:flex-wrap sm:justify-center">
        {domains.map(domain => (
          <button
            key={domain.id}
            onClick={() => onDomainChange(domain.id)}
            className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
              selectedDomains.includes(domain.id)
                ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getDomainColor(domain.color)}`}></span>
            <span className="flex flex-col">
              <span>{domain.name}</span>
              {domain.domainNumber && (
                <span className="text-xs text-gray-400">Domain {domain.domainNumber}</span>
              )}
            </span>
          </button>
        ))}
      </div>
      {selectedDomains.length > 1 && !selectedDomains.includes('all') && (
        <p className="text-sm text-blue-300 mt-2">
          Studying {selectedDomains.length} domains: {selectedDomains.join(', ')}
        </p>
      )}
    </div>
  );
};

export default DomainFilter; 