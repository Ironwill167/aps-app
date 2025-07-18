import React, { useMemo } from 'react';
import { FileRecord, Company, Contact } from '../types';
import { useUpdateFile } from '../hooks/UseMutations';
import { getContactNameSurname } from '../utils/ContactUtils';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { formatDbDateDisplay } from '../utils/DateUtils';
import { formatCurrency } from '../utils/NumberUtils';
import { useData } from '../hooks/UseData';

interface PrelimReportProps {
  file: FileRecord;
  contacts: Contact[];
  companies: Company[];
  onClose: () => void;
}

const PrelimReport: React.FC<PrelimReportProps> = ({ file, contacts, companies, onClose }) => {
  const [formData] = React.useState<FileRecord>(file);

  const { additionalParties, causesOfLoss } = useData();
  const additionalPartiesForFile = additionalParties.filter((party) => party.file_id === file.id);
  const colForFile = causesOfLoss.find((col) => col.id === file.cause_of_loss_id);

  const updateFileMutation = useUpdateFile();

  const checkCurrency = useMemo(() => {
    if (file.claim_currency === null) {
      return 'R';
    } else {
      return file.claim_currency;
    }
  }, [file.claim_currency]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateFileMutation.mutateAsync({
        id: formData.id,
        updatedFile: formData,
      });
      console.log(`ViewFileModal updateFile with: ${formData}`);
      showSuccessToast('File updated successfully!');
      onClose();
    } catch (err) {
      console.error('Update File Error:', err);
      showErrorToast('Failed to update file. Please try again.');
    }
  };

  return (
    <>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prelim-file-modal-title"
      >
        <div className="prelim-content" onClick={(e) => e.stopPropagation()}>
          <div className="prelim-header">
            <div className="prelim-header-title">
              <p>Preliminary Report</p>
            </div>

            <div className="prelim-header-file-number">
              <label htmlFor="fileNumber">File Number:</label>
              <p id="fileNumber">{formData.id}</p>
            </div>

            <div className="prelim-header-close-div">
              <span
                className="close-modal-button"
                onClick={onClose}
                role="button"
                aria-label="Close Modal"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onClose();
                  }
                }}
              >
                &times;
              </span>
            </div>
          </div>

          <div className="modal-body">
            <form onSubmit={handleUpdate}>
              <div className="prelim-report">
                <div className="prelim-report-content">
                  <div className="prelim-report-emailSubject-section">
                    <p>{`${formData.principal_ref} // My Ref: APS ${formData.id} // Preliminary Findings // Insured: ${companies.find((company) => company.id === file.insured_id)?.name}`}</p>
                  </div>
                  <div className="prelim-report-section">
                    <h3>File Details</h3>
                    <p>
                      <strong>Insured:</strong>{' '}
                      {companies.find((company) => company.id === file.insured_id)?.name}
                    </p>
                    <p>
                      <strong>Insured Contact:</strong>{' '}
                      {file.insured_contact_id !== null
                        ? getContactNameSurname(file.insured_contact_id, contacts)
                        : ''}
                    </p>
                    <p>
                      <strong>Broker:</strong>{' '}
                      {companies.find((company) => company.id === file.broker_id)?.name}
                    </p>
                    <p>
                      <strong>Broker Contact:</strong>{' '}
                      {file.broker_contact_id !== null
                        ? getContactNameSurname(file.broker_contact_id, contacts)
                        : ''}
                    </p>
                  </div>
                  <div className="prelim-report-section">
                    <p>
                      <strong>Date of Loss:</strong> {formatDbDateDisplay(formData.date_of_loss)}
                    </p>
                    <p>
                      <strong>Subject Matter:</strong> {file.subject_matter}
                    </p>

                    <p>
                      <strong>Cause of Loss:</strong> {colForFile?.col_name}
                    </p>
                    {file.estimate_of_loss && file.estimate_of_loss !== 0 && (
                      <p>
                        <strong>Estimate of Loss:</strong>{' '}
                        {`${checkCurrency} ${formatCurrency(file.estimate_of_loss)}`}
                      </p>
                    )}
                  </div>
                  {additionalPartiesForFile.length > 0 && (
                    <div className="prelim-report-section">
                      <h3>Additional Parties</h3>
                      {additionalPartiesForFile.map((party) => (
                        <div className="prelim-additional-party-row" key={party.id}>
                          <label>Role: </label>
                          <p>{party.adp_name}</p>
                          <label>Company: </label>
                          <p>
                            {companies.find((company) => company.id === party.adp_company_id)?.name}
                          </p>

                          {party.adp_contact_id ? (
                            <>
                              <label> Contact Person: </label>{' '}
                              <p>${getContactNameSurname(party.adp_contact_id, contacts)}</p>
                            </>
                          ) : (
                            ''
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="prelim-report-section">
                    <h3>Preliminary Findings:</h3>
                    <p> {file.preliminary_findings}</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrelimReport;
