import React, { useCallback, lazy, Suspense } from 'react';
import { CauseOfLoss } from '../../types';
import { useData } from '../../hooks/UseData';
import CustomDialog from '../../utils/CustomDialog';
import { deleteCauseOfLoss } from '../../hooks/ApiServices';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

const EditCauseOfLossModal = lazy(() => import('../DataModals/EditCauseOfLossModal'));

const CausesOfLossData: React.FC = () => {
  const { causesOfLoss } = useData();

  const [showEditCauseModal, setShowEditCauseModal] = React.useState(false);

  const [selectedCause, setSelectedCause] = React.useState<Partial<CauseOfLoss>>({});
  const [causeToDelete, setCauseToDelete] = React.useState<Partial<CauseOfLoss> | null>(null);

  const [mode, setMode] = React.useState<'add' | 'edit'>('add');

  const editCause = (id: number) => {
    setSelectedCause(causesOfLoss.find((cause) => cause.id === id) || {});
    setMode('edit');
    setShowEditCauseModal(true);
  };

  const handleDeleteCauseOfLoss = useCallback(
    (id: number) => {
      const cause = causesOfLoss.find((c) => c.id === id) || null;
      setCauseToDelete(cause);
    },
    [causesOfLoss]
  );

  const handleConfirmDelete = async () => {
    if (causeToDelete && causeToDelete.id !== undefined) {
      try {
        const response = await deleteCauseOfLoss(causeToDelete.id);
        showSuccessToast(response.data);
        setCauseToDelete(null);
      } catch (err) {
        console.error('Error deleting cause of loss:', err);
        showErrorToast('There was an error deleting the cause of loss. Please try again.');
      }
    }
  };

  const handleCancelDelete = () => {
    setCauseToDelete(null);
  };

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th className="data-cause-name">Name</th>
            <th className="data-cause-description">Description</th>
            <th className="data-cause-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {causesOfLoss.map((cause) => (
            <tr key={cause.id}>
              <td className="data-cause-name">{cause.col_name}</td>
              <td className="data-cause-description">{cause.col_description}</td>
              <td className="data-cause-actions">
                <button
                  className="data-edit-button"
                  onClick={() => {
                    editCause(cause.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="data-delete-button"
                  onClick={() => {
                    handleDeleteCauseOfLoss(cause.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CustomDialog
        open={false}
        title="Delete Cause of Loss"
        message={`Are you sure you want to delete this ${causeToDelete?.col_name}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          handleCancelDelete();
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        {showEditCauseModal && (
          <EditCauseOfLossModal
            mode={mode}
            initialData={selectedCause}
            onClose={() => setShowEditCauseModal(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

export default CausesOfLossData;
