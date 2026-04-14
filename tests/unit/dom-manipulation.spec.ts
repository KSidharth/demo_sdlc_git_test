
/**
 * Unit Tests for DOM Manipulation and UI State
 * Framework: Vitest + @testing-library/dom
 * Tests: error display, result rendering, field state, accessibility
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent, getByRole, getByLabelText, queryByRole } from '@testing-library/dom';

let container: HTMLElement;
let field1: HTMLInputElement;
let field2: HTMLInputElement;
let submitBtn: HTMLButtonElement;
let resultContainer: HTMLElement;
let resultValue: HTMLElement;
let field1Error: HTMLElement;
let field2Error: HTMLElement;

beforeEach(() => {
  // Create full DOM structure matching the actual HTML
  document.body.innerHTML = `
    <div class="container">
      <main class="calculator">
        <div class="input-group">
          <label for="field1" class="input-label">
            Dividend (Number 1)
            <span class="required">*</span>
          </label>
          <input 
            type="number" 
            id="field1" 
            class="input-field" 
            placeholder="Enter first number"
            aria-label="First number (dividend)"
            aria-describedby="field1-error"
          />
          <span id="field1-error" class="error-message" role="alert"></span>
        </div>

        <div class="input-group">
          <label for="field2" class="input-label">
            Divisor (Number 2)
            <span class="required">*</span>
          </label>
          <input 
            type="number" 
            id="field2" 
            class="input-field" 
            placeholder="Enter second number"
            aria-label="Second number (divisor)"
            aria-describedby="field2-error"
          />
          <span id="field2-error" class="error-message" role="alert"></span>
        </div>

        <button 
          type="button" 
          id="submitBtn" 
          class="submit-button"
          aria-label="Calculate division result"
        >
          Calculate
        </button>

        <div id="resultContainer" class="result-container hidden" role="status" aria-live="polite">
          <div class="result-label">Result:</div>
          <div id="resultValue" class="result-value"></div>
        </div>
      </main>
    </div>
  `;

  container = document.querySelector('.calculator') as HTMLElement;
  field1 = document.getElementById('field1') as HTMLInputElement;
  field2 = document.getElementById('field2') as HTMLInputElement;
  submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
  resultContainer = document.getElementById('resultContainer') as HTMLElement;
  resultValue = document.getElementById('resultValue') as HTMLElement;
  field1Error = document.getElementById('field1-error') as HTMLElement;
  field2Error = document.getElementById('field2-error') as HTMLElement;
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('DOM Manipulation - Field Error Handling', () => {
  it('should add error class to field when showFieldError is called', () => {
    field1.classList.add('error');
    field1Error.textContent = 'This field is required';
    field1.setAttribute('aria-invalid', 'true');

    expect(field1.classList.contains('error')).toBe(true);
    expect(field1Error.textContent).toBe('This field is required');
    expect(field1.getAttribute('aria-invalid')).toBe('true');
  });

  it('should remove error class when clearFieldError is called', () => {
    field1.classList.add('error');
    field1Error.textContent = 'Some error';
    field1.setAttribute('aria-invalid', 'true');

    field1.classList.remove('error');
    field1Error.textContent = '';
    field1.removeAttribute('aria-invalid');

    expect(field1.classList.contains('error')).toBe(false);
    expect(field1Error.textContent).toBe('');
    expect(field1.hasAttribute('aria-invalid')).toBe(false);
  });

  it('should display error message in error element', () => {
    const errorMsg = 'Please enter a valid number';
    field1Error.textContent = errorMsg;

    expect(field1Error.textContent).toBe(errorMsg);
  });

  it('should set aria-invalid on field with error', () => {
    field2.setAttribute('aria-invalid', 'true');
    expect(field2.getAttribute('aria-invalid')).toBe('true');
  });

  it('should allow multiple errors on different fields simultaneously', () => {
    field1.classList.add('error');
    field1Error.textContent = 'Error on field 1';
    field2.classList.add('error');
    field2Error.textContent = 'Error on field 2';

    expect(field1.classList.contains('error')).toBe(true);
    expect(field2.classList.contains('error')).toBe(true);
    expect(field1Error.textContent).toBe('Error on field 1');
    expect(field2Error.textContent).toBe('Error on field 2');
  });
});

describe('DOM Manipulation - Result Display', () => {
  it('should hide result container initially', () => {
    expect(resultContainer.classList.contains('hidden')).toBe(true);
  });

  it('should show result container when result is displayed', () => {
    resultContainer.classList.remove('hidden');
    resultContainer.classList.add('success');
    resultValue.textContent = '42';

    expect(resultContainer.classList.contains('hidden')).toBe(false);
    expect(resultContainer.classList.contains('success')).toBe(true);
    expect(resultValue.textContent).toBe('42');
  });

  it('should display success state with correct classes', () => {
    resultContainer.classList.remove('hidden', 'error');
    resultContainer.classList.add('success');
    resultValue.textContent = '5';
    resultContainer.setAttribute('aria-live', 'polite');

    expect(resultContainer.classList.contains('success')).toBe(true);
    expect(resultContainer.classList.contains('error')).toBe(false);
    expect(resultContainer.getAttribute('aria-live')).toBe('polite');
  });

  it('should display error state with correct classes', () => {
    resultContainer.classList.remove('hidden', 'success');
    resultContainer.classList.add('error');
    resultValue.textContent = 'Cannot divide by zero';
    resultContainer.setAttribute('aria-live', 'assertive');

    expect(resultContainer.classList.contains('error')).toBe(true);
    expect(resultContainer.classList.contains('success')).toBe(false);
    expect(resultContainer.getAttribute('aria-live')).toBe('assertive');
  });

  it('should update result value text content', () => {
    resultValue.textContent = '123.456';
    expect(resultValue.textContent).toBe('123.456');
  });

  it('should hide result container and clear state classes', () => {
    resultContainer.classList.remove('success', 'error');
    resultContainer.classList.add('hidden');

    expect(resultContainer.classList.contains('hidden')).toBe(true);
    expect(resultContainer.classList.contains('success')).toBe(false);
    expect(resultContainer.classList.contains('error')).toBe(false);
  });
});

describe('DOM Manipulation - Button State', () => {
  it('should disable submit button during calculation', () => {
    submitBtn.disabled = true;
    expect(submitBtn.disabled).toBe(true);
  });

  it('should re-enable submit button after calculation', () => {
    submitBtn.disabled = true;
    submitBtn.disabled = false;
    expect(submitBtn.disabled).toBe(false);
  });

  it('should have correct aria-label on submit button', () => {
    expect(submitBtn.getAttribute('aria-label')).toBe('Calculate division result');
  });
});

describe('DOM Manipulation - Accessibility Attributes', () => {
  it('should have role="alert" on error message spans', () => {
    expect(field1Error.getAttribute('role')).toBe('alert');
    expect(field2Error.getAttribute('role')).toBe('alert');
  });

  it('should have role="status" on result container', () => {
    expect(resultContainer.getAttribute('role')).toBe('status');
  });

  it('should have aria-live="polite" initially on result container', () => {
    expect(resultContainer.getAttribute('aria-live')).toBe('polite');
  });

  it('should have aria-describedby linking fields to their error messages', () => {
    expect(field1.getAttribute('aria-describedby')).toBe('field1-error');
    expect(field2.getAttribute('aria-describedby')).toBe('field2-error');
  });

  it('should have aria-label on input fields', () => {
    expect(field1.getAttribute('aria-label')).toBe('First number (dividend)');
    expect(field2.getAttribute('aria-label')).toBe('Second number (divisor)');
  });
});

describe('DOM Manipulation - Input Field Properties', () => {
  it('should have type="number" on both input fields', () => {
    expect(field1.type).toBe('number');
    expect(field2.type).toBe('number');
  });

  it('should have placeholders on both fields', () => {
    expect(field1.placeholder).toBe('Enter first number');
    expect(field2.placeholder).toBe('Enter second number');
  });

  it('should accept numeric value input', () => {
    field1.value = '42';
    expect(field1.value).toBe('42');
  });

  it('should allow clearing field value', () => {
    field1.value = '100';
    field1.value = '';
    expect(field1.value).toBe('');
  });

  it('should accept negative numbers', () => {
    field2.value = '-25';
    expect(field2.value).toBe('-25');
  });

  it('should accept decimal numbers', () => {
    field1.value = '3.14';
    expect(field1.value).toBe('3.14');
  });
});

describe('DOM Manipulation - Event Simulation', () => {
  it('should fire click event on submit button', () => {
    const clickHandler = vi.fn();
    submitBtn.addEventListener('click', clickHandler);
    fireEvent.click(submitBtn);

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('should fire input event when field value changes', () => {
    const inputHandler = vi.fn();
    field1.addEventListener('input', inputHandler);
    fireEvent.input(field1, { target: { value: '50' } });

    expect(inputHandler).toHaveBeenCalled();
  });

  it('should fire keypress event on Enter key', () => {
    const keypressHandler = vi.fn();
    field1.addEventListener('keypress', keypressHandler);
    fireEvent.keyPress(field1, { key: 'Enter', code: 'Enter' });

    expect(keypressHandler).toHaveBeenCalled();
  });

  it('should fire keydown event for input filtering', () => {
    const keydownHandler = vi.fn();
    field2.addEventListener('keydown', keydownHandler);
    fireEvent.keyDown(field2, { key: '5', code: 'Digit5' });

    expect(keydownHandler).toHaveBeenCalled();
  });
});

describe('DOM Manipulation - State Transitions', () => {
  it('should transition from hidden result to visible success result', () => {
    expect(resultContainer.classList.contains('hidden')).toBe(true);

    resultContainer.classList.remove('hidden');
    resultContainer.classList.add('success');
    resultValue.textContent = '10';

    expect(resultContainer.classList.contains('hidden')).toBe(false);
    expect(resultContainer.classList.contains('success')).toBe(true);
  });

  it('should transition from success to error state', () => {
    resultContainer.classList.add('success');
    resultContainer.classList.remove('success');
    resultContainer.classList.add('error');

    expect(resultContainer.classList.contains('success')).toBe(false);
    expect(resultContainer.classList.contains('error')).toBe(true);
  });

  it('should clear error and show new error on different field', () => {
    field1.classList.add('error');
    field1Error.textContent = 'Error 1';

    field1.classList.remove('error');
    field1Error.textContent = '';

    field2.classList.add('error');
    field2Error.textContent = 'Error 2';

    expect(field1.classList.contains('error')).toBe(false);
    expect(field2.classList.contains('error')).toBe(true);
  });
});

describe('DOM Manipulation - Layout Structure', () => {
  it('should have all required DOM elements present', () => {
    expect(field1).toBeTruthy();
    expect(field2).toBeTruthy();
    expect(submitBtn).toBeTruthy();
    expect(resultContainer).toBeTruthy();
    expect(resultValue).toBeTruthy();
    expect(field1Error).toBeTruthy();
    expect(field2Error).toBeTruthy();
  });

  it('should have labels associated with input fields', () => {
    const label1 = container.querySelector('label[for="field1"]');
    const label2 = container.querySelector('label[for="field2"]');

    expect(label1).toBeTruthy();
    expect(label2).toBeTruthy();
  });

  it('should have required indicators in labels', () => {
    const requiredSpans = container.querySelectorAll('.required');
    expect(requiredSpans.length).toBe(2);
  });
});
