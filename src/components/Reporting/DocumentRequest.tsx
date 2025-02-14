import React from 'react';
import { FileRecord /*Company, Contact, FileDocument, OutstandingDocument */ } from '../types';
import { useUpdateFile } from '../hooks/UseMutations';
//import { getContactNameSurname } from '../utils/ContactUtils';
import { showSuccessToast, showErrorToast } from '../utils/toast';
//import { formatDbDateDisplay } from '../utils/DateUtils';
//import { useData } from '../hooks/UseData';

interface DocumentRequestProps {
  filerecord: FileRecord;
  onClose: () => void;
}

const DocumentRequest: React.FC<DocumentRequestProps> = ({ filerecord, onClose }) => {
  //const [file_documents]
  const [formData] = React.useState<FileRecord>(filerecord);

  const updateFileMutation = useUpdateFile();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateFileMutation.mutateAsync({
        id: formData.id,
        updatedFile: formData,
      });
      console.log(`Document Request updateFile with: ${formData}`);
      showSuccessToast('File updated successfully!');
      onClose();
    } catch (err) {
      console.error('Update File Error:', err);
      showErrorToast('Failed to update file. Please try again.');
    }
  };

  return (
    <div className="modal-body">
      <form onSubmit={handleUpdate}>
        <div className="document-request-content">
          <div className="document-request-header">
            <div className="document-request-header-title">
              <p>Document Request APS {filerecord.id}</p>
            </div>
          </div>

          <div className="document-request-row">
            <div className="document-request-name"></div>
          </div>
        </div>

        <div className="document-request-footer">
          <button className="document-request-close" onClick={onClose}>
            Close
          </button>
          <button type="submit" className="document-request-save">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentRequest;
