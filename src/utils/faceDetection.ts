import { FaceLandmarks } from '../types';

export class FaceDetector {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;

  initialize(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.video = video;
    this.canvas = canvas;
  }

  async detectFace(): Promise<FaceLandmarks> {
    if (!this.video) {
      return {
        detected: false,
        centered: false,
        tiltAngle: 0,
        confidence: 0
      };
    }

    // Simulate face detection
    const detected = Math.random() > 0.1;
    const centered = detected && Math.random() > 0.3;
    const tiltAngle = (Math.random() - 0.5) * 30;
    const confidence = detected ? Math.random() * 0.3 + 0.7 : 0;

    return {
      detected,
      centered,
      tiltAngle,
      confidence
    };
  }

  drawOvalGuide(canvas: HTMLCanvasElement, isCentered: boolean) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Fixed aspect ratio for human face: 3:4 (width:height)
    // Calculate oval dimensions based on canvas size while maintaining ratio
    const maxWidth = canvas.width * 0.7;
    const maxHeight = canvas.height * 0.85;
    
    // Determine limiting dimension and calculate oval size
    let ovalWidth: number;
    let ovalHeight: number;
    
    if (maxWidth / maxHeight > 3 / 4) {
      // Height is the limiting factor
      ovalHeight = maxHeight;
      ovalWidth = ovalHeight * (3 / 4);
    } else {
      // Width is the limiting factor
      ovalWidth = maxWidth;
      ovalHeight = ovalWidth * (4 / 3);
    }

    const radiusX = ovalWidth / 2;
    const radiusY = ovalHeight / 2;

    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cut out the oval
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Draw oval border
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = isCentered ? 'rgba(34, 197, 94, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw guide lines
    ctx.strokeStyle = isCentered ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(centerX - radiusX, centerY);
    ctx.lineTo(centerX + radiusX, centerY);
    ctx.stroke();

    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radiusY);
    ctx.lineTo(centerX, centerY + radiusY);
    ctx.stroke();

    ctx.setLineDash([]);
  }

  captureOvalRegion(video: HTMLVideoElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Set canvas to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0);

    // Calculate oval dimensions with fixed 3:4 aspect ratio
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const maxWidth = canvas.width * 0.7;
    const maxHeight = canvas.height * 0.85;
    
    let ovalWidth: number;
    let ovalHeight: number;
    
    if (maxWidth / maxHeight > 3 / 4) {
      ovalHeight = maxHeight;
      ovalWidth = ovalHeight * (3 / 4);
    } else {
      ovalWidth = maxWidth;
      ovalHeight = ovalWidth * (4 / 3);
    }

    const radiusX = ovalWidth / 2;
    const radiusY = ovalHeight / 2;

    // Create a new canvas for the cropped oval
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = ovalWidth;
    croppedCanvas.height = ovalHeight;
    const croppedCtx = croppedCanvas.getContext('2d');
    
    if (!croppedCtx) return '';

    // Create oval clipping path
    croppedCtx.beginPath();
    croppedCtx.ellipse(
      ovalWidth / 2,
      ovalHeight / 2,
      radiusX,
      radiusY,
      0,
      0,
      2 * Math.PI
    );
    croppedCtx.clip();

    // Draw the portion of the video that's inside the oval
    croppedCtx.drawImage(
      canvas,
      centerX - radiusX,
      centerY - radiusY,
      ovalWidth,
      ovalHeight,
      0,
      0,
      ovalWidth,
      ovalHeight
    );

    return croppedCanvas.toDataURL('image/jpeg', 0.95);
  }
}
