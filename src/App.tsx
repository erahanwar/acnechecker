import React, { useState } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { CameraScreen } from './components/CameraScreen';
import { MarkingScreen } from './components/MarkingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SeverityCalculator } from './utils/severityCalculator';
import { AcneAnalysis, AcneLesion, AppStep, LesionCounts } from './types';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('intro');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [analysis, setAnalysis] = useState<AcneAnalysis | null>(null);

  const handleStart = () => {
    console.log('Starting camera...');
    setCurrentStep('camera');
  };

  const handleCapture = (imageData: string) => {
    console.log('Image captured, length:', imageData.length);
    
    if (!imageData || imageData.length < 100) {
      console.error('Invalid image data received');
      alert('Failed to capture image. Please try again.');
      return;
    }

    setCapturedImage(imageData);
    console.log('Transitioning to marking screen...');
    
    // Use setTimeout to ensure state updates complete
    setTimeout(() => {
      setCurrentStep('marking');
    }, 100);
  };

  const handleMarkingComplete = (lesions: AcneLesion[]) => {
    console.log('Marking complete, lesions:', lesions.length);

    const counts: LesionCounts = {
      comedones: lesions.filter(l => l.type === 'comedone').length,
      papules: lesions.filter(l => l.type === 'papule').length,
      pustules: lesions.filter(l => l.type === 'pustule').length,
      nodules: lesions.filter(l => l.type === 'nodule').length,
      total: lesions.length,
      inflammatory: lesions.filter(l => l.type === 'papule' || l.type === 'pustule' || l.type === 'nodule').length
    };

    const severity = SeverityCalculator.calculateSeverity(counts);
    const recommendations = SeverityCalculator.getRecommendations(severity, counts);

    const result: AcneAnalysis = {
      lesions: counts,
      lesionLocations: lesions,
      severity,
      recommendations
    };

    setAnalysis(result);
    setCurrentStep('results');
  };

  const handleRestart = () => {
    console.log('Restarting app...');
    setCurrentStep('intro');
    setCapturedImage('');
    setAnalysis(null);
  };

  const handleBackToCamera = () => {
    console.log('Going back to camera...');
    setCurrentStep('camera');
  };

  const handleBackFromCamera = () => {
    console.log('Going back to intro...');
    setCurrentStep('intro');
  };

  console.log('Current step:', currentStep);
  console.log('Captured image exists:', !!capturedImage);

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {currentStep === 'intro' && <IntroScreen onStart={handleStart} />}
        {currentStep === 'camera' && <CameraScreen onCapture={handleCapture} onBack={handleBackFromCamera} />}
        {currentStep === 'marking' && capturedImage && (
          <MarkingScreen
            capturedImage={capturedImage}
            onComplete={handleMarkingComplete}
            onBack={handleBackToCamera}
          />
        )}
        {currentStep === 'results' && analysis && (
          <ResultsScreen
            analysis={analysis}
            capturedImage={capturedImage}
            onRestart={handleRestart}
          />
        )}
        {currentStep === 'marking' && !capturedImage && (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass rounded-3xl p-8 text-center">
              <p className="text-white text-xl mb-4">No image captured</p>
              <button
                onClick={handleBackToCamera}
                className="glass-strong hover:bg-white/25 transition-all duration-300 rounded-xl py-3 px-6 text-white font-semibold"
              >
                Go Back to Camera
              </button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
