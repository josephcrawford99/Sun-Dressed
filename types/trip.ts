import { ClothingItem } from '@/constants/clothing-items';

/** A packing list item — extends ClothingItem with trip-specific fields */
export type PackingItem = ClothingItem & {
  /** Number of this item to pack */
  quantity: number;
  /** LLM-generated notes explaining why/how many */
  notes: string;
};

/** The complete LLM-generated trip plan */
export interface TripPlan {
  /** Weather keyword tags for the trip period (e.g., "warm", "rainy", "windy") */
  weatherTags: string[];
  /** Packing list items */
  packingList: PackingItem[];
  /** Overall packing summary/advice */
  packingSummary: string;
}

export type TripStatus = 'past' | 'ongoing' | 'upcoming';

export function getTripStatus(trip: Trip): TripStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(trip.endDate);
  end.setHours(0, 0, 0, 0);
  const start = new Date(trip.startDate);
  start.setHours(0, 0, 0, 0);
  if (end < today) return 'past';
  if (start <= today) return 'ongoing';
  return 'upcoming';
}

/** A saved trip */
export interface Trip {
  /** Unique identifier */
  id: string;
  /** Destination city/location name */
  destination: string;
  /** Trip start date */
  startDate: Date;
  /** Trip end date */
  endDate: Date;
  /** User-entered planned activities */
  activities: string;
  /** LLM-generated trip plan (null before generation) */
  plan: TripPlan | null;
  /** When the trip was created */
  createdAt: Date;
  /** When the plan was last generated */
  planGeneratedAt: Date | null;
}
