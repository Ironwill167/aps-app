import { showInfoToast } from './toast'; // adjust the path as needed

/**
 * Checks if input contains only numbers, commas, or periods.
 */
export const isValidNumberInput = (input: string): boolean => {
  const regex = /^[0-9.,]*$/;
  return regex.test(input);
};

/**
 * Converts a string that may use ',' or '.' as a decimal separator into a number.
 * If both comma and dot are present (e.g., "1,234.56"), it assumes commas are thousand separators.
 */
export const parseNumber = (input: string): number => {
  if (!input) return 0;

  const trimmed = input.trim();

  // If both comma and dot exist, remove commas (assumed thousand separators)
  if (trimmed.includes(',') && trimmed.includes('.')) {
    const normalized = trimmed.replace(/,/g, '');
    return parseFloat(normalized);
  }
  // If only comma is present, assume it as the decimal separator.
  else if (trimmed.includes(',') && !trimmed.includes('.')) {
    const normalized = trimmed.replace(/,/g, '.');
    return parseFloat(normalized);
  }
  // Otherwise, parse as-is
  else {
    return parseFloat(trimmed);
  }
};

/**
 * Formats a number to a string with a fixed number of decimals.
 * Default is 2 decimals.
 */
export const formatNumber = (numberVal: number, decimals = 2): string => {
  return numberVal.toFixed(decimals);
};

/**
 * Validates the input and then converts it to a number.
 * Pops up an infoToast if invalid characters are found.
 */
export const validateAndParseNumber = (input: string): number => {
  if (!isValidNumberInput(input)) {
    showInfoToast('Please enter a valid number');
    return 0;
  }
  return parseNumber(input);
};

// Returns true if the key should be allowed.
export const isAllowedKey = (key: string): boolean => {
  const allowedKeys = [
    'Backspace',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
    'Home',
    'End',
    'Enter',
    'Escape',
  ];
  return allowedKeys.includes(key) || /\d/.test(key) || key === '.' || key === ',';
};

// Reusable onKeyDown handler for numeric inputs.
export const handleNumberInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  if (!isAllowedKey(e.key)) {
    e.preventDefault();
    showInfoToast('Please enter a valid number');
  }
};
