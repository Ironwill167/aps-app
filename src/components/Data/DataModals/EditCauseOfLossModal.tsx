import React, { useState } from 'react';
import { CauseOfLoss } from '../../types';
import { useAddCauseOfLoss, useUpdateCauseOfLoss } from '../../hooks/UseMutations';

interface EditCauseOfLossModalProps {
  mode: string;
  initialData?: Partial<CauseOfLoss>;
  onClose: () => void;
}

const EditCauseOfLossModal: React.FC<EditCauseOfLossModalProps> = ({
  mode,
  initialData = {},
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<CauseOfLoss>>({ ...initialData });
  const addCauseOfLossMutation = useAddCauseOfLoss();
  const editCauseOfLossMutation = useUpdateCauseOfLoss();

  const handleSubmit = async (data: Partial<CauseOfLoss>) => {
    if (mode === 'add') {
      console.log('Adding Cause of Loss: ', data);
      const response = await addCauseOfLossMutation.mutateAsync(data as Partial<CauseOfLoss>);
      onClose();
      console.log('Add Cause of Loss Response: ', response);
      return response;
    } else if (mode === 'edit') {
      console.log('Editing Cause of Loss: ', data);
      const response = await editCauseOfLossMutation.mutateAsync({
        id: formData.id!,
        updatedCauseOfLoss: data,
      });
      onClose();
      console.log('Edit Cause of Loss Response: ', response);
      return response;
    } else {
      // edit cause of loss
    }
  };

  return (
    <div className="edit-file-doc-modal">
      <div className="edit-file-doc-modal-content">
        <div className="edit-file-doc-modal-header">
          <p>{mode === 'add' ? `Add New Cause of Loss` : `Edit Cause of Loss`}</p>
        </div>
        <form>
          <div className="edit-file-doc-modal-body">
            <div className="file-doc-modal-row file-doc-modal-name">
              <label htmlFor="file-doc-name">Name:</label>
              <input
                type="text"
                id="file-doc-name"
                name="file-doc-name"
                value={formData.col_name || ''}
                onChange={(e) => setFormData({ ...formData, col_name: e.target.value })}
              />
            </div>
            <div className="file-doc-modal-row file-doc-modal-description">
              <label htmlFor="file-doc-description">Description:</label>
              <textarea
                id="file-doc-description"
                name="file-doc-description"
                value={formData.col_description || ''}
                onChange={(e) => setFormData({ ...formData, col_description: e.target.value })}
              />
            </div>
          </div>
          <div className="file-doc-modal-actions">
            <button
              type="submit"
              className="file-doc-modal-save"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(formData);
              }}
            >
              SAVE
            </button>
            <button type="button" className="file-doc-modal-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCauseOfLossModal;
