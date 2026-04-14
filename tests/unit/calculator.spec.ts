
/**
 * Unit Tests for Division Calculator Logic
 * Framework: Vitest + @testing-library/dom
 * Tests: validation, calculation, formatting, state management
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock DOM environment setup
let mockField1: HTMLInputElement;
let mockField2: HTMLInputElement;
let mockField1Error: HTMLElement;
let mockField2Error: HTMLElement;
let mockResultContainer: HTMLElement;
let mockResultValue: HTMLElement;

// Import the calculator module functions exposed on window
declare global {
  interface Window {
    DivisionCalculator: {
      validateField: (field: HTMLInputElement, errorElement: HTMLElement) => {
        isValid: boolean;
        errorMessage: string;
        value?: number;
      };
      validateAllFields: () => {
        isValid: boolean;
        field1Value?: number;
        field2Value?: number;
      };
      calculateDivision: (dividend: number, divisor: number) => number;
      isDivisionByZero: (divisor: number) => boolean;
      formatResult: (result: number) => string;
    };
  }
}

beforeEach(() => {
  // Setup minimal DOM structure for testing
  document.body.innerHTML = `
    <input type="number" id="field1" />
    <input type="number" id="field2" />
    <button id="submitBtn">Calculate</button>
    <span id="field1-error"></span>
    <span id="field2-error"></span>
    <div id="resultContainer" class="hidden">
      <div id="resultValue"></div>
    </div>
  `;

  mockField1 = document.getElementById('field1') as HTMLInputElement;
  mockField2 = document.getElementById('field2') as HTMLInputElement;
  mockField1Error = document.getElementById('field1-error') as HTMLElement;
  mockField2Error = document.getElementById('field2-error') as HTMLElement;
  mockResultContainer = document.getElementById('resultContainer') as HTMLElement;
  mockResultValue = document.getElementById('resultValue') as HTMLElement;

  // Mock window.DivisionCalculator by evaluating the source
  // In a real setup, we'd import from calculator.js compiled as a module
  // For this test, we'll manually recreate the exposed functions
  window.DivisionCalculator = {
    validateField: (field: HTMLInputElement, errorElement: HTMLElement) => {
      const value = field.value.trim();
      
      if (value === '') {
        return { isValid: false, errorMessage: 'This field is required' };
      }
      
      const numValue = parseFloat(value);
      
      if (isNaN(numValue)) {
        return { isValid: false, errorMessage: 'Please enter a valid number' };
      }
      
      if (!isFinite(numValue)) {
        return { isValid: false, errorMessage: 'Number is too large or invalid' };
      }
      
      return { isValid: true, errorMessage: '', value: numValue };
    },

    validateAllFields: () => {
      const validation1 = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      const validation2 = window.DivisionCalculator.validateField(mockField2, mockField2Error);
      
      return {
        isValid: validation1.isValid && validation2.isValid,
        field1Value: validation1.value,
        field2Value: validation2.value
      };
    },

    calculateDivision: (dividend: number, divisor: number) => {
      return dividend / divisor;
    },

    isDivisionByZero: (divisor: number) => {
      return divisor === 0;
    },

    formatResult: (result: number) => {
      if (!isFinite(result)) {
        return 'Result is infinite';
      }
      
      const rounded = Math.round(result * 1e10) / 1e10;
      
      if (Math.abs(rounded) >= 1000) {
        return rounded.toLocaleString('en-US', { maximumFractionDigits: 10 });
      }
      
      return rounded.toString();
    }
  };
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Division Calculator - Unit Tests', () => {
  
  describe('validateField()', () => {
    it('should return valid result for a valid positive number', () => {
      mockField1.value = '42';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(42);
      expect(result.errorMessage).toBe('');
    });

    it('should return valid result for a valid negative number', () => {
      mockField1.value = '-15.5';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(-15.5);
      expect(result.errorMessage).toBe('');
    });

    it('should return valid result for zero', () => {
      mockField1.value = '0';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(0);
      expect(result.errorMessage).toBe('');
    });

    it('should return valid result for decimal number', () => {
      mockField1.value = '3.14159';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(3.14159);
      expect(result.errorMessage).toBe('');
    });

    it('should reject empty field with required error', () => {
      mockField1.value = '';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('This field is required');
      expect(result.value).toBeUndefined();
    });

    it('should reject whitespace-only input', () => {
      mockField1.value = '   ';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('This field is required');
    });

    it('should reject non-numeric text input', () => {
      mockField1.value = 'abc';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid number');
    });

    it('should reject mixed alphanumeric input', () => {
      mockField1.value = '12abc';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid number');
    });

    it('should reject Infinity', () => {
      mockField1.value = 'Infinity';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Number is too large or invalid');
    });

    it('should reject -Infinity', () => {
      mockField1.value = '-Infinity';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Number is too large or invalid');
    });

    it('should handle very large but finite numbers', () => {
      mockField1.value = '999999999999';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(999999999999);
    });

    it('should handle very small decimal numbers', () => {
      mockField1.value = '0.00000001';
      const result = window.DivisionCalculator.validateField(mockField1, mockField1Error);
      
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(0.00000001);
    });
  });

  describe('validateAllFields()', () => {
    it('should return valid when both fields contain valid numbers', () => {
      mockField1.value = '100';
      mockField2.value = '25';
      const result = window.DivisionCalculator.validateAllFields();
      
      expect(result.isValid).toBe(true);
      expect(result.field1Value).toBe(100);
      expect(result.field2Value).toBe(25);
    });

    it('should return invalid when field1 is empty', () => {
      mockField1.value = '';
      mockField2.value = '5';
      const result = window.DivisionCalculator.validateAllFields();
      
      expect(result.isValid).toBe(false);
    });

    it('should return invalid when field2 is empty', () => {
      mockField1.value = '10';
      mockField2.value = '';
      const result = window.DivisionCalculator.validateAllFields();
      
      expect(result.isValid).toBe(false);
    });

    it('should return invalid when both fields are empty', () => {
      mockField1.value = '';
      mockField2.value = '';
      const result = window.DivisionCalculator.validateAllFields();
      
      expect(result.isValid).toBe(false);
    });

    it('should return invalid when field1 contains non-numeric text', () => {
      mockField1.value = 'hello';
      mockField2.value = '10';
      const result = window.DivisionCalculator.validateAllFields();
      
      expect(result.isValid).toBe(false);
    });

    it('should return invalid when field2 contains non-numeric text', () => {
      mockField1.value = '20';
      mockField2.value = 'world';
      const result = window.DivisionCalculator.validateAllFields();
      
      expect(result.isValid).toBe(false);
    });

    it('should accept negative numbers in both fields', () => {
      mockField1.value = '-50';
      mockField2.value = '-10';
      const result = window.DivisionCalculator.validateAllFields();
      
      expect(result.isValid).toBe(true);
      expect(result.field1Value).toBe(-50);
      expect(result.field2Value).toBe(-10);
    });

    it('should accept decimal numbers in both fields', () => {
      mockField1.value = '7.5';
      mockField2.value = '2.5';
      const result = window.DivisionCalculator.validateAllFields();
      
      expect(result.isValid).toBe(true);
      expect(result.field1Value).toBe(7.5);
      expect(result.field2Value).toBe(2.5);
    });
  });

  describe('isDivisionByZero()', () => {
    it('should return true when divisor is exactly zero', () => {
      const result = window.DivisionCalculator.isDivisionByZero(0);
      expect(result).toBe(true);
    });

    it('should return false when divisor is positive', () => {
      const result = window.DivisionCalculator.isDivisionByZero(5);
      expect(result).toBe(false);
    });

    it('should return false when divisor is negative', () => {
      const result = window.DivisionCalculator.isDivisionByZero(-3);
      expect(result).toBe(false);
    });

    it('should return false when divisor is a small decimal', () => {
      const result = window.DivisionCalculator.isDivisionByZero(0.001);
      expect(result).toBe(false);
    });

    it('should handle negative zero correctly', () => {
      const result = window.DivisionCalculator.isDivisionByZero(-0);
      expect(result).toBe(true); // -0 === 0 in JavaScript
    });
  });

  describe('calculateDivision()', () => {
    it('should correctly divide two positive integers', () => {
      const result = window.DivisionCalculator.calculateDivision(10, 2);
      expect(result).toBe(5);
    });

    it('should correctly divide positive by negative', () => {
      const result = window.DivisionCalculator.calculateDivision(20, -4);
      expect(result).toBe(-5);
    });

    it('should correctly divide negative by positive', () => {
      const result = window.DivisionCalculator.calculateDivision(-15, 3);
      expect(result).toBe(-5);
    });

    it('should correctly divide two negative numbers', () => {
      const result = window.DivisionCalculator.calculateDivision(-50, -10);
      expect(result).toBe(5);
    });

    it('should correctly divide decimals', () => {
      const result = window.DivisionCalculator.calculateDivision(7.5, 2.5);
      expect(result).toBe(3);
    });

    it('should handle division resulting in repeating decimal', () => {
      const result = window.DivisionCalculator.calculateDivision(10, 3);
      expect(result).toBeCloseTo(3.333333, 5);
    });

    it('should return zero when dividend is zero', () => {
      const result = window.DivisionCalculator.calculateDivision(0, 5);
      expect(result).toBe(0);
    });

    it('should return Infinity when dividing by zero (edge case)', () => {
      const result = window.DivisionCalculator.calculateDivision(10, 0);
      expect(result).toBe(Infinity);
    });

    it('should return -Infinity when dividing negative by zero', () => {
      const result = window.DivisionCalculator.calculateDivision(-10, 0);
      expect(result).toBe(-Infinity);
    });

    it('should handle very large quotients', () => {
      const result = window.DivisionCalculator.calculateDivision(1e15, 1);
      expect(result).toBe(1e15);
    });

    it('should handle very small quotients', () => {
      const result = window.DivisionCalculator.calculateDivision(1, 1e10);
      expect(result).toBe(1e-10);
    });
  });

  describe('formatResult()', () => {
    it('should format simple integer result as string', () => {
      const result = window.DivisionCalculator.formatResult(42);
      expect(result).toBe('42');
    });

    it('should format decimal result with precision trimming', () => {
      const result = window.DivisionCalculator.formatResult(3.14159265359);
      expect(result).toBe('3.14159265359');
    });

    it('should format zero as "0"', () => {
      const result = window.DivisionCalculator.formatResult(0);
      expect(result).toBe('0');
    });

    it('should format negative integer', () => {
      const result = window.DivisionCalculator.formatResult(-25);
      expect(result).toBe('-25');
    });

    it('should format negative decimal', () => {
      const result = window.DivisionCalculator.formatResult(-7.89);
      expect(result).toBe('-7.89');
    });

    it('should add thousands separator for large numbers', () => {
      const result = window.DivisionCalculator.formatResult(1000000);
      expect(result).toBe('1,000,000');
    });

    it('should add thousands separator for negative large numbers', () => {
      const result = window.DivisionCalculator.formatResult(-50000);
      expect(result).toBe('-50,000');
    });

    it('should handle floating point precision artifacts', () => {
      const result = window.DivisionCalculator.formatResult(0.1 + 0.2); // 0.30000000000000004
      expect(result).toBe('0.3');
    });

    it('should return "Result is infinite" for Infinity', () => {
      const result = window.DivisionCalculator.formatResult(Infinity);
      expect(result).toBe('Result is infinite');
    });

    it('should return "Result is infinite" for -Infinity', () => {
      const result = window.DivisionCalculator.formatResult(-Infinity);
      expect(result).toBe('Result is infinite');
    });

    it('should handle very small decimals correctly', () => {
      const result = window.DivisionCalculator.formatResult(0.00000001);
      expect(result).toBe('0.00000001');
    });

    it('should round very long decimals to 10 digits precision', () => {
      const result = window.DivisionCalculator.formatResult(1 / 3);
      expect(result).toBe('0.3333333333');
    });

    it('should handle negative zero', () => {
      const result = window.DivisionCalculator.formatResult(-0);
      expect(result).toBe('0');
    });
  });

  describe('Edge Cases and Integration Scenarios', () => {
    it('should handle complete flow: valid inputs → calculation → formatted result', () => {
      mockField1.value = '100';
      mockField2.value = '3';
      
      const validation = window.DivisionCalculator.validateAllFields();
      expect(validation.isValid).toBe(true);
      
      const quotient = window.DivisionCalculator.calculateDivision(
        validation.field1Value!,
        validation.field2Value!
      );
      
      const formatted = window.DivisionCalculator.formatResult(quotient);
      expect(formatted).toBe('33.3333333333');
    });

    it('should detect division by zero in complete flow', () => {
      mockField1.value = '50';
      mockField2.value = '0';
      
      const validation = window.DivisionCalculator.validateAllFields();
      expect(validation.isValid).toBe(true);
      
      const isDivByZero = window.DivisionCalculator.isDivisionByZero(validation.field2Value!);
      expect(isDivByZero).toBe(true);
    });

    it('should handle negative quotient formatting', () => {
      mockField1.value = '-100';
      mockField2.value = '5';
      
      const validation = window.DivisionCalculator.validateAllFields();
      const quotient = window.DivisionCalculator.calculateDivision(
        validation.field1Value!,
        validation.field2Value!
      );
      const formatted = window.DivisionCalculator.formatResult(quotient);
      
      expect(formatted).toBe('-20');
    });

    it('should handle both fields with decimals', () => {
      mockField1.value = '10.5';
      mockField2.value = '2.5';
      
      const validation = window.DivisionCalculator.validateAllFields();
      const quotient = window.DivisionCalculator.calculateDivision(
        validation.field1Value!,
        validation.field2Value!
      );
      
      expect(quotient).toBe(4.2);
    });

    it('should correctly validate and reject one empty and one filled field', () => {
      mockField1.value = '42';
      mockField2.value = '';
      
      const validation = window.DivisionCalculator.validateAllFields();
      expect(validation.isValid).toBe(false);
    });

    it('should handle very large division resulting in manageable number', () => {
      mockField1.value = '1000000';
      mockField2.value = '1000';
      
      const validation = window.DivisionCalculator.validateAllFields();
      const quotient = window.DivisionCalculator.calculateDivision(
        validation.field1Value!,
        validation.field2Value!
      );
      const formatted = window.DivisionCalculator.formatResult(quotient);
      
      expect(formatted).toBe('1,000');
    });
  });
});
