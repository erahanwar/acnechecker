import React, { useRef, useEffect, useState } from 'react';
import { Camera, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { FaceDetector } from '../utils/faceDetection';
import { FaceLandmarks } from '../types';

interface CameraScreenProps {
  onCapture: (imageData: string) => void;
  onBack: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [faceLandmarks, setFaceLandmarks] = useState<FaceLandmarks>({
    detected: false,
    centered: false,
    tiltAngle: 0,
    confidence: 0
  });
  const [error, setError] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const faceDetectorRef = useRef<FaceDetector>(new FaceDetector());

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current && overlayCanvasRef.current) {
      const detector = faceDetectorRef.current;
      detector.initialize(videoRef.current, overlayCanvasRef.current);
      
      const interval = setInterval(async () => {
        const landmarks = await detector.detectFace();
        setFaceLandmarks(landmarks);
        
        if (overlayCanvasRef.current) {
          detector.drawOvalGuide(overlayCanvasRef.current, landmarks.centered);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please grant camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !faceLandmarks.detected) {
      setError('Please ensure your face is detected before capturing.');
      return;
    }

    if (!faceLandmarks.centered) {
      setError('Please center your face within the oval frame.');
      return;
    }

    setIsCapturing(true);
    
    setTimeout(() => {
      if (videoRef.current) {
        const detector = faceDetectorRef.current;
        const imageData = detector.captureOvalRegion(videoRef.current);
        stopCamera();
        onCapture(imageData);
      }
    }, 500);
  };

  const handleVideoLoad = () => {
    if (videoRef.current && overlayCanvasRef.current) {
      overlayCanvasRef.current.width = videoRef.current.videoWidth;
      overlayCanvasRef.current.height = videoRef.current.videoHeight;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-6 md:p-8 max-w-4xl w-full">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Position Your Face</h2>
          <p className="text-white/80">Align your face within the oval frame for best results</p>
        </div>

        <div className="relative mb-6 rounded-2xl overflow-hidden glass-light">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={handleVideoLoad}
            className="w-full h-auto"
          />
          <canvas
            ref={overlayCanvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {error && (
          <div className="glass-light rounded-xl p-4 mb-6 flex items-center gap-3 border-l-4 border-red-400">
            <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
            <p className="text-white/90">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`glass-light rounded-xl p-4 transition-all ${faceLandmarks.detected ? 'border-2 border-green-400' : ''}`}>
            <div className="flex items-center gap-3">
              {faceLandmarks.detected ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-white/50" />
              )}
              <div>
                <p className="text-white font-semibold">Face Detected</p>
                <p className="text-white/60 text-sm">
                  {faceLandmarks.detected ? 'Ready' : 'Looking...'}
                </p>
              </div>
            </div>
          </div>

          <div className={`glass-light rounded-xl p-4 transition-all ${faceLandmarks.centered ? 'border-2 border-green-400' : ''}`}>
            <div className="flex items-center gap-3">
              {faceLandmarks.centered ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-white/50" />
              )}
              <div>
                <p className="text-white font-semibold">Centered</p>
                <p className="text-white/60 text-sm">
                  {faceLandmarks.centered ? 'Perfect' : 'Adjust position'}
                </p>
              </div>
            </div>
          </div>

          <div className={`glass-light rounded-xl p-4 transition-all ${Math.abs(faceLandmarks.tiltAngle) < 10 ? 'border-2 border-green-400' : ''}`}>
            <div className="flex items-center gap-3">
              {Math.abs(faceLandmarks.tiltAngle) < 10 ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-white/50" />
              )}
              <div>
                <p className="text-white font-semibold">Angle</p>
                <p className="text-white/60 text-sm">
                  {Math.abs(faceLandmarks.tiltAngle) < 10 ? 'Good' : 'Straighten head'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="glass-light hover:bg-white/15 transition-all duration-300 rounded-xl py-3 px-6 text-white font-semibold flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handleCapture}
            disabled={!faceLandmarks.centered || isCapturing}
            className={`flex-1 glass-strong hover:bg-white/25 transition-all duration-300 rounded-xl py-3 px-6 text-white font-semibold flex items-center justify-center gap-2 ${
              !faceLandmarks.centered || isCapturing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Camera className="w-5 h-5" />
            {isCapturing ? 'Capturing...' : 'Capture Photo'}
          </button>
        </div>
      </div>
    </div>
  );
};
