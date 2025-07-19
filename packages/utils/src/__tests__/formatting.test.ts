import { formatCurrency, formatPhoneNumber, formatCPF } from '../index';

describe('formatting utilities', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      const result1 = formatCurrency(1234.56);
      expect(result1).toContain('R$');
      expect(result1).toContain('1.234,56');

      const result2 = formatCurrency(0);
      expect(result2).toContain('R$');
      expect(result2).toContain('0,00');

      const result3 = formatCurrency(1000000);
      expect(result3).toContain('R$');
      expect(result3).toContain('1.000.000,00');
    });

    it('should handle negative values', () => {
      const result = formatCurrency(-1234.56);
      expect(result).toContain('-R$');
      expect(result).toContain('1.234,56');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format phone numbers correctly', () => {
      expect(formatPhoneNumber('11987654321')).toBe('(11) 98765-4321');
      expect(formatPhoneNumber('1198765432')).toBe('(11) 9876-5432');
    });

    it('should handle invalid input', () => {
      expect(formatPhoneNumber('123')).toBe('123');
      expect(formatPhoneNumber('')).toBe('');
    });
  });

  describe('formatCPF', () => {
    it('should format CPF correctly', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01');
    });

    it('should handle CPF with dots and dashes', () => {
      expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
    });

    it('should handle invalid input', () => {
      expect(formatCPF('123')).toBe('123');
      expect(formatCPF('')).toBe('');
    });
  });
});
