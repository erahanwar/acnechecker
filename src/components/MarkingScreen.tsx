import React, { useState, useRef, useEffect } from 'react';
import { Check, RotateCcw, Trash2, AlertCircle, ZoomIn } from 'lucide-react';
import { AcneLesion, LesionCounts } from '../types';
import { LesionTypeModal } from './LesionTypeModal';
import { LesionCounter } from './LesionCounter';
import { LESION_TYPES } from '../utils/lesionTypeInfo';

interface MarkingScreenProps {
  capturedImage: string;
  onComplete: (lesions: AcneLesion[]) => void;
  onBack: () => void;
}

export const MarkingScreen: React.FC<MarkingScreenProps> = ({ capturedImage, onComplete, onBack }) => {
  const [lesions, setLesions] = useState<AcneLesion[]>([]);
  const [pendingPosition, setPendingPosition] = useState<{ x: number; y: number } | null>(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedLesionId, setSelectedLesionId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const counts: LesionCounts = {
    comedones: lesions.filter(l => l.type === 'comedone').length,
    papules: lesions.filter(l => l.type === 'papule').length,
    pustules: lesions.filter(l => l.type === 'pustule').length,
    nodules: lesions.filter(l => l.type === 'nodule').length,
    total: lesions.length,
    inflammatory: lesions.filter(l => l.type === 'papule' || l.type === 'pustule' || l.type === 'nodule').length
  };

  useEffect(() => {
    drawCanvas();
  }, [lesions, capturedImage]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image || !image.complete) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.drawImage(image, 0, 0);

    lesions.forEach(lesion => {
      const x = lesion.x * canvas.width;
      const y = lesion.y * canvas.height;
      const lesionInfo = LESION_TYPES.find(t => t.type === lesion.type);
      if (!lesionInfo) return;
      
      const size = Math.min(canvas.width, canvas.height) * 0.02;

      // Outer glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = lesionInfo.color;

      // Main circle
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = lesionInfo.color;
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Center dot
      ctx.beginPath();
      ctx.arc(x, y, size * 0.3, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fill();

      // Selection indicator
      if (lesion.id === selectedLesionId) {
        ctx.beginPath();
        ctx.arc(x, y, size * 1.8, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if clicking on existing lesion
    const clickedLesion = lesions.find(lesion => {
      const lx = lesion.x * canvas.width;
      const ly = lesion.y * canvas.height;
      const size = Math.min(canvas.width, canvas.height) * 0.02;
      const distance = Math.sqrt((x - lx) ** 2 + (y - ly) ** 2);
      return distance <= size * 1.5;
    });

    if (clickedLesion) {
      setSelectedLesionId(clickedLesion.id === selectedLesionId ? null : clickedLesion.id);
    } else {
      // Add new lesion
      setPendingPosition({ x: x / canvas.width, y: y / canvas.height });
      setShowTypeModal(true);
      setSelectedLesionId(null);
    }
  };

  const handleTypeSelect = (type: 'comedone' | 'papule' | 'pustule' | 'nodule') => {
    if (!pendingPosition) return;

    const newLesion: AcneLesion = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      x: pendingPosition.x,
      y: pendingPosition.y,
      timestamp: Date.now()
    };

    setLesions([...lesions, newLesion]);
    setPendingPosition(null);
    setShowTypeModal(false);
  };

  const handleDeleteSelected = () => {
    if (!selectedLesionId) return;
    setLesions(lesions.filter(l => l.id !== selectedLesionId));
    setSelectedLesionId(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all marked lesions?')) {
      setLesions([]);
      setSelectedLesionId(null);
    }
  };

  const handleComplete = () => {
    if (lesions.length === 0) {
      alert('Please mark at least one lesion before completing the assessment.');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmComplete = () => {
    onComplete(lesions);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-3xl p-6 md:p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Mark Your Acne Lesions</h2>
            <p className="text-white/80">Tap on each lesion to mark it, then select its type. You can edit or remove markers anytime.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-light rounded-2xl p-4 mb-4">
                <div ref={containerRef} className="relative rounded-xl overflow-hidden">
                  <img
                    ref={imageRef}
                    src={capturedImage}
                    alt="Captured face"
                    className="hidden"
                    onLoad={drawCanvas}
                  />
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="w-full h-auto cursor-crosshair rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDeleteSelected}
                  disabled={!selectedLesionId}
                  className={`glass-light hover:bg-white/15 transition-all duration-300 rounded-xl py-2 px-4 text-white font-semibold text-sm flex items-center gap-2 ${
                    !selectedLesionId ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>

                <button
                  onClick={handleClearAll}
                  disabled={lesions.length === 0}
                  className={`glass-light hover:bg-white/15 transition-all duration-300 rounded-xl py-2 px-4 text-white font-semibold text-sm flex items-center gap-2 ${
                    lesions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <LesionCounter counts={counts} />

              <div className="glass-light rounded-2xl p-5">
                <h3 className="text-lg font-bold text-white mb-3">Instructions</h3>
                <ol className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">1</span>
                    <span>Tap on each acne lesion in the photo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">2</span>
                    <span>Select the lesion type from the popup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">3</span>
                    <span>Tap existing markers to select/deselect them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">4</span>
                    <span>Use "Delete Selected" to remove mistakes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">5</span>
                    <span>Click "Complete Assessment" when done</span>
                  </li>
                </ol>
              </div>

              <div className="glass-light rounded-xl p-4 border-l-4 border-blue-400">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold mb-1">Tip</p>
                    <p className="text-white/80 text-sm">
                      Mark all visible lesions for the most accurate assessment. Don't worry about being perfect - you can always edit your selections.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onBack}
              className="glass-light hover:bg-white/15 transition-all duration-300 rounded-xl py-3 px-6 text-white font-semibold flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Photo
            </button>
            <button
              onClick={handleComplete}
              disabled={lesions.length === 0}
              className={`flex-1 glass-strong hover:bg-white/25 transition-all duration-300 rounded-xl py-3 px-6 text-white font-semibold flex items-center justify-center gap-2 ${
                lesions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Check className="w-5 h-5" />
              Complete Assessment ({lesions.length} lesions)
            </button>
          </div>
        </div>
      </div>

      {showTypeModal && (
        <LesionTypeModal
          lesionTypes={LESION_TYPES}
          onSelect={handleTypeSelect}
          onClose={() => {
            setShowTypeModal(false);
            setPendingPosition(null);
          }}
        />
      )}

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Confirm Assessment</h3>
            <p className="text-white/80 mb-6">
              You've marked <strong>{lesions.length} lesions</strong>. Are you satisfied with your assessment?
            </p>

            <div className="glass-light rounded-xl p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Comedones:</span>
                  <span className="text-white font-semibold">{counts.comedones}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Papules:</span>
                  <span className="text-white font-semibold">{counts.papules}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Pustules:</span>
                  <span className="text-white font-semibold">{counts.pustules}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Nodules:</span>
                  <span className="text-white font-semibold">{counts.nodules}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 glass-light hover:bg-white/15 transition-all duration-300 rounded-xl py-3 px-6 text-white font-semibold"
              >
                Review Again
              </button>
              <button
                onClick={handleConfirmComplete}
                className="flex-1 glass-strong hover:bg-white/25 transition-all duration-300 rounded-xl py-3 px-6 text-white font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
