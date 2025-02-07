import React from 'react';

export interface CurrencySelectProps {
  value: string;
  selectClassName?: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
}

const defaultCurrencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'ZAR', label: 'ZAR' },
];

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  selectClassName,
  onChange,
  options = defaultCurrencyOptions,
}) => {
  return (
    <select
      name="currency"
      className={selectClassName}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelect;
