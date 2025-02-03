import React from 'react';

interface CustomDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="custom-dialog-backdrop">
      <div className="custom-dialog">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="custom-dialog-buttons">
          <button onClick={onConfirm} className="confirm-button">
            Yes
          </button>
          <button onClick={onCancel} className="cancel-button">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
