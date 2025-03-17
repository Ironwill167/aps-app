import React, { useState, useEffect, useRef } from 'react';
import { FeeRecord } from '../types';
import {
  formatCurrency,
  validateAndParseNumber,
  handleNumberInputKeyDown,
} from '../utils/NumberUtils';

interface EditableCellProps {
  feeId: number;
  editingFee: FeeRecord | null;
  field: keyof FeeRecord;
  value: number | string;
  onSave: (
    feeId: number,
    editingFee: FeeRecord | null,
    field: keyof FeeRecord,
    editValue: number | string
  ) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ feeId, editingFee, field, value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<number | string>(value);

  const [displayValue, setDisplayValue] = useState<string>(
    typeof value === 'number' ? formatCurrency(value) : String(value || '')
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (value === null) {
      setEditValue('');
      setDisplayValue('');
    } else if (typeof value === 'number' && field !== 'inv_date') {
      setDisplayValue(formatCurrency(value));
      setEditValue(value);
    } else {
      setDisplayValue(String(value || ''));
      setEditValue(value);
    }
  }, [value, field]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) {
      if (typeof value === 'number') {
        const numericValue =
          typeof editValue === 'string' ? validateAndParseNumber(editValue) : editValue;
        onSave(feeId, editingFee, field, numericValue);
        setDisplayValue(formatCurrency(numericValue));
      } else {
        onSave(feeId, editingFee, field, editValue);
        setDisplayValue(String(editValue || ''));
      }
    }
  };

  const onChangeHandler = (newValue: string) => {
    setEditValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    } else if (typeof value === 'number' && field !== 'inv_date') {
      handleNumberInputKeyDown(e);
    }
  };

  if (isEditing) {
    if (field === 'inv_date') {
      return (
        <input
          type="date"
          className="feeManagementEditableCellDate"
          ref={inputRef}
          value={editValue as string}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      );
    } else if (typeof value === 'number') {
      return (
        <input
          type="text" // Changed from number to text to support formatted input
          className="feeManagementEditableCellNumber"
          ref={inputRef}
          value={editValue as string}
          onChange={(e) => onChangeHandler(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      );
    } else {
      return (
        <input
          type="text"
          className="feeManagementEditableCellText"
          ref={inputRef}
          value={editValue as string}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      );
    }
  } else {
    return (
      <div className="feeManagementEditableCell" onDoubleClick={handleDoubleClick}>
        {displayValue}
      </div>
    );
  }
};

export default EditableCell;
