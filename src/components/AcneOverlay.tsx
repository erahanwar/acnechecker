import React, { useEffect, useRef } from 'react';
import { AcneLesion } from '../types';

interface AcneOverlayProps {
  imageUrl: string;
  lesions: AcneLesion[];
  showOverlay: boolean;
}

export const AcneOverlay: React.FC<AcneOverlayProps> = ({ imageUrl, lesions, showOverlay }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawOverlay = () => {
      // Set canvas size to match image
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Draw the image
      ctx.drawImage(image, 0, 0);

      if (!showOverlay) return;

      // Draw lesion markers
      lesions.forEach(lesion => {
        const x = lesion.x * canvas.width;
        const y = lesion.y * canvas.height;
        
        // Calculate marker size based on severity (smaller overall)
        const baseSize = Math.min(canvas.width, canvas.height) * 0.012; // Reduced from 0.015
        const size = baseSize * (0.7 + lesion.severity * 0.6); // Reduced size range

        // Set color based on lesion type with better visibility
        let color: string;
        switch (lesion.type) {
          case 'comedone':
            color = 'rgba(250, 204, 21, 0.75)'; // Yellow - more opaque
            break;
          case 'papule':
            color = 'rgba(251, 146, 60, 0.75)'; // Orange - more opaque
            break;
          case 'pustule':
            color = 'rgba(255, 100, 100, 0.75)'; // Light red - more opaque
            break;
          case 'nodule':
            color = 'rgba(200, 0, 0, 0.8)'; // Dark red - more opaque
            break;
        }

        // Draw outer glow for better visibility
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;

        // Draw filled circle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        // Draw border for definition
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Reset shadow
        ctx.shadowBlur = 0;

        // Add small center dot for precise location
        ctx.beginPath();
        ctx.arc(x, y, size * 0.25, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      });
    };

    if (image.complete) {
      drawOverlay();
    } else {
      image.onload = drawOverlay;
    }
  }, [imageUrl, lesions, showOverlay]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden">
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Captured face"
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-xl"
      />
    </div>
  );
};
