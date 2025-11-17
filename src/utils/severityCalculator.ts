import { LesionCounts } from '../types';

export class SeverityCalculator {
  static calculateSeverity(counts: LesionCounts): 'Mild' | 'Moderate' | 'Severe' {
    const { comedones, inflammatory, total, nodules } = counts;

    // Severe criteria (highest priority)
    if (
      nodules > 5 ||
      comedones > 100 ||
      inflammatory > 50 ||
      total > 125
    ) {
      return 'Severe';
    }

    // Moderate criteria
    if (
      (comedones >= 20 && comedones <= 100) ||
      (inflammatory >= 15 && inflammatory <= 50) ||
      (total >= 30 && total <= 125)
    ) {
      return 'Moderate';
    }

    // Mild criteria (default)
    return 'Mild';
  }

  static getRecommendations(severity: 'Mild' | 'Moderate' | 'Severe', counts: LesionCounts): string[] {
    const recommendations: string[] = [];

    switch (severity) {
      case 'Mild':
        recommendations.push(
          'Use over-the-counter topical treatments containing benzoyl peroxide (2.5-5%) or salicylic acid',
          'Maintain a consistent gentle cleansing routine twice daily',
          'Avoid picking or squeezing lesions to prevent scarring',
          'Consider non-comedogenic skincare and makeup products',
          'Monitor your skin for 6-8 weeks; if no improvement, consult a dermatologist'
        );
        break;

      case 'Moderate':
        recommendations.push(
          'Consult a dermatologist for prescription-strength topical treatments (retinoids, antibiotics)',
          'Consider combination therapy with benzoyl peroxide and topical antibiotics',
          'Maintain consistent skincare routine with gentle, non-irritating products',
          'Avoid harsh scrubbing or over-washing, which can worsen inflammation',
          'Discuss oral antibiotic options with your dermatologist if topical treatments are insufficient',
          'Consider professional extraction of comedones by a licensed professional'
        );
        break;

      case 'Severe':
        recommendations.push(
          '⚠️ URGENT: Schedule an appointment with a board-certified dermatologist as soon as possible',
          'Severe acne requires professional medical treatment to prevent permanent scarring',
          'Your dermatologist may recommend oral isotretinoin (Accutane) or hormonal therapy',
          'Do not attempt to treat severe nodular acne with over-the-counter products alone',
          'Avoid picking or manipulating nodules, which can lead to deep scarring and infection',
          'Consider referral to an acne specialist or dermatology clinic for comprehensive treatment',
          'Discuss potential need for oral antibiotics, hormonal treatments, or isotretinoin therapy'
        );
        break;
    }

    // Add specific recommendations based on lesion types
    if (counts.nodules > 0) {
      recommendations.push(
        'Nodular acne requires professional treatment to prevent permanent scarring and cysts'
      );
    }

    if (counts.comedones > 30) {
      recommendations.push(
        'High comedone count suggests need for retinoid therapy to prevent pore blockage'
      );
    }

    return recommendations;
  }

  static getSeverityDescription(severity: 'Mild' | 'Moderate' | 'Severe'): string {
    switch (severity) {
      case 'Mild':
        return 'Your acne is classified as mild. With proper over-the-counter treatment and skincare routine, improvement is typically seen within 6-8 weeks.';
      case 'Moderate':
        return 'Your acne is classified as moderate. Professional dermatological treatment is recommended for optimal results and to prevent scarring.';
      case 'Severe':
        return 'Your acne is classified as severe. Immediate professional medical treatment is strongly recommended to prevent permanent scarring and complications.';
    }
  }
}
