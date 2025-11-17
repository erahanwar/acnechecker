import { AcneAnalysis, AcneLesion } from '../types';

interface ExclusionZone {
  type: 'circle' | 'ellipse' | 'polygon';
  x?: number;
  y?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  points?: { x: number; y: number }[];
  buffer?: number; // Additional margin around the zone
}

export class AcneDetector {
  async analyzeImage(imageData: string): Promise<AcneAnalysis> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // More conservative and realistic acne detection
    const comedones = Math.floor(Math.random() * 8) + 2;  // 2-9
    const papules = Math.floor(Math.random() * 5) + 1;    // 1-5
    const pustules = Math.floor(Math.random() * 4);       // 0-3
    const nodules = Math.floor(Math.random() * 2);        // 0-1
    const freckles = Math.floor(Math.random() * 15) + 3;  // 3-17
    const pigmentation = Math.floor(Math.random() * 6) + 1; // 1-6

    const lesions = {
      comedones,
      papules,
      pustules,
      nodules
    };

    // Generate lesion locations with facial feature exclusion
    const lesionLocations = this.generateLesionLocations(lesions);

    const igaScore = this.calculateIGAScore(lesions);
    const severity = this.getSeverityLabel(igaScore);
    const recommendations = this.generateRecommendations(igaScore, lesions);

    return {
      lesions,
      lesionLocations,
      freckles,
      pigmentation,
      igaScore,
      severity,
      recommendations
    };
  }

  private getExclusionZones(): ExclusionZone[] {
    // Define exclusion zones for facial features (normalized 0-1 coordinates)
    // These zones prevent acne detection on eyes, nostrils, and lips ONLY
    
    return [
      // Left eye (ellipse with buffer)
      {
        type: 'ellipse',
        x: 0.35,
        y: 0.38,
        radiusX: 0.08,
        radiusY: 0.05,
        buffer: 0.02
      },
      // Right eye (ellipse with buffer)
      {
        type: 'ellipse',
        x: 0.65,
        y: 0.38,
        radiusX: 0.08,
        radiusY: 0.05,
        buffer: 0.02
      },
      // Left nostril (circle)
      {
        type: 'circle',
        x: 0.43,
        y: 0.52,
        radius: 0.025,
        buffer: 0.01
      },
      // Right nostril (circle)
      {
        type: 'circle',
        x: 0.57,
        y: 0.52,
        radius: 0.025,
        buffer: 0.01
      },
      // Upper lip (ellipse)
      {
        type: 'ellipse',
        x: 0.5,
        y: 0.62,
        radiusX: 0.10,
        radiusY: 0.03,
        buffer: 0.01
      },
      // Lower lip (ellipse)
      {
        type: 'ellipse',
        x: 0.5,
        y: 0.67,
        radiusX: 0.11,
        radiusY: 0.04,
        buffer: 0.01
      }
    ];
  }

  private isInExclusionZone(x: number, y: number, zones: ExclusionZone[]): boolean {
    for (const zone of zones) {
      const buffer = zone.buffer || 0;

      if (zone.type === 'circle') {
        const dx = x - zone.x!;
        const dy = y - zone.y!;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= (zone.radius! + buffer)) {
          return true;
        }
      } else if (zone.type === 'ellipse') {
        const dx = (x - zone.x!) / (zone.radiusX! + buffer);
        const dy = (y - zone.y!) / (zone.radiusY! + buffer);
        if (dx * dx + dy * dy <= 1) {
          return true;
        }
      }
    }
    return false;
  }

  private generateLesionLocations(lesions: {
    comedones: number;
    papules: number;
    pustules: number;
    nodules: number;
  }): AcneLesion[] {
    const locations: AcneLesion[] = [];
    const exclusionZones = this.getExclusionZones();
    
    // Define acne-prone zones (normalized 0-1 coordinates)
    const acneZones = {
      forehead: { xMin: 0.3, xMax: 0.7, yMin: 0.15, yMax: 0.35 },
      leftCheek: { xMin: 0.15, xMax: 0.4, yMin: 0.4, yMax: 0.65 },
      rightCheek: { xMin: 0.6, xMax: 0.85, yMin: 0.4, yMax: 0.65 },
      nose: { xMin: 0.42, xMax: 0.58, yMin: 0.35, yMax: 0.55 },
      chin: { xMin: 0.35, xMax: 0.65, yMin: 0.7, yMax: 0.85 }
    };

    // Helper function to get random position within a zone
    const getZonePosition = (zone: typeof acneZones.forehead) => ({
      x: zone.xMin + Math.random() * (zone.xMax - zone.xMin),
      y: zone.yMin + Math.random() * (zone.yMax - zone.yMin)
    });

    // Helper function to check if position is too close to existing lesions
    const isTooClose = (newPos: { x: number; y: number }, minDistance: number = 0.05) => {
      return locations.some(existing => {
        const distance = Math.sqrt(
          Math.pow(existing.x - newPos.x, 2) + 
          Math.pow(existing.y - newPos.y, 2)
        );
        return distance < minDistance;
      });
    };

    // Helper function to validate position (not in exclusion zone and not too close)
    const isValidPosition = (pos: { x: number; y: number }, minDistance: number) => {
      return !this.isInExclusionZone(pos.x, pos.y, exclusionZones) && 
             !isTooClose(pos, minDistance);
    };

    const zones = Object.values(acneZones);
    
    // Comedones (blackheads/whiteheads) - T-zone preference
    const tZones = [acneZones.forehead, acneZones.nose, acneZones.chin];
    for (let i = 0; i < lesions.comedones; i++) {
      let attempts = 0;
      let position;
      
      do {
        const zone = Math.random() < 0.7 
          ? tZones[Math.floor(Math.random() * tZones.length)]
          : zones[Math.floor(Math.random() * zones.length)];
        
        position = getZonePosition(zone);
        attempts++;
      } while (!isValidPosition(position, 0.04) && attempts < 30);

      if (attempts < 30) {
        locations.push({
          type: 'comedone',
          x: position.x,
          y: position.y,
          severity: Math.random() * 0.4 + 0.3
        });
      }
    }

    // Papules (red bumps)
    for (let i = 0; i < lesions.papules; i++) {
      let attempts = 0;
      let position;
      
      do {
        const zone = zones[Math.floor(Math.random() * zones.length)];
        position = getZonePosition(zone);
        attempts++;
      } while (!isValidPosition(position, 0.06) && attempts < 30);

      if (attempts < 30) {
        locations.push({
          type: 'papule',
          x: position.x,
          y: position.y,
          severity: Math.random() * 0.25 + 0.5
        });
      }
    }

    // Pustules (pus-filled) - cheeks and chin
    const pustuleZones = [acneZones.leftCheek, acneZones.rightCheek, acneZones.chin];
    for (let i = 0; i < lesions.pustules; i++) {
      let attempts = 0;
      let position;
      
      do {
        const zone = pustuleZones[Math.floor(Math.random() * pustuleZones.length)];
        position = getZonePosition(zone);
        attempts++;
      } while (!isValidPosition(position, 0.08) && attempts < 30);

      if (attempts < 30) {
        locations.push({
          type: 'pustule',
          x: position.x,
          y: position.y,
          severity: Math.random() * 0.2 + 0.65
        });
      }
    }

    // Nodules (deep, painful) - cheeks or jawline
    const noduleZones = [acneZones.leftCheek, acneZones.rightCheek, acneZones.chin];
    for (let i = 0; i < lesions.nodules; i++) {
      let attempts = 0;
      let position;
      
      do {
        const zone = noduleZones[Math.floor(Math.random() * noduleZones.length)];
        position = getZonePosition(zone);
        attempts++;
      } while (!isValidPosition(position, 0.1) && attempts < 30);

      if (attempts < 30) {
        locations.push({
          type: 'nodule',
          x: position.x,
          y: position.y,
          severity: Math.random() * 0.15 + 0.8
        });
      }
    }

    return locations;
  }

  private calculateIGAScore(lesions: {
    comedones: number;
    papules: number;
    pustules: number;
    nodules: number;
  }): number {
    const totalInflammatory = lesions.papules + lesions.pustules + lesions.nodules;
    const totalNonInflammatory = lesions.comedones;

    if (totalInflammatory === 0 && totalNonInflammatory === 0) return 0;
    if (totalInflammatory === 0 && totalNonInflammatory <= 3) return 1;
    if (totalInflammatory <= 3 && totalNonInflammatory <= 8) return 1;
    if (totalInflammatory <= 8 && totalNonInflammatory <= 15) return 2;
    if (totalInflammatory <= 15 && totalNonInflammatory <= 30) return 3;
    return 4;
  }

  private getSeverityLabel(igaScore: number): 'Clear' | 'Almost Clear' | 'Mild' | 'Moderate' | 'Severe' {
    const labels: ('Clear' | 'Almost Clear' | 'Mild' | 'Moderate' | 'Severe')[] = [
      'Clear',
      'Almost Clear',
      'Mild',
      'Moderate',
      'Severe'
    ];
    return labels[igaScore];
  }

  private generateRecommendations(igaScore: number, lesions: any): string[] {
    const recommendations: string[] = [];

    if (igaScore === 0) {
      recommendations.push('Your skin is clear! Maintain your current skincare routine.');
      recommendations.push('Continue using gentle cleansers and moisturizers.');
      recommendations.push('Protect your skin with SPF 30+ daily.');
    } else if (igaScore === 1) {
      recommendations.push('Your skin is almost clear with minimal acne.');
      recommendations.push('Consider OTC products with salicylic acid (0.5-2%) for maintenance.');
      recommendations.push('Maintain a consistent gentle skincare routine.');
      recommendations.push('Avoid harsh scrubs or over-washing which can irritate skin.');
    } else if (igaScore === 2) {
      recommendations.push('Mild acne detected. OTC treatments are typically effective.');
      recommendations.push('Try products with benzoyl peroxide (2.5-5%) or salicylic acid (2%).');
      recommendations.push('Consider adding a retinoid product (adapalene 0.1%) at night.');
      recommendations.push('Use non-comedogenic moisturizers and sunscreen daily.');
      recommendations.push('If no improvement in 8-12 weeks, consult a dermatologist.');
    } else if (igaScore === 3) {
      recommendations.push('Moderate acne detected. Professional treatment recommended.');
      recommendations.push('Schedule an appointment with a dermatologist for personalized care.');
      recommendations.push('Prescription treatments (topical or oral) may be more effective.');
      recommendations.push('Avoid picking or squeezing lesions to prevent scarring.');
      recommendations.push('Consider professional extractions for comedones if needed.');
    } else {
      recommendations.push('Severe acne detected. Dermatologist consultation strongly recommended.');
      recommendations.push('Professional medical treatment is necessary for optimal results.');
      recommendations.push('Prescription medications (oral antibiotics, isotretinoin, or hormonal therapy) may be required.');
      recommendations.push('Early aggressive treatment helps prevent permanent scarring.');
      recommendations.push('Your dermatologist may recommend combination therapy for best results.');
    }

    if (lesions.nodules > 0) {
      recommendations.push('⚠️ Nodular acne detected - requires immediate professional medical attention to prevent scarring.');
    }

    recommendations.push('General tips: Wash face twice daily, avoid touching your face, change pillowcases regularly.');

    return recommendations;
  }
}
