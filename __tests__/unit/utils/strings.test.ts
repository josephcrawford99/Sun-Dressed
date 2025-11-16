import { capitalizeAllWords } from '@/utils/strings';

describe('capitalizeAllWords', () => {
  describe('Normal cases', () => {
    it('should capitalize all words in a regular sentence', () => {
      // Arrange
      const input = 'hello world';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('Hello World');
    });

    it('should capitalize all words in a sentence with multiple words', () => {
      // Arrange
      const input = 'the quick brown fox jumps';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('The Quick Brown Fox Jumps');
    });

    it('should handle a single word', () => {
      // Arrange
      const input = 'hello';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('Hello');
    });

    it('should lowercase the rest of the word after first character', () => {
      // Arrange
      const input = 'hELLO wORLD';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('Hello World');
    });

    it('should handle all uppercase words', () => {
      // Arrange
      const input = 'HELLO WORLD';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('Hello World');
    });

    it('should handle mixed case words', () => {
      // Arrange
      const input = 'hElLo WoRlD';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('Hello World');
    });

    it('should handle words with numbers', () => {
      // Arrange
      const input = 'hello 123 world';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('Hello 123 World');
    });

    it('should handle words with special characters', () => {
      // Arrange
      const input = "hello! world's test";

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe("Hello! World's Test");
    });

    it('should handle hyphenated words as single words', () => {
      // Arrange
      const input = 'well-known phrase';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('Well-known Phrase');
    });
  });

  describe('Edge cases with whitespace', () => {
    it('should handle multiple spaces between words', () => {
      // Arrange
      const input = 'hello  world';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('Hello  World');
    });

    it('should handle leading spaces', () => {
      // Arrange
      const input = '  hello world';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('  Hello World');
    });

    it('should handle trailing spaces', () => {
      // Arrange
      const input = 'hello world  ';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('Hello World  ');
    });

    it('should handle leading and trailing spaces', () => {
      // Arrange
      const input = '  hello world  ';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('  Hello World  ');
    });

    it('should handle string with only spaces', () => {
      // Arrange
      const input = '   ';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('   ');
    });
  });

  describe('Edge cases with empty or falsy values', () => {
    it('should return empty string for empty input', () => {
      // Arrange
      const input = '';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('');
    });

    it('should return empty string for null input', () => {
      // Arrange
      const input = null as any;

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('');
    });

    it('should return empty string for undefined input', () => {
      // Arrange
      const input = undefined as any;

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('');
    });
  });

  describe('Special cases', () => {
    it('should handle single character words', () => {
      // Arrange
      const input = 'a b c';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('A B C');
    });

    it('should handle already capitalized words', () => {
      // Arrange
      const input = 'Hello World';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('Hello World');
    });

    it('should handle sentence with punctuation', () => {
      // Arrange
      const input = 'hello, world! how are you?';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('Hello, World! How Are You?');
    });

    it('should handle words starting with numbers', () => {
      // Arrange
      const input = '1st 2nd 3rd';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toBe('1st 2nd 3rd');
    });
  });
});
