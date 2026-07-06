/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LashStyleType, LashProduct, LashArtist } from './types';

import productsShowcaseImg from './assets/images/lash_products_showcase_1781406369055.jpg';

// Let's reuse our premium generated products showcase image
const PRODUCT_SHOWCASE = productsShowcaseImg;

export const LASH_PRODUCTS: LashProduct[] = [
  {
    id: 'lash_classic',
    name: 'Classic',
    price: 90,
    type: LashStyleType.CLASSIC,
    description: 'Perfect 1:1 extensions applying one individual silk fiber to each healthy natural lash.',
    benefits: ['Subtle, eye-opening daily look', 'Adds elegant length and natural darkness', 'Zero-weight comfort and effortless wear'],
    fullDescription: 'Our signature classic set is designed for those seeking a highly refined, naturally enhanced appearance. We customize length and curl based on your unique eye symmetry, giving the illusion of high-quality mascara on perfectly separated lashes.',
    curlOptions: ['C-Curl (Natural)', 'D-Curl (Dramatic)', 'CC-Curl (Elevated)'],
    lengthOptions: ['9mm', '10mm', '11mm', '12mm', '13mm'],
    thickness: '0.15mm',
    durationMin: 110,
    image: PRODUCT_SHOWCASE,
    serviceOptions: [
      { id: 'full', label: 'Full Set', price: 90 },
      { id: 'refill_1w', label: '1 Week Refill', price: 45 },
      { id: 'refill_2w', label: '2 Weeks Refill', price: 55 },
      { id: 'refill_3w', label: '3 Weeks Refill', price: 70 },
      { id: 'refill_4w', label: '4 Weeks Refill', price: 80 },
    ],
  },
  {
    id: 'lash_hybrid',
    name: 'Hybrid',
    price: 95,
    type: LashStyleType.HYBRID,
    description: 'A textured, dimensional blend of classical extensions and bespoke volume fans.',
    benefits: ['Adds volume to sparse natural lash lines', 'Creates flirty, wispy texture & fullness', 'Highly customizable and versatile'],
    fullDescription: 'Hybrid sets combine the structural definition of classic lashes with the airy fluffiness of volume fans. Perfect for clients with uneven lash beds, it delivers a gorgeous wispy look reminiscent of delicate feathers.',
    curlOptions: ['C-Curl (Natural)', 'D-Curl (Dramatic)', 'L-Curl (Lifting)'],
    lengthOptions: ['10mm', '11mm', '12mm', '13mm', '14mm'],
    thickness: '0.07mm & 0.15mm blend',
    durationMin: 130,
    image: PRODUCT_SHOWCASE,
    serviceOptions: [
      { id: 'full', label: 'Full Set', price: 95 },
      { id: 'refill_1w', label: '1 Week Refill', price: 50 },
      { id: 'refill_2w', label: '2 Weeks Refill', price: 65 },
      { id: 'refill_3w', label: '3 Weeks Refill', price: 75 },
      { id: 'refill_4w', label: '4 Weeks Refill', price: 85 },
    ],
  },
  {
    id: 'lash_wetset',
    name: 'Wet Set',
    price: 95,
    type: LashStyleType.WET_SET,
    description: 'A gloss-finish, high-contrast look resembling wet mascara using closed spikes.',
    benefits: ['Darker, more spikes and definition', 'A modern wispy texture', 'Perfect eyeliner effect with spike accents'],
    fullDescription: 'Wet Set gives a beautiful, glossy look styled after fresh-out-of-the-water lashes. Combining Classic and closed-volume fans, it makes your eye line pop with textured spike layers.',
    curlOptions: ['C-Curl (Natural)', 'D-Curl (Dramatic)', 'L-Curl (Lifting)'],
    lengthOptions: ['10mm', '11mm', '12mm', '13mm', '14mm'],
    thickness: '0.07mm Closed Fans',
    durationMin: 130,
    image: PRODUCT_SHOWCASE,
    serviceOptions: [
      { id: 'full', label: 'Full Set', price: 95 },
      { id: 'refill_1w', label: '1 Week Refill', price: 50 },
      { id: 'refill_2w', label: '2 Weeks Refill', price: 65 },
      { id: 'refill_3w', label: '3 Weeks Refill', price: 75 },
      { id: 'refill_4w', label: '4 Weeks Refill', price: 85 },
    ],
  },
  {
    id: 'lash_volume',
    name: 'Volume',
    price: 105,
    type: LashStyleType.VOLUME,
    description: 'Luxurious handmade 3D-5D fans of lightweight velvet lashes applied to each lash.',
    benefits: ['Full, dense, and fluffy appearance', 'Ideal for special occasions or drama seekers', 'Extremely soft, light, and comfortable'],
    fullDescription: 'Our volume set is crafted using advanced hand-fanning techniques. We layer super-fine, cashmere-soft lash fibers onto your natural strands, creating a dense, velvety framing of the eyes with spectacular, rich thickness.',
    curlOptions: ['CC-Curl (Elevated)', 'D-Curl (Dramatic)', 'M-Curl (Modern Sleek)'],
    lengthOptions: ['10mm', '11mm', '12mm', '13mm', '14mm', '15mm'],
    thickness: '0.06mm',
    durationMin: 150,
    image: PRODUCT_SHOWCASE,
    serviceOptions: [
      { id: 'full', label: 'Full Set', price: 105 },
      { id: 'refill_1w', label: '1 Week Refill', price: 55 },
      { id: 'refill_2w', label: '2 Weeks Refill', price: 70 },
      { id: 'refill_3w', label: '3 Weeks Refill', price: 85 },
      { id: 'refill_4w', label: '4 Weeks Refill', price: 95 },
    ],
  },
];

export const LASH_ARTISTS: LashArtist[] = [
  {
    id: 'artist_mia',
    name: 'Nash',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
    specialty: 'Master of Classic & Hybrid Lash Styling',
    rating: 5.0,
    bio: 'Lead Lash Artist of NashGlam. Nash specializes in bespoke micro-mapping and structural design tailored specifically to your unique eye structures.',
  },
  {
    id: 'artist_sophie',
    name: 'Sophie Laurent',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    specialty: 'Elite Certified Volume & Mega Volume Specialist',
    rating: 5.0,
    bio: 'Sophie is renowned for her precise, handmade Russian-Volume fanning techniques. She focuses on lash health conservation and high-drama velvet designs.',
  },
  {
    id: 'artist_amara',
    name: 'Amara Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    specialty: 'Editorial & Wispy Texture Artistry',
    rating: 4.8,
    bio: 'Amaras work was featured in fashion editorials. She creates organic, textured kim-k inspired lash designs with unique lifting curls.',
  },
];

// Eye Shape mappings for customized styling quiz recommendations
export interface LashRecommendation {
  styleType: LashStyleType;
  curl: string;
  lengthPattern: string;
  lashVibe: string;
  reasonText: string;
  recommendedServiceId: string;
}

export const STYLING_REC_MATRIX: Record<string, Record<string, LashRecommendation>> = {
  // EyeShape -> LashVibe -> Recommendation
  Almond: {
    Natural: {
      styleType: LashStyleType.CLASSIC,
      curl: 'C-Curl',
      lengthPattern: '9mm - 12mm - 10mm (Natural sweep)',
      lashVibe: 'Classic Grace',
      reasonText: 'Almond eyes are universally symmetrical. A classic C-curl sweep highlights your natural cat-eye shape, making it perfect for a subtle lift.',
      recommendedServiceId: 'lash_classic',
    },
    'Flirty Wispy': {
      styleType: LashStyleType.HYBRID,
      curl: 'CC-Curl',
      lengthPattern: '10mm - 13mm - 11mm (Spiky texture)',
      lashVibe: 'Debonair Wispy',
      reasonText: 'An almond eye-shape thrives with wispy luxury texture. Interlocking differing lengths provides a flirty, fluttery dimension that flatters your crease.',
      recommendedServiceId: 'lash_hybrid',
    },
    'Sultry Cat-Eye': {
      styleType: LashStyleType.VOLUME,
      curl: 'L-Curl',
      lengthPattern: '9mm to 14mm (Graduated lash tail)',
      lashVibe: 'Sultry Cleopatra',
      reasonText: 'Cat-eye styling elongates almond eyes. A graduated volume fan extending to a sweeping tail creates a gorgeous, wide-set look.',
      recommendedServiceId: 'lash_volume',
    },
    'Open Doll-Eye': {
      styleType: LashStyleType.VOLUME,
      curl: 'D-Curl',
      lengthPattern: '10mm - 14mm - 10mm (Centered height)',
      lashVibe: 'Regal Doll-Eye',
      reasonText: 'Centering the highest length open-up almond eyes beautifully. This doll-eye volume is incredibly bright and makes your gaze look rounded and starry.',
      recommendedServiceId: 'lash_volume',
    }
  },
  Round: {
    Natural: {
      styleType: LashStyleType.CLASSIC,
      curl: 'C-Curl',
      lengthPattern: '8mm - 11mm - 10mm',
      lashVibe: 'Subtle Elixir',
      reasonText: 'Round eyes are beautiful and bold. To keep them natural without over-rounding, a gentle C-curl offers simple, tailored length.',
      recommendedServiceId: 'lash_classic',
    },
    'Flirty Wispy': {
      styleType: LashStyleType.HYBRID,
      curl: 'C-Curl',
      lengthPattern: '9mm - 12mm - 11mm',
      lashVibe: 'Breeze Accent',
      reasonText: 'A wispy hybrid C-curl texture flatters round eyes, blending volume with natural extensions to provide a captivating, airy look.',
      recommendedServiceId: 'lash_hybrid',
    },
    'Sultry Cat-Eye': {
      styleType: LashStyleType.VOLUME,
      curl: 'L-Curl',
      lengthPattern: '10mm to 15mm (Slanted lift)',
      lashVibe: 'Seductress Sweep',
      reasonText: 'For round eyes, a sleek, less curvy L-curl cat-eye pulls the eye line horizontally, producing an exotic, seductive layout.',
      recommendedServiceId: 'lash_volume',
    },
    'Open Doll-Eye': {
      styleType: LashStyleType.WET_SET,
      curl: 'CC-Curl',
      lengthPattern: '10mm - 14mm - 10mm',
      lashVibe: 'Porcelain Empress',
      reasonText: 'Embrace the magnificent scale of round eyes with a centered high-density Wet Set. This achieves a perfect modern spiky look.',
      recommendedServiceId: 'lash_wetset',
    }
  },
  Hooded: {
    Natural: {
      styleType: LashStyleType.CLASSIC,
      curl: 'L-Curl',
      lengthPattern: '9mm - 12mm - 11mm (Lifting bend)',
      lashVibe: 'Pure Lift',
      reasonText: 'Hooded lids can swallow standard lashes. The L-curl is specifically engineered with a straight base that lifts upright before bending, bypassing the lid effortlessly.',
      recommendedServiceId: 'lash_classic',
    },
    'Flirty Wispy': {
      styleType: LashStyleType.HYBRID,
      curl: 'CC-Curl + L-Curl',
      lengthPattern: '10mm - 13mm - 11mm',
      lashVibe: 'Velvet Horizon',
      reasonText: 'A gorgeous hybrid texture blending sharp lifts ensures extensions map above the folding skin, highlighting a bright, fluffy glance.',
      recommendedServiceId: 'lash_hybrid',
    },
    'Sultry Cat-Eye': {
      styleType: LashStyleType.VOLUME,
      curl: 'L-Curl',
      lengthPattern: '10mm to 14mm',
      lashVibe: 'Angled Wing',
      reasonText: 'The L-curl cat-eye opens the hooded corner instantly, pulling the lash line into a crisp, gorgeous butterfly wing alignment.',
      recommendedServiceId: 'lash_volume',
    },
    'Open Doll-Eye': {
      styleType: LashStyleType.VOLUME,
      curl: 'D-Curl',
      lengthPattern: '11mm - 14mm - 11mm',
      lashVibe: 'Dewy Dreamer',
      reasonText: 'A high-curl centered volume projects extensions well beyond the hooded crease, emphasizing a bold, expressive, and bright-eyed appearance.',
      recommendedServiceId: 'lash_volume',
    }
  },
  Monolid: {
    Natural: {
      styleType: LashStyleType.CLASSIC,
      curl: 'L-Curl',
      lengthPattern: '8mm - 12mm - 10mm',
      lashVibe: 'Prism Pure',
      reasonText: 'Monolids gain spectacular elevation from specialized straight-base L-curls, creating a flattering horizontal accent without scratching the lid.',
      recommendedServiceId: 'lash_classic',
    },
    'Flirty Wispy': {
      styleType: LashStyleType.HYBRID,
      curl: 'D-Curl',
      lengthPattern: '10mm - 13mm - 11mm',
      lashVibe: 'Wispy Mirage',
      reasonText: 'Monolids are beautiful canvases for texture. Lightweight spiky fans build a rich, fluffy depth that mimics an eye crease beautifully.',
      recommendedServiceId: 'lash_hybrid',
    },
    'Sultry Cat-Eye': {
      styleType: LashStyleType.VOLUME,
      curl: 'L-Curl (Graduated)',
      lengthPattern: '9mm to 14mm',
      lashVibe: 'Eclipse Flare',
      reasonText: 'An L-curl cat-eye on monolids elongates the outer profile, providing a sharp and striking winged frame.',
      recommendedServiceId: 'lash_volume',
    },
    'Open Doll-Eye': {
      styleType: LashStyleType.WET_SET,
      curl: 'CC-Curl',
      lengthPattern: '11mm - 14mm - 11mm',
      lashVibe: 'Moonlight Majesty',
      reasonText: 'A magnificent doll-eye Wet Set offers extreme projection, creating maximum contrast and breathtaking depth for monolids.',
      recommendedServiceId: 'lash_wetset',
    }
  }
};
