import React, { useCallback, lazy, Suspense } from 'react';
import { FileDocument } from '../../types';
import { useData } from '../../hooks/UseData';
import CustomDialog from '../../utils/CustomDialog';
import { deleteFileDocument } from '../../hooks/ApiServices';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

const EditFileDocModal = lazy(() => import('../DataModals/EditFileDocModal'));

const FileDocsData: React.FC = () => {
  const { fileDocuments } = useData();

  const [showEditFileModal, setShowEditFileModal] = React.useState(false);

  const [selectedFileDoc, setSelectedFileDoc] = React.useState<Partial<FileDocument>>({});
  const [docToDelete, setDocToDelete] = React.useState<Partial<FileDocument> | null>(null);

  const [mode, setMode] = React.useState<'add' | 'edit'>('add');

  const editFile = (id: number) => {
    setSelectedFileDoc(fileDocuments.find((fileDoc) => fileDoc.id === id) || {});
    setMode('edit');
    setShowEditFileModal(true);
  };

  const handleDeleteFileDocument = useCallback(
    (id: number) => {
      const doc = fileDocuments.find((d) => d.id === id) || null;
      setDocToDelete(doc);
    },
    [fileDocuments]
  );

  const handleConfirmDelete = async () => {
    if (docToDelete && docToDelete.id !== undefined) {
      try {
        const response = await deleteFileDocument(docToDelete.id);
        showSuccessToast(response.data);
        setDocToDelete(null);
      } catch (err) {
        console.error('Error deleting file document:', err);
        showErrorToast('There was an error deleting the file document. Please try again.');
      }
    }
  };

  const handleCancelDelete = () => {
    setDocToDelete(null);
  };

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th className="data-file-doc-name">Name</th>
            <th className="data-file-doc-description">Description</th>
            <th className="data-file-doc-long-description">Long Description</th>
            <th className="data-file-doc-category">Category</th>
            <th className="data-file-doc-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fileDocuments.map((fileDocument) => (
            <tr key={fileDocument.id}>
              <td className="data-file-doc-name">{fileDocument.name}</td>
              <td className="data-file-doc-description">{fileDocument.description}</td>
              <td className="data-file-doc-long-description">{fileDocument.long_description}</td>
              <td className="data-file-doc-category">{fileDocument.category}</td>
              <td className="data-file-doc-actions">
                <button onClick={() => editFile(fileDocument.id)}>Edit</button>
                <button onClick={() => handleDeleteFileDocument(fileDocument.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CustomDialog
        open={false}
        title="Delete File Document"
        message={`Are you sure you want to delete ${docToDelete?.name}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          handleCancelDelete();
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        {showEditFileModal && (
          <EditFileDocModal
            mode={mode}
            initialData={selectedFileDoc}
            onClose={() => setShowEditFileModal(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

export default FileDocsData;
