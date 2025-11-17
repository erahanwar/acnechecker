import React from 'react';
import { Camera, CheckCircle, TrendingUp, Shield } from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-8 md:p-12 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-strong mb-6">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Acne Self-Assessment
          </h1>
          <p className="text-xl text-white/80">
            Interactive tool to help you understand your acne severity
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">1. Capture Your Photo</h3>
                <p className="text-white/70 text-sm">
                  Take a clear selfie with your face centered in the oval frame
                </p>
              </div>
            </div>
          </div>

          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">2. Mark Your Lesions</h3>
                <p className="text-white/70 text-sm">
                  Tap on each acne lesion and categorize it (comedones, papules, pustules, or nodules)
                </p>
              </div>
            </div>
          </div>

          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">3. Get Your Results</h3>
                <p className="text-white/70 text-sm">
                  Receive severity classification and personalized recommendations
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-light rounded-xl p-4 mb-6 border-l-4 border-blue-400">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold mb-1">Privacy First</p>
              <p className="text-white/80 text-sm">
                All processing happens on your device. Your photos are never uploaded or stored.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full glass-strong hover:bg-white/25 transition-all duration-300 rounded-xl py-4 px-8 text-white font-semibold text-lg flex items-center justify-center gap-3"
        >
          <Camera className="w-6 h-6" />
          Start Assessment
        </button>

        <p className="text-white/60 text-xs text-center mt-6">
          This tool is for educational purposes only and does not replace professional medical advice.
          Always consult a dermatologist for diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};
