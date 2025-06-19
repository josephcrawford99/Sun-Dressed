import { ClothingItemKey } from '@/constants/clothingItems';

export interface OutfitItem {
  iconKey: ClothingItemKey;
  description: string;
}

export interface Outfit {
  top: OutfitItem;
  bottom?: OutfitItem;
  outerwear?: OutfitItem[];
  accessories?: OutfitItem[];
  shoes: OutfitItem;
  explanation: string;
}