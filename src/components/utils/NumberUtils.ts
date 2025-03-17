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
export const formatNumber = (input: unknown, decimals = 2): string => {
  const numberVal = Number(input);
  if (isNaN(numberVal)) return '';
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

// Reusable onKeyDown handler for numeric inputs.
export const handleNumberInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  // Commonly allowed keys
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
    'Control',
    'Shift',
    'Alt',
    'Meta',
  ];

  // If it’s one of the basic allowed keys, do nothing
  if (allowedKeys.includes(e.key)) {
    return;
  }

  // Check for '.' or ',' or numeric keypad decimal:
  if (
    e.key === '.' ||
    e.key === ',' ||
    e.code === 'NumpadDecimal' ||
    e.code === 'Period' ||
    e.code === 'Comma'
  ) {
    return;
  }

  // Check if digit
  if (/^\d$/.test(e.key)) {
    return;
  }

  // Otherwise block it
  e.preventDefault();
  showInfoToast('Only numbers, ".", and "," are allowed.');
};

/**
 * Formats a number as currency with proper thousands separators and decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @param thousandsSeparator - Character to use as thousands separator (default: ',')
 * @param decimalSeparator - Character to use as decimal separator (default: '.')
 * @returns Formatted string (e.g. "1,234.56" or "1.234,56" based on separators)
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  decimals = 2,
  thousandsSeparator = ',',
  decimalSeparator = '.'
): string => {
  // Handle null/undefined/empty cases
  if (value === null || value === undefined || value === '') return '';

  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseNumber(value) : Number(value);

  // Handle NaN
  if (isNaN(numValue)) return '';

  // Format the number with fixed decimal places
  const parts = numValue.toFixed(decimals).split('.');

  // Add thousands separators to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

  // Join with the decimal separator and return
  return parts.join(decimalSeparator);
};
