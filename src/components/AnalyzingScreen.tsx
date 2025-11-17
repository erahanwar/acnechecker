import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const AnalyzingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Detecting facial landmarks...',
    'Identifying acne lesions...',
    'Analyzing severity...',
    'Generating recommendations...'
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-8 md:p-12 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 glass-strong rounded-full mb-6 animate-pulse-glow">
            <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Analyzing Your Skin
          </h2>
          <p className="text-lg text-white/80">
            Our AI is processing your image...
          </p>
        </div>

        <div className="space-y-6">
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <p className="text-white font-semibold text-lg">
                {steps[currentStep]}
              </p>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="text-white/60 text-sm mt-3 text-right">
              {progress}% complete
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`glass-light rounded-xl p-4 transition-all ${
                  index <= currentStep ? 'border-2 border-green-400' : 'opacity-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {index < currentStep ? (
                    <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : index === currentStep ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-white/30" />
                  )}
                  <p className="text-white text-sm font-medium">
                    {step.replace('...', '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
