import React from 'react';
import { InvoiceRates } from '../types';

export interface RatePresetSelectProps {
  value: number;
  selectClassName?: string;
  onChange: (value: number) => void;
  options: InvoiceRates[];
}

const RatePresetSelect: React.FC<RatePresetSelectProps> = ({
  value,
  selectClassName,
  onChange,
  options = [],
}) => {
  return (
    <select
      name="RatePreset"
      className={selectClassName}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.rate_preset_name}
        </option>
      ))}
    </select>
  );
};

export default RatePresetSelect;
