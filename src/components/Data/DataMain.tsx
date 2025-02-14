import React, { useState, lazy, Suspense } from 'react';
import FileDocsData from './DataTables/FileDocsData';
import CausesOfLossData from './DataTables/CausesOfLossData';
import EditCauseOfLossModal from './DataModals/EditCauseOfLossModal';

const EditFileDocModal = lazy(() => import('./DataModals/EditFileDocModal'));

const Data: React.FC = () => {
  const [showFileDocs, setShowFileDocs] = useState(false);
  const [showCausesOfLoss, setShowCausesOfLoss] = useState(false);

  const [showEditFileModal, setShowEditFileModal] = React.useState(false);
  const [showEditCauseModal, setShowEditCauseModal] = React.useState(false);

  return (
    <div className="main-content-contents">
      <div className="mainContentHeader">
        <h2 className="mainContentHeading">Data Management</h2>
        <div className="mainControlsContainer">
          {!showFileDocs ? (
            <button
              className="mainControlButton"
              onClick={() => {
                setShowCausesOfLoss(false);
                setShowFileDocs(true);
              }}
            >
              File Docs
            </button>
          ) : (
            <button
              className="mainControlButton"
              onClick={() => {
                setShowEditFileModal(true);
              }}
            >
              Add File Doc
            </button>
          )}
          {!showCausesOfLoss ? (
            <button
              className="mainControlButton"
              onClick={() => {
                setShowFileDocs(false);
                setShowCausesOfLoss(true);
              }}
            >
              Causes of Loss
            </button>
          ) : (
            <button
              className="mainControlButton"
              onClick={() => {
                setShowEditCauseModal(true);
              }}
            >
              Add Cause of Loss
            </button>
          )}
        </div>
      </div>
      <div className="mainContentSubject">
        {showFileDocs && <FileDocsData />}
        {showCausesOfLoss && <CausesOfLossData />}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {showEditFileModal && (
          <EditFileDocModal mode="add" onClose={() => setShowEditFileModal(false)} />
        )}
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        {showEditCauseModal && (
          <EditCauseOfLossModal mode="add" onClose={() => setShowEditCauseModal(false)} />
        )}
      </Suspense>
    </div>
  );
};

export default Data;
