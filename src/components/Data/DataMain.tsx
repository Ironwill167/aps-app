import React, { useState, lazy, Suspense } from 'react';
import FileDocsData from './DataTables/FileDocsData';
import CausesOfLossData from './DataTables/CausesOfLossData';
import InvoiceRatesData from './DataTables/InvoiceRatesData';
import EditCauseOfLossModal from './DataModals/EditCauseOfLossModal';

const EditFileDocModal = lazy(() => import('./DataModals/EditFileDocModal'));
const EditInvoiceRateModal = lazy(() => import('./DataModals/EditInvoiceRateModal'));

const Data: React.FC = () => {
  const [showFileDocs, setShowFileDocs] = useState(false);
  const [showCausesOfLoss, setShowCausesOfLoss] = useState(false);
  const [showInvoiceRates, setShowInvoiceRates] = useState(false);

  const [showEditFileModal, setShowEditFileModal] = React.useState(false);
  const [showEditCauseModal, setShowEditCauseModal] = React.useState(false);
  const [showEditInvoiceRateModal, setShowEditInvoiceRateModal] = React.useState(false);

  return (
    <div className="main-content-contents">
      <div className="mainContentHeader">
        <h2 className="mainContentHeading">Data</h2>
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
              Add Doc
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
              Add Cause
            </button>
          )}
          {!showInvoiceRates ? (
            <button
              className="mainControlButton"
              onClick={() => {
                setShowFileDocs(false);
                setShowCausesOfLoss(false);
                setShowInvoiceRates(true);
              }}
            >
              Invoice Rates
            </button>
          ) : (
            <button
              className="mainControlButton"
              onClick={() => {
                setShowEditInvoiceRateModal(true);
              }}
            >
              Add Rate
            </button>
          )}
        </div>
      </div>
      <div className="mainContentSubject">
        {showFileDocs && <FileDocsData />}
        {showCausesOfLoss && <CausesOfLossData />}
        {showInvoiceRates && <InvoiceRatesData />}
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
      <Suspense fallback={<div>Loading...</div>}>
        {showEditInvoiceRateModal && (
          <EditInvoiceRateModal mode="add" onClose={() => setShowEditInvoiceRateModal(false)} />
        )}
      </Suspense>
    </div>
  );
};

export default Data;
