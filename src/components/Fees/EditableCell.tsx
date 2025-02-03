import React, { useState, useEffect, useRef } from 'react';
import { FeeRecord } from '../types';

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (value === null) {
      setEditValue('');
    }
  }, [value]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onSave(feeId, editingFee, field, editValue);
    }
  };

  const onChangeHandler = (newValue: number) => {
    setEditValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (editValue !== value) {
        onSave(feeId, editingFee, field, editValue);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  };

  return isEditing ? (
    field === 'inv_date' ? (
      <input
        type="date"
        className="feeManagementEditableCellDate"
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    ) : (
      <input
        type="number"
        className="feeManagementEditableCellNumber"
        ref={inputRef}
        value={editValue}
        onChange={(e) => onChangeHandler(Number(e.target.value))}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        step="0.01"
      />
    )
  ) : (
    <div className="feeManagementEditableCell" onDoubleClick={handleDoubleClick}>
      {value}
    </div>
  );
};

export default EditableCell;
