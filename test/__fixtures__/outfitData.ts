/**
 * Outfit Data Fixtures - Test data for outfit generation functionality
 */

import { OutfitItem, GeneratedOutfit } from '@/types/Outfit';

export const mockOutfitItems: OutfitItem[] = [
  {
    id: 'item-1',
    category: 'top',
    name: 'Light Cotton T-Shirt',
    description: 'Breathable cotton tee perfect for warm weather',
    color: 'white',
    material: 'cotton',
    isRequired: true,
  },
  {
    id: 'item-2',
    category: 'bottom',
    name: 'Lightweight Chinos',
    description: 'Comfortable casual pants suitable for most occasions',
    color: 'khaki',
    material: 'cotton-blend',
    isRequired: true,
  },
  {
    id: 'item-3',
    category: 'shoes',
    name: 'White Sneakers',
    description: 'Versatile casual footwear for walking',
    color: 'white',
    material: 'leather',
    isRequired: true,
  },
  {
    id: 'item-4',
    category: 'accessory',
    name: 'Sunglasses',
    description: 'UV protection for sunny days',
    color: 'black',
    material: 'plastic',
    isRequired: false,
  },
];

export const mockGeneratedOutfit: GeneratedOutfit = {
  id: 'outfit-1',
  items: mockOutfitItems,
  weatherCondition: 'sunny',
  temperature: 75,
  occasion: 'casual',
  generatedAt: new Date('2025-06-08T12:00:00Z'),
  aiConfidence: 0.85,
};

// Mock AI API responses
export const mockGeminiApiResponse = {
  success: {
    data: {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  items: mockOutfitItems,
                  reasoning: 'Selected comfortable, weather-appropriate clothing for 75°F sunny conditions.',
                }),
              },
            ],
          },
        },
      ],
    },
  },
  error: {
    message: 'AI service temporarily unavailable',
    code: 503,
  },
};

// Different outfit scenarios for comprehensive testing
export const mockOutfitScenarios = {
  business: {
    items: [
      {
        id: 'biz-1',
        category: 'top',
        name: 'Dress Shirt',
        description: 'Professional button-down shirt',
        color: 'blue',
        material: 'cotton',
        isRequired: true,
      },
      {
        id: 'biz-2',
        category: 'bottom',
        name: 'Dress Pants',
        description: 'Formal tailored trousers',
        color: 'navy',
        material: 'wool-blend',
        isRequired: true,
      },
    ],
    occasion: 'business',
  },
  outdoor: {
    items: [
      {
        id: 'out-1',
        category: 'top',
        name: 'Hiking Shirt',
        description: 'Moisture-wicking outdoor shirt',
        color: 'green',
        material: 'synthetic',
        isRequired: true,
      },
      {
        id: 'out-2',
        category: 'bottom',
        name: 'Hiking Pants',
        description: 'Durable outdoor pants',
        color: 'brown',
        material: 'nylon',
        isRequired: true,
      },
    ],
    occasion: 'outdoor',
  },
} as const;

export const createMockOutfitItem = (overrides: Partial<OutfitItem> = {}): OutfitItem => ({
  id: `item-${Date.now()}`,
  category: 'top',
  name: 'Test Item',
  description: 'Test description',
  color: 'blue',
  material: 'cotton',
  isRequired: true,
  ...overrides,
});

export const createMockGeneratedOutfit = (overrides: Partial<GeneratedOutfit> = {}): GeneratedOutfit => ({
  id: `outfit-${Date.now()}`,
  items: [createMockOutfitItem()],
  weatherCondition: 'clear',
  temperature: 70,
  occasion: 'casual',
  generatedAt: new Date(),
  aiConfidence: 0.8,
  ...overrides,
});