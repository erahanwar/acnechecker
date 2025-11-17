import React, { useState } from 'react';
import { X, Info, HelpCircle } from 'lucide-react';
import { LesionTypeInfo } from '../types';

interface LesionTypeModalProps {
  lesionTypes: LesionTypeInfo[];
  onSelect: (type: 'comedone' | 'papule' | 'pustule' | 'nodule') => void;
  onClose: () => void;
}

export const LesionTypeModal: React.FC<LesionTypeModalProps> = ({
  lesionTypes,
  onSelect,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showDetailFor, setShowDetailFor] = useState<string | null>(null);

  // Defensive check
  if (!lesionTypes || !Array.isArray(lesionTypes) || lesionTypes.length === 0) {
    console.error('LesionTypeModal: lesionTypes is invalid', lesionTypes);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Error</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100/50 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">Unable to load lesion types. Please try again.</p>
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-gray-200/80 hover:bg-gray-300/80 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleCardClick = (type: 'comedone' | 'papule' | 'pustule' | 'nodule') => {
    setSelectedType(type);
    // Small delay for visual feedback before selection
    setTimeout(() => {
      onSelect(type);
    }, 200);
  };

  const toggleDetail = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetailFor(showDetailFor === type ? null : type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Select Lesion Type</h2>
            <p className="text-sm text-gray-600 mt-1">Tap the image that best matches what you see</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Visual Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lesionTypes.map((lesionType) => (
              <div key={lesionType.type} className="relative">
                {/* Card */}
                <button
                  onClick={() => handleCardClick(lesionType.type)}
                  className={`
                    w-full group relative overflow-hidden rounded-2xl
                    transition-all duration-300 ease-out
                    ${selectedType === lesionType.type 
                      ? 'ring-4 ring-blue-500 scale-105 shadow-2xl' 
                      : 'hover:scale-105 hover:shadow-xl ring-2 ring-gray-200/50 hover:ring-blue-300'
                    }
                  `}
                  aria-label={`Select ${lesionType.name}`}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={lesionType.imageUrls[0]}
                      alt={`${lesionType.name} - ${lesionType.description.split('.')[0]}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Color Indicator */}
                    <div 
                      className="absolute top-3 right-3 w-8 h-8 rounded-full shadow-lg ring-2 ring-white/50"
                      style={{ backgroundColor: lesionType.color }}
                      aria-hidden="true"
                    />

                    {/* Selected Checkmark */}
                    {selectedType === lesionType.type && (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-xl">
                          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Label Section */}
                  <div className="bg-white p-4 text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {lesionType.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {lesionType.description.split('.')[0]}
                    </p>
                  </div>
                </button>

                {/* Info Button */}
                <button
                  onClick={(e) => toggleDetail(lesionType.type, e)}
                  className="absolute bottom-16 right-4 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                  aria-label={`More information about ${lesionType.name}`}
                >
                  <Info className="w-5 h-5 text-blue-600" />
                </button>

                {/* Expandable Detail Panel */}
                {showDetailFor === lesionType.type && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white rounded-xl shadow-2xl border-2 border-blue-200 p-4 animate-slideDown">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm">Description:</h4>
                        <p className="text-xs text-gray-600">{lesionType.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm">Look for:</h4>
                        <ul className="space-y-1">
                          {lesionType.examples?.slice(0, 3).map((example, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={(e) => toggleDetail(lesionType.type, e)}
                        className="w-full py-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Not sure which type?</h4>
                <p className="text-xs text-gray-600">
                  Tap the <Info className="w-3 h-3 inline text-blue-600" /> icon on each card to see detailed descriptions and examples. 
                  Choose the type that most closely matches what you observe.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 p-6">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-gray-200/80 hover:bg-gray-300/80 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
