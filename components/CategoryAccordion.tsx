
import React, { useState } from 'react';
import { ReportCategory, ReportItem as ReportItemType, ReportItemStatus } from '../types';
import ProgressBar from './ProgressBar';
import { CheckIcon, WarningIcon, ErrorIcon, InfoIcon, ChevronDownIcon } from './icons';

const StatusIcon: React.FC<{ status: ReportItemStatus }> = ({ status }) => {
  switch (status) {
    case 'pass': return <CheckIcon />;
    case 'warn': return <WarningIcon />;
    case 'fail': return <ErrorIcon />;
    default: return null;
  }
};

const ReportItem: React.FC<{ item: ReportItemType }> = ({ item }) => (
  <div className="flex items-start justify-between py-3 border-b border-gray-700 last:border-b-0">
    <div className="flex items-center">
      <StatusIcon status={item.status} />
      <div className="ml-4">
        <p className="font-semibold text-gray-200">{item.name}</p>
        <p className="text-sm text-gray-400">{item.description}</p>
      </div>
    </div>
    <div className="relative group">
      <InfoIcon />
      <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <p className="text-sm text-gray-300">{item.guidance}</p>
      </div>
    </div>
  </div>
);

const CategoryAccordion: React.FC<{ category: ReportCategory, initialOpen?: boolean }> = ({ category, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="bg-gray-800 rounded-lg mb-4 overflow-hidden shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center text-left bg-gray-700 hover:bg-gray-600 transition-colors"
      >
        <div>
          <h3 className="text-lg font-bold text-white">{category.title}</h3>
          <span className="text-sm text-gray-400">Score: {category.score}%</span>
        </div>
        <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />
      </button>
      {isOpen && (
        <div className="p-4">
          <ProgressBar score={category.score} label="Category Score" />
          <div className="mt-4">
            {category.items.map(item => (
              <ReportItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAccordion;
