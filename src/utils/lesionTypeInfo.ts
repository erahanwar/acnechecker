import { LesionTypeInfo } from '../types';

export const LESION_TYPES: LesionTypeInfo[] = [
  {
    type: 'comedone',
    name: 'Comedones',
    description: 'Non-inflammatory lesions including blackheads (open comedones) and whiteheads (closed comedones). These are clogged pores without redness or swelling.',
    color: 'rgb(250, 204, 21)',
    examples: [
      'Small black dots on nose, chin, or forehead',
      'Tiny white bumps under the skin',
      'Visible enlarged pores with dark centers',
      'Small flesh-colored bumps'
    ],
    imageUrls: [
      'https://cdn.chatandbuild.com/users/6844d462a59d4b7ba8993c11/image-1763355146492-367521653-1763355146491-925300313.png',
      'https://cdn.chatandbuild.com/users/6844d462a59d4b7ba8993c11/image-1763355168319-373442839-1763355168319-473055079.png'
    ],
    imageLabels: ['Blackhead', 'Whitehead']
  },
  {
    type: 'papule',
    name: 'Papules',
    description: 'Small, red, raised bumps without a visible center or pus. These are inflammatory lesions that are tender to touch but do not contain fluid.',
    color: 'rgb(251, 146, 60)',
    examples: [
      'Small red bumps (2-5mm)',
      'Tender or slightly painful when touched',
      'No visible white or yellow center',
      'Firm to the touch'
    ],
    imageUrls: [
      'https://cdn.chatandbuild.com/users/6844d462a59d4b7ba8993c11/papules-1763362208479-991028881-1763362208478-636074917.jpg'
    ],
    imageLabels: ['Papules - Inflammatory Acne Without Pus']
  },
  {
    type: 'pustule',
    name: 'Pustules',
    description: 'Inflamed lesions with a visible white or yellow center filled with pus. Similar to papules but with a fluid-filled head.',
    color: 'rgb(255, 100, 100)',
    examples: [
      'Red bumps with white or yellow center',
      'Pus-filled head that may be ready to drain',
      'Surrounded by red, inflamed skin',
      'May be painful or tender'
    ],
    imageUrls: [
      'https://cdn.chatandbuild.com/users/6844d462a59d4b7ba8993c11/pustules-1763362222924-714122330-1763362222923-489827756.jpg'
    ],
    imageLabels: ['Pustules - Inflammatory Acne With Pus-Filled Centers']
  },
  {
    type: 'nodule',
    name: 'Nodules',
    description: 'Large, deep, painful lesions that extend into deeper skin layers. These are severe inflammatory lesions that often feel hard and may not have a visible head.',
    color: 'rgb(200, 0, 0)',
    examples: [
      'Large bumps (>5mm) deep under the skin',
      'Very painful or tender',
      'Hard to the touch',
      'May not have a visible head or opening',
      'Can last for weeks or months'
    ],
    imageUrls: [
      'https://cdn.chatandbuild.com/users/6844d462a59d4b7ba8993c11/image-1763355792034-711096122-1763355792033-846744393.png'
    ],
    imageLabels: ['Nodular Acne']
  }
];

export function getLesionTypeInfo(type: 'comedone' | 'papule' | 'pustule' | 'nodule'): LesionTypeInfo | undefined {
  return LESION_TYPES.find(t => t.type === type);
}
