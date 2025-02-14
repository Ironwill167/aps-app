import React, { useState } from 'react';
import { FileDocument } from '../../types';
import { useAddFileDocument, useUpdateFileDocument } from '../../hooks/UseMutations';

interface EditFileDocModalProps {
  mode: string;
  initialData?: Partial<FileDocument>;
  onClose: () => void;
}

const EditFileDocModal: React.FC<EditFileDocModalProps> = ({ mode, initialData = {}, onClose }) => {
  const [formData, setFormData] = useState<Partial<FileDocument>>({ ...initialData });
  const addFileDocumentMutation = useAddFileDocument();
  const editFileDocumentMutation = useUpdateFileDocument();

  const handleSubmit = async (data: Partial<FileDocument>) => {
    if (mode === 'add') {
      console.log('Adding File Document: ', data);
      const response = await addFileDocumentMutation.mutateAsync(data as Partial<FileDocument>);
      onClose();
      console.log('Add File Document Response: ', response);
      return response;
    } else if (mode === 'edit') {
      console.log('Editing File Document: ', data);
      const response = await editFileDocumentMutation.mutateAsync({
        id: formData.id!,
        updatedFileDoc: data,
      });
      onClose();
      console.log('Edit File Document Response: ', response);
      return response;
    } else {
      // edit file document
    }
  };

  return (
    <div className="edit-file-doc-modal">
      <div className="edit-file-doc-modal-content">
        <div className="edit-file-doc-modal-header">
          <p>{mode === 'add' ? `Add New File Document` : `Edit File Document`}</p>
        </div>
        <form>
          <div className="edit-file-doc-modal-body">
            <div className="file-doc-modal-row file-doc-modal-name">
              <label htmlFor="file-doc-name">Name:</label>
              <input
                type="text"
                id="file-doc-name"
                name="file-doc-name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="file-doc-modal-row file-doc-modal-description">
              <label htmlFor="file-doc-description">Description:</label>
              <textarea
                id="file-doc-description"
                name="file-doc-description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="file-doc-modal-row file-doc-modal-long-description">
              <label htmlFor="file-doc-long-description">Long Description:</label>
              <textarea
                id="file-doc-long-description"
                name="file-doc-long-description"
                value={formData.long_description || ''}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              />
            </div>
            <div className="file-doc-modal-row file-doc-modal-category">
              <label htmlFor="file-doc-category">Category:</label>
              <select
                id="file-doc-category"
                name="file-doc-category"
                value={formData.category || 'Claim'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Claim">Claim</option>
                <option value="Claim Amount">Claim Amount</option>
                <option value="Driver and Vehicle Details">Driver and Vehicle Details</option>
                <option value="Goods in Transit">Goods in Transit</option>
                <option value="Investigation">Investigation</option>
                <option value="Other Party/ies">Other Party/ies</option>
                <option value="Import">Import</option>
                <option value="On Discharge">On Discharge</option>
                <option value="Full Container Load">Full Container Load</option>
                <option value="Less than Container Load">Less than Container Load</option>
                <option value="Exports">Exports</option>
                <option value="Rail">Rail</option>
                <option value="Container">Container</option>
                <option value="Farming / Frozen / Chilled Product">
                  Farming / Frozen / Chilled Product
                </option>
                <option value="Fuel Tankers">Fuel Tankers</option>
                <option value="SAB Documentation">SAB Documentation</option>
                <option value="Technical Reports">Technical Reports</option>
                <option value="Construction">Construction</option>
                <option value="Engineering / Liability / Business Interuption">
                  Engineering / Liability / Business Interuption
                </option>
              </select>
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

export default EditFileDocModal;
