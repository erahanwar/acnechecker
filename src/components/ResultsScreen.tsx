import React, { useState } from 'react';
import { AlertCircle, Info, RotateCcw, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { AcneAnalysis } from '../types';
import { AcneOverlay } from './AcneOverlay';
import { SeverityCalculator } from '../utils/severityCalculator';

interface ResultsScreenProps {
  analysis: AcneAnalysis;
  capturedImage: string;
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ analysis, capturedImage, onRestart }) => {
  const [showOverlay, setShowOverlay] = useState(true);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild': return 'text-green-400';
      case 'Moderate': return 'text-orange-400';
      case 'Severe': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'Mild': return 'bg-green-400/20 border-green-400';
      case 'Moderate': return 'bg-orange-400/20 border-orange-400';
      case 'Severe': return 'bg-red-400/20 border-red-400';
      default: return 'bg-white/20 border-white';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-3xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-white" />
            <h2 className="text-3xl font-bold text-white">Your Assessment Results</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="glass-light rounded-2xl p-6">
              <div className="mb-4">
                <button
                  onClick={() => setShowOverlay(!showOverlay)}
                  className="glass-strong hover:bg-white/25 transition-all duration-300 rounded-xl py-2 px-4 text-white font-semibold text-sm flex items-center gap-2 mb-3"
                >
                  {showOverlay ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide Markers
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Show Markers
                    </>
                  )}
                </button>
              </div>
              
              <AcneOverlay
                imageUrl={capturedImage}
                lesions={analysis.lesionLocations}
                showOverlay={showOverlay}
              />
              
              <div className="mt-4">
                <p className="text-white/60 text-sm text-center">
                  {showOverlay ? `${analysis.lesions.total} lesions marked` : 'Original captured image'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`glass-strong rounded-2xl p-6 border-2 ${getSeverityBgColor(analysis.severity)}`}>
                <p className="text-white/80 text-sm mb-2">Severity Classification</p>
                <p className={`text-4xl font-bold ${getSeverityColor(analysis.severity)} mb-3`}>
                  {analysis.severity}
                </p>
                <p className="text-white/70 text-sm">
                  {SeverityCalculator.getSeverityDescription(analysis.severity)}
                </p>
              </div>

              <div className="glass-light rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Your Lesion Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span className="text-white/80">Comedones</span>
                    </div>
                    <span className="text-white font-semibold text-lg">{analysis.lesions.comedones}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                      <span className="text-white/80">Papules</span>
                    </div>
                    <span className="text-white font-semibold text-lg">{analysis.lesions.papules}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(255, 100, 100)' }}></div>
                      <span className="text-white/80">Pustules</span>
                    </div>
                    <span className="text-white font-semibold text-lg">{analysis.lesions.pustules}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(200, 0, 0)' }}></div>
                      <span className="text-white/80">Nodules</span>
                    </div>
                    <span className="text-white font-semibold text-lg">{analysis.lesions.nodules}</span>
                  </div>
                  <div className="pt-3 border-t border-white/20">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total Lesions</span>
                      <span className="text-white font-bold text-2xl">{analysis.lesions.total}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-white/70 text-sm">Inflammatory</span>
                      <span className="text-white/90 font-semibold">{analysis.lesions.inflammatory}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-light rounded-2xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Personalized Recommendations
            </h3>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-white/90">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-light rounded-xl p-4 mb-6 border-l-4 border-red-400">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold mb-1">Important Medical Disclaimer</p>
                <p className="text-white/80 text-sm mb-2">
                  This self-assessment is for <strong>informational and educational purposes only</strong>. 
                  It does not constitute medical advice, diagnosis, or treatment.
                </p>
                <p className="text-white/80 text-sm mb-2">
                  The accuracy of this assessment depends on your ability to correctly identify and 
                  categorize acne lesions. Self-assessment may not capture all clinical factors that 
                  a dermatologist would consider.
                </p>
                <p className="text-white/80 text-sm">
                  <strong>Always consult a board-certified dermatologist</strong> for professional 
                  medical advice, accurate diagnosis, and appropriate treatment recommendations for 
                  your specific skin condition.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onRestart}
              className="glass-light hover:bg-white/15 transition-all duration-300 rounded-xl py-3 px-8 text-white font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              New Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
