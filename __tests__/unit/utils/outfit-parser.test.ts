import { parseOutfitJSON } from '@/utils/outfit-parser';
import { Outfit, ClothingItem } from '@/types/outfit';

describe('parseOutfitJSON', () => {
  const validOutfit = {
    items: [
      {
        name: 'Light Cotton T-Shirt',
        description: 'A breathable cotton t-shirt',
        blurb: 'Perfect for warm weather',
      },
      {
        name: 'Blue Jeans',
        description: 'Classic denim jeans',
        blurb: 'Versatile and comfortable',
      },
    ],
    overallDescription: 'A casual summer outfit',
    warmCoatRecommended: false,
    rainGearRecommended: false,
  };

  describe('Valid JSON parsing', () => {
    it('should parse valid plain JSON', () => {
      // Arrange
      const input = JSON.stringify(validOutfit);

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result).toEqual(validOutfit);
      expect(result.items).toHaveLength(2);
      expect(result.items[0].name).toBe('Light Cotton T-Shirt');
      expect(result.overallDescription).toBe('A casual summer outfit');
      expect(result.warmCoatRecommended).toBe(false);
      expect(result.rainGearRecommended).toBe(false);
    });

    it('should parse JSON with whitespace', () => {
      // Arrange
      const input = `  ${JSON.stringify(validOutfit, null, 2)}  `;

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result).toEqual(validOutfit);
    });

    it('should parse valid outfit with warm coat recommended', () => {
      // Arrange
      const outfit = { ...validOutfit, warmCoatRecommended: true };
      const input = JSON.stringify(outfit);

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result.warmCoatRecommended).toBe(true);
    });

    it('should parse valid outfit with rain gear recommended', () => {
      // Arrange
      const outfit = { ...validOutfit, rainGearRecommended: true };
      const input = JSON.stringify(outfit);

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result.rainGearRecommended).toBe(true);
    });

    it('should parse outfit with empty items array', () => {
      // Arrange
      const outfit = { ...validOutfit, items: [] };
      const input = JSON.stringify(outfit);

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result.items).toEqual([]);
      expect(result.items).toHaveLength(0);
    });

    it('should parse outfit with single item', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [validOutfit.items[0]],
      };
      const input = JSON.stringify(outfit);

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Light Cotton T-Shirt');
    });

    it('should parse outfit with many items', () => {
      // Arrange
      const items = Array(10).fill(validOutfit.items[0]);
      const outfit = { ...validOutfit, items };
      const input = JSON.stringify(outfit);

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result.items).toHaveLength(10);
    });
  });

  describe('Markdown code block handling', () => {
    it('should parse JSON wrapped in markdown code block with json language', () => {
      // Arrange
      const input = '```json\n' + JSON.stringify(validOutfit, null, 2) + '\n```';

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result).toEqual(validOutfit);
    });

    it('should parse JSON wrapped in markdown code block without language', () => {
      // Arrange
      const input = '```\n' + JSON.stringify(validOutfit, null, 2) + '\n```';

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result).toEqual(validOutfit);
    });

    it('should parse JSON wrapped in code block with extra whitespace', () => {
      // Arrange
      const input = '```json   \n  ' + JSON.stringify(validOutfit) + '  \n```';

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result).toEqual(validOutfit);
    });

    it('should parse JSON wrapped in code block with text before and after', () => {
      // Arrange
      const input =
        'Here is your outfit:\n```json\n' +
        JSON.stringify(validOutfit) +
        '\n```\nEnjoy!';

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result).toEqual(validOutfit);
    });
  });

  describe('Invalid JSON errors', () => {
    it('should throw error for invalid JSON syntax', () => {
      // Arrange
      const input = '{ invalid json }';

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Failed to parse JSON');
    });

    it('should throw error for malformed JSON with trailing comma', () => {
      // Arrange
      const input = '{"items": [], "overallDescription": "test",}';

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Failed to parse JSON');
    });

    it('should throw error for empty string', () => {
      // Arrange
      const input = '';

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Failed to parse JSON');
    });

    it('should throw error for plain text', () => {
      // Arrange
      const input = 'This is just plain text';

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Failed to parse JSON');
    });
  });

  describe('Invalid object type errors', () => {
    it('should throw error when parsed JSON is a string', () => {
      // Arrange
      const input = '"just a string"';

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Parsed JSON is not an object');
    });

    it('should throw error when parsed JSON is a number', () => {
      // Arrange
      const input = '123';

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Parsed JSON is not an object');
    });

    it('should throw error when parsed JSON is null', () => {
      // Arrange
      const input = 'null';

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Parsed JSON is not an object');
    });

    it('should throw error when parsed JSON is a boolean', () => {
      // Arrange
      const input = 'true';

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Parsed JSON is not an object');
    });

    it('should throw error when parsed JSON is an array', () => {
      // Arrange
      const input = '[1, 2, 3]';

      // Act & Assert
      // Arrays are typeof 'object' in JavaScript, so this fails at the items check
      expect(() => parseOutfitJSON(input)).toThrow('Missing or invalid "items" array in response');
    });
  });

  describe('Missing required fields errors', () => {
    it('should throw error when items field is missing', () => {
      // Arrange
      const outfit = { ...validOutfit };
      delete (outfit as any).items;
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "items" array in response'
      );
    });

    it('should throw error when overallDescription field is missing', () => {
      // Arrange
      const outfit = { ...validOutfit };
      delete (outfit as any).overallDescription;
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "overallDescription" field in response'
      );
    });

    it('should throw error when warmCoatRecommended field is missing', () => {
      // Arrange
      const outfit = { ...validOutfit };
      delete (outfit as any).warmCoatRecommended;
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "warmCoatRecommended" field in response'
      );
    });

    it('should throw error when rainGearRecommended field is missing', () => {
      // Arrange
      const outfit = { ...validOutfit };
      delete (outfit as any).rainGearRecommended;
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "rainGearRecommended" field in response'
      );
    });
  });

  describe('Invalid field type errors', () => {
    it('should throw error when items is not an array', () => {
      // Arrange
      const outfit = { ...validOutfit, items: 'not an array' };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "items" array in response'
      );
    });

    it('should throw error when items is an object', () => {
      // Arrange
      const outfit = { ...validOutfit, items: {} };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "items" array in response'
      );
    });

    it('should throw error when items is null', () => {
      // Arrange
      const outfit = { ...validOutfit, items: null };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "items" array in response'
      );
    });

    it('should throw error when overallDescription is not a string', () => {
      // Arrange
      const outfit = { ...validOutfit, overallDescription: 123 };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "overallDescription" field in response'
      );
    });

    it('should throw error when overallDescription is null', () => {
      // Arrange
      const outfit = { ...validOutfit, overallDescription: null };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "overallDescription" field in response'
      );
    });

    it('should throw error when warmCoatRecommended is not a boolean', () => {
      // Arrange
      const outfit = { ...validOutfit, warmCoatRecommended: 'true' };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "warmCoatRecommended" field in response'
      );
    });

    it('should throw error when warmCoatRecommended is null', () => {
      // Arrange
      const outfit = { ...validOutfit, warmCoatRecommended: null };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "warmCoatRecommended" field in response'
      );
    });

    it('should throw error when rainGearRecommended is not a boolean', () => {
      // Arrange
      const outfit = { ...validOutfit, rainGearRecommended: 1 };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "rainGearRecommended" field in response'
      );
    });

    it('should throw error when rainGearRecommended is null', () => {
      // Arrange
      const outfit = { ...validOutfit, rainGearRecommended: null };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Missing or invalid "rainGearRecommended" field in response'
      );
    });
  });

  describe('Invalid array items errors', () => {
    it('should throw error when item is not an object', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: ['not an object'],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Item at index 0 is not an object');
    });

    it('should throw error when item is null', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [null],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Item at index 0 is not an object');
    });

    it('should throw error when item is a number', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [123],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Item at index 0 is not an object');
    });

    it('should throw error when multiple items and second item is invalid', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [validOutfit.items[0], 'invalid'],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow('Item at index 1 is not an object');
    });
  });

  describe('Invalid item field errors', () => {
    it('should throw error when item is missing name field', () => {
      // Arrange
      const item = { ...validOutfit.items[0] };
      delete (item as any).name;
      const outfit = {
        ...validOutfit,
        items: [item],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Item at index 0 missing or invalid "name" field'
      );
    });

    it('should throw error when item name is not a string', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [{ ...validOutfit.items[0], name: 123 }],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Item at index 0 missing or invalid "name" field'
      );
    });

    it('should throw error when item name is null', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [{ ...validOutfit.items[0], name: null }],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Item at index 0 missing or invalid "name" field'
      );
    });

    it('should throw error when item is missing description field', () => {
      // Arrange
      const item = { ...validOutfit.items[0] };
      delete (item as any).description;
      const outfit = {
        ...validOutfit,
        items: [item],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Item at index 0 missing or invalid "description" field'
      );
    });

    it('should throw error when item description is not a string', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [{ ...validOutfit.items[0], description: false }],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Item at index 0 missing or invalid "description" field'
      );
    });

    it('should throw error when item description is null', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [{ ...validOutfit.items[0], description: null }],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Item at index 0 missing or invalid "description" field'
      );
    });

    it('should throw error when item is missing blurb field', () => {
      // Arrange
      const item = { ...validOutfit.items[0] };
      delete (item as any).blurb;
      const outfit = {
        ...validOutfit,
        items: [item],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Item at index 0 missing or invalid "blurb" field'
      );
    });

    it('should throw error when item blurb is not a string', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [{ ...validOutfit.items[0], blurb: [] }],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Item at index 0 missing or invalid "blurb" field'
      );
    });

    it('should throw error when item blurb is null', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [{ ...validOutfit.items[0], blurb: null }],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Item at index 0 missing or invalid "blurb" field'
      );
    });

    it('should throw error for second item when first is valid', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [
          validOutfit.items[0],
          { ...validOutfit.items[1], name: undefined },
        ],
      };
      const input = JSON.stringify(outfit);

      // Act & Assert
      expect(() => parseOutfitJSON(input)).toThrow(
        'Item at index 1 missing or invalid "name" field'
      );
    });
  });

  describe('Edge cases', () => {
    it('should accept empty strings for item fields if they are strings', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [
          {
            name: '',
            description: '',
            blurb: '',
          },
        ],
      };
      const input = JSON.stringify(outfit);

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result.items[0].name).toBe('');
      expect(result.items[0].description).toBe('');
      expect(result.items[0].blurb).toBe('');
    });

    it('should accept empty string for overallDescription if it is a string', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        overallDescription: '',
      };
      const input = JSON.stringify(outfit);

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result.overallDescription).toBe('');
    });

    it('should ignore extra fields in the outfit object', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        extraField: 'should be ignored',
      };
      const input = JSON.stringify(outfit);

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result).toEqual(validOutfit);
      expect((result as any).extraField).toBeUndefined();
    });

    it('should ignore extra fields in item objects', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [
          {
            ...validOutfit.items[0],
            extraField: 'should be ignored',
          },
        ],
      };
      const input = JSON.stringify(outfit);

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result.items[0]).toEqual(validOutfit.items[0]);
      expect((result.items[0] as any).extraField).toBeUndefined();
    });

    it('should handle special characters in string fields', () => {
      // Arrange
      const outfit = {
        ...validOutfit,
        items: [
          {
            name: 'T-Shirt with "quotes" and \'apostrophes\'',
            description: 'Description with\nnewlines and\ttabs',
            blurb: 'Blurb with émojis 🎉 and unicode ñ',
          },
        ],
        overallDescription: 'Overall with <html> & special chars',
      };
      const input = JSON.stringify(outfit);

      // Act
      const result = parseOutfitJSON(input);

      // Assert
      expect(result.items[0].name).toBe('T-Shirt with "quotes" and \'apostrophes\'');
      expect(result.items[0].description).toBe('Description with\nnewlines and\ttabs');
      expect(result.items[0].blurb).toBe('Blurb with émojis 🎉 and unicode ñ');
      expect(result.overallDescription).toBe('Overall with <html> & special chars');
    });
  });
});
