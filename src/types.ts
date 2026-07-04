/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LashStyleType {
  CLASSIC = 'Classic',
  HYBRID = 'Hybrid',
  WET_SET = 'Wet Set',
  VOLUME = 'Volume',
}

export enum EyeShape {
  ALMOND = 'Almond',
  ROUND = 'Round',
  HOODED = 'Hooded',
  MONOLID = 'Monolid',
}

export enum LashVibe {
  NATURAL = 'Natural',
  WISPY = 'Flirty Wispy',
  CAT_EYE = 'Sultry Cat-Eye',
  DOLL_EYE = 'Open Doll-Eye',
}

export interface ServiceOption {
  id: string;
  label: string;
  price: number;
}

export interface LashProduct {
  id: string;
  name: string;
  price: number;
  type: LashStyleType;
  description: string;
  benefits: string[];
  fullDescription: string;
  curlOptions: string[];
  lengthOptions: string[]; // e.g. ["9mm", "10mm", "11mm", "12mm", "13mm"]
  thickness: string;
  durationMin: number;
  image: string;
  serviceOptions?: ServiceOption[];
}

export interface LashArtist {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  bio: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface CartItem {
  id: string; // unique item id (composite of product + selections)
  product: LashProduct;
  selectedCurl: string;
  selectedLength: string;
  quantity: number;
  isServiceInstance?: boolean; // True if it's an appointment booking
}

export interface Appointment {
  id: string;
  style: LashProduct;
  selectedServiceOption?: ServiceOption;
  artist: LashArtist;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
}
