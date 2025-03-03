import React from 'react';

export interface CurrencySelectProps {
  value: string;
  selectClassName?: string;
  onChange: (value: string) => void;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, selectClassName, onChange }) => {
  const currencyOptions = [
    { value: 'ZAR', label: 'ZAR' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'CNY', label: 'CNY' },
    { value: 'JPY', label: 'JPY' },
    { value: 'AUD', label: 'AUD' },
  ];

  return (
    <select className={selectClassName} value={value} onChange={(e) => onChange(e.target.value)}>
      {currencyOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelect;
