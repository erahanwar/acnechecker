export interface LesionTypeInfo {
  type: 'comedone' | 'papule' | 'pustule' | 'nodule';
  name: string;
  description: string;
  color: string;
  examples: string[];
  imageUrls: string[];
  imageLabels?: string[];
}

export interface AcneLesion {
  id: string;
  x: number;
  y: number;
  type: 'comedone' | 'papule' | 'pustule' | 'nodule';
  timestamp: number;
}

export interface LesionCounts {
  comedones: number;
  papules: number;
  pustules: number;
  nodules: number;
  total: number;
  inflammatory: number;
}

export interface FaceLandmarks {
  detected: boolean;
  centered: boolean;
  tiltAngle: number;
  confidence: number;
}

export type SeverityLevel = 'mild' | 'moderate' | 'severe';

export type AppStep = 'intro' | 'camera' | 'marking' | 'results';

export interface AcneAnalysis {
  lesions: LesionCounts;
  lesionLocations: AcneLesion[];
  severity: SeverityLevel;
  recommendations: string[];
}
