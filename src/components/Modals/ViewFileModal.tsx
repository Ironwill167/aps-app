import React, { useState, useEffect, useMemo, useRef, lazy, Suspense, useCallback } from 'react';
import Select from 'react-select';
import { FileRecord, Company, Contact } from '../types';
import { useUpdateFile } from '../hooks/UseMutations';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { convertToLocalDate } from '../utils/DateUtils';
import {
  handleNumberInputKeyDown,
  validateAndParseNumber,
  formatNumber,
} from '../utils/NumberUtils';
import { useData } from '../hooks/UseData';
import CurrencySelect from '../Shared/CurrencySelect';
import AdditionalPartyDisplay from '../Reporting/AdditionalPartyDisplay';

const AddContactModal = lazy(() => import('./AddContactModal'));
const AddCompanyModal = lazy(() => import('./AddCompanyModal'));

interface ViewFileModalProps {
  file: FileRecord;
  onClose: () => void;
  onFileUpdated: () => void;
  companies: Company[];
  contacts: Contact[];
}

const ViewFileModal: React.FC<ViewFileModalProps> = ({
  file,
  onClose,
  onFileUpdated,
  companies,
  contacts,
}) => {
  const [localCompanies, setLocalCompanies] = useState<Company[]>([]);

  const combinedCompanies = useMemo(
    () =>
      [...companies, ...localCompanies].filter(
        (company, index, self) =>
          // Remove duplicates by ID
          index === self.findIndex((c) => c.id === company.id)
      ),
    [companies, localCompanies]
  );

  const {
    causesOfLoss: cause_of_loss_data,
    additionalParties,
    addAdditionalParty,
    updateAdditionalParty,
    deleteAdditionalParty,
  } = useData();
  const updateFileMutation = useUpdateFile();
  const [formData, setFormData] = useState<FileRecord>({ ...file });
  const [estimateLossInput, setEstimateLossInput] = useState<string>(
    formatNumber(file.estimate_of_loss)
  );

  const causesSorted = cause_of_loss_data.sort((a, b) => a.col_name.localeCompare(b.col_name));

  const [showAdditionalParties, setShowAdditionalParties] = useState(false);

  const fetchRelevantAdditionalParties = useCallback(() => {
    let relevantAdditionalParties = [];
    if (formData.id) {
      relevantAdditionalParties = additionalParties.filter((ap) => ap.file_id === formData.id);
    }

    setShowAdditionalParties(relevantAdditionalParties.length > 0);
  }, [additionalParties, formData.id]);

  useEffect(() => {
    fetchRelevantAdditionalParties();
  }, [additionalParties, fetchRelevantAdditionalParties]);

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  interface Option {
    value: string | number;
    label: string;
  }

  const handleSelectChange = (name: string, selectedOption: Option | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleCompanyAddedLocal = useCallback(
    (company: Company) => {
      // Add to local companies list
      setLocalCompanies((prev) => [...prev, company]);

      // Update the form data with the new company ID for the current field
      setFormData((prev) => ({ ...prev, [currentField!]: company.id }));
      setCurrentField(null);

      // Close modal
      setShowAddCompanyModal(false);
    },
    [currentField]
  );

  const handleContactAddedLocal = useCallback(
    (contact: Contact) => {
      setFormData((prev) => ({ ...prev, [currentField!]: contact.id }));
      setCurrentField(null);
    },
    [currentField]
  );

  const companyOptions = useMemo(() => {
    return combinedCompanies
      .map((company) => ({
        value: company.id,
        label: company.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [combinedCompanies]);

  const contactOptionsForCompany = useCallback(
    (id: number | null) => {
      if (id === null) return [];
      return contacts
        .filter((contact) => contact.company_id === id)
        .map((contact) => ({
          value: contact.id,
          label: `${contact.name} ${contact.surname ? contact.surname : ''}`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    },
    [contacts]
  );

  const statusOptions = [
    { value: 'NEW', label: 'New' },
    { value: 'SURVEY', label: 'Survey to be done.' },
    { value: 'PRELIM', label: 'Preliminary Report to be done' },
    { value: 'DOC-RI', label: 'Doc Request Initial' },
    { value: 'DOC-RR', label: 'Doc Request Reminder' },
    { value: 'DOC-RF', label: 'Doc Request Final' },
    { value: 'RPT-BS', label: 'Report basic details to be filled.' },
    { value: 'RPT-C', label: 'Complete full report' },
    { value: 'RPT-D', label: 'Report is written, but not ready' },
    { value: 'RPT-S', label: 'Report is ready to send' },
    { value: 'FEE-R', label: 'Report Sent and Fee Raised' },
    { value: 'FEE-P', label: 'Fee Paid' },
    { value: 'Closed', label: 'Closed' },
  ];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.principal_id || !formData.insured_id) {
      showErrorToast('Please fill in all required fields.');
      return;
    }
    const todayDate = new Date();
    formData.updated_at = todayDate.toISOString();

    try {
      await updateFileMutation.mutateAsync({
        id: formData.id,
        updatedFile: formData,
      });
      console.log(`ViewFileModal updateFile with: ${formData}`);
      showSuccessToast('File updated successfully!');
      onFileUpdated();
      onClose();
    } catch (err) {
      console.error('Update File Error:', err);
      showErrorToast('Failed to update file. Please try again.');
    }
  };

  const handleAddAdditionalParty = async () => {
    if (formData.id) {
      try {
        await addAdditionalParty(formData.id);
        fetchRelevantAdditionalParties();
      } catch (error) {
        console.error('Add Additional Party Error:', error);
      }
    }
  };

  const openAddCompanyModal = (field: string) => {
    setCurrentField(field);
    setShowAddCompanyModal(true);
  };

  const openAddContactModal = (field: string) => {
    setCurrentField(field);
    setShowAddContactModal(true);
  };

  const getPreselectedCompanyId = (field: string): number | null => {
    switch (field) {
      case 'insured_contact_id':
        return formData.insured_id || null;
      case 'principal_contact_id':
        return formData.principal_id || null;
      case 'broker_contact_id':
        return formData.broker_id || null;
      default:
        return null;
    }
  };

  const handleEstimateBlur = () => {
    // Convert the raw input to a number.
    const parsed = validateAndParseNumber(estimateLossInput);
    setFormData((prev) => ({ ...prev, estimate_of_loss: parsed }));
  };

  return (
    <>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-file-modal-title"
      >
        <div className="modal-content view-file-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header view-file-modal-header">
            <div className="header-left">
              <p id="view-file-modal-title" className="modal-title">
                View/Edit File
              </p>
            </div>
            <div className="header-right">
              <button
                type="submit"
                form="view-file-form"
                className="header-save-button"
                disabled={updateFileMutation.isPending}
              >
                {updateFileMutation.isPending ? 'Saving...' : 'Save'}
              </button>
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
          <div className="view-file-modal-body">
            <div className="modal-body">
              <form id="view-file-form" onSubmit={handleUpdate}>
                {/* File Number */}
                <div className="modal-row">
                  <div className="modal-file-number-container">
                    <label htmlFor="fileNumber">File Number</label>
                    <p id="fileNumber">{formData.id}</p>
                  </div>

                  {/* Status */}
                  <div className="modal-form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      value={formData.status || ''}
                      onChange={(event) => {
                        const selectedValue = event.target.value;
                        handleSelectChange('status', {
                          value: selectedValue,
                          label: selectedValue,
                        });
                      }}
                    >
                      <option value="">Select a status...</option>
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Company */}
                <div className="modal-row">
                  <div className="modal-form-group">
                    <label htmlFor="company_id">Insured</label>
                    <div className="select-company-container">
                      <Select
                        id="insured_id"
                        className="reactSelectWide"
                        options={companyOptions}
                        onChange={(option) => handleSelectChange('insured_id', option)}
                        placeholder="Select a company..."
                        isSearchable
                        value={
                          companyOptions.find((option) => option.value === formData.insured_id) ||
                          null
                        }
                        required
                        filterOption={(option, input) =>
                          option.label.toLowerCase().includes(input.toLowerCase())
                        }
                        menuPlacement="auto"
                        maxMenuHeight={200}
                      />
                      <button
                        type="button"
                        className="add-company-button"
                        onClick={() => openAddCompanyModal('insured_id')}
                        aria-label="Add Company"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Company Contact */}

                  <div className="modal-form-group">
                    <label htmlFor="company_contact_id">Company Contact</label>
                    <div className="select-company-container">
                      <Select
                        id="company_contact_id"
                        className="reactSelectWide"
                        options={contactOptionsForCompany(formData.insured_id)}
                        onChange={(option) => handleSelectChange('insured_contact_id', option)}
                        placeholder="Select a contact..."
                        isSearchable
                        value={
                          formData.insured_contact_id
                            ? contactOptionsForCompany(formData.insured_id).find(
                                (option) => option.value === formData.insured_contact_id
                              ) || null
                            : null
                        }
                        filterOption={(option, input) =>
                          option.label.toLowerCase().includes(input.toLowerCase())
                        }
                        menuPlacement="auto"
                        maxMenuHeight={200}
                      />
                      <button
                        type="button"
                        className="add-company-button"
                        onClick={() => openAddContactModal('insured_contact_id')}
                        aria-label="Add Contact"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Principal */}
                <div className="modal-row">
                  <div className="modal-form-group">
                    <label htmlFor="principal_id">Principal</label>
                    <div className="select-company-container">
                      <Select
                        id="principal_id"
                        className="reactSelectWide"
                        options={companyOptions}
                        onChange={(option) => handleSelectChange('principal_id', option)}
                        placeholder="Select a principal..."
                        isSearchable
                        value={
                          companyOptions.find((option) => option.value === formData.principal_id) ||
                          null
                        }
                        filterOption={(option, input) =>
                          option.label.toLowerCase().includes(input.toLowerCase())
                        }
                        menuPlacement="auto"
                        maxMenuHeight={200}
                      />
                      <button
                        type="button"
                        className="add-company-button"
                        onClick={() => openAddCompanyModal('principal_id')}
                        aria-label="Add Company"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Principal Contact */}

                  <div className="modal-form-group">
                    <label htmlFor="principal_contact_id">Principal Contact</label>
                    <div className="select-company-container">
                      <Select
                        id="principal_contact_id"
                        className="reactSelectWide"
                        options={contactOptionsForCompany(formData.principal_id)}
                        onChange={(option) => handleSelectChange('principal_contact_id', option)}
                        placeholder="Select a contact..."
                        isSearchable
                        value={
                          formData.principal_contact_id
                            ? contactOptionsForCompany(formData.principal_id).find(
                                (option) => option.value === formData.principal_contact_id
                              ) || null
                            : null
                        }
                        filterOption={(option, input) =>
                          option.label.toLowerCase().includes(input.toLowerCase())
                        }
                        menuPlacement="auto"
                        maxMenuHeight={200}
                      />
                      <button
                        type="button"
                        className="add-company-button"
                        onClick={() => openAddContactModal('principal_contact_id')}
                        aria-label="Add Contact"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Broker */}
                <div className="modal-row">
                  <div className="modal-form-group">
                    <label htmlFor="broker_id">Broker</label>
                    <div className="select-company-container">
                      <Select
                        id="broker_id"
                        className="reactSelectWide"
                        options={companyOptions}
                        onChange={(option) => handleSelectChange('broker_id', option)}
                        placeholder="Select a broker..."
                        isSearchable
                        value={
                          companyOptions.find((option) => option.value === formData.broker_id) ||
                          null
                        }
                        filterOption={(option, input) =>
                          option.label.toLowerCase().includes(input.toLowerCase())
                        }
                        menuPlacement="auto"
                        maxMenuHeight={200}
                      />
                      <button
                        type="button"
                        className="add-company-button"
                        onClick={() => openAddCompanyModal('broker_id')}
                        aria-label="Add Company"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Broker Contact */}

                  <div className="modal-form-group">
                    <label htmlFor="broker_contact_id">Broker Contact</label>
                    <div className="select-company-container">
                      <Select
                        id="broker_contact_id"
                        className="reactSelectWide"
                        options={contactOptionsForCompany(formData.broker_id)}
                        onChange={(option) => handleSelectChange('broker_contact_id', option)}
                        placeholder="Select a contact..."
                        isSearchable
                        value={
                          formData.broker_contact_id
                            ? contactOptionsForCompany(formData.broker_id).find(
                                (option) => option.value === formData.broker_contact_id
                              ) || null
                            : null
                        }
                        filterOption={(option, input) =>
                          option.label.toLowerCase().includes(input.toLowerCase())
                        }
                        menuPlacement="auto"
                        maxMenuHeight={200}
                      />

                      <button
                        type="button"
                        className="add-company-button"
                        onClick={() => openAddContactModal('broker_contact_id')}
                        aria-label="Add Contact"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Principal Reference */}
                <div className="modal-row">
                  <div className="modal-form-group">
                    <label htmlFor="principal_ref">Principal Reference</label>
                    <input
                      id="principal_ref"
                      className="inputMedium"
                      type="text"
                      name="principal_ref"
                      value={formData.principal_ref || ''}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Date of Loss */}

                  <div className="modal-form-group">
                    <label htmlFor="date_of_loss">Date of Loss</label>
                    <input
                      id="date_of_loss"
                      className="inputMedium"
                      type="date"
                      name="date_of_loss"
                      value={formData.date_of_loss ? convertToLocalDate(formData.date_of_loss) : ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Cause of Loss */}
                <div className="modal-row">
                  <div className="modal-form-group">
                    <label htmlFor="cause_of_loss">Cause of Loss</label>
                    <select
                      id="cause_of_loss"
                      value={formData.cause_of_loss_id ? String(formData.cause_of_loss_id) : ''}
                      onChange={(event) => {
                        const selectedValue = event.target.value;
                        handleSelectChange(
                          'cause_of_loss_id',
                          selectedValue
                            ? {
                                value: Number(selectedValue),
                                label:
                                  causesSorted.find((cl) => cl.id === Number(selectedValue))
                                    ?.col_name || '',
                              }
                            : null
                        );
                      }}
                    >
                      <option value="">Select a cause of loss...</option>
                      {causesSorted.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.col_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Estimate of Loss */}
                  <div className="modal-form-group">
                    <label htmlFor="estimate_of_loss">Estimate of Loss</label>
                    <CurrencySelect
                      value={formData.claim_currency || 'ZAR'}
                      selectClassName="currencySelectViewFile"
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, claim_currency: value }))
                      }
                    />
                    <input
                      type="text"
                      className="inputMedium"
                      value={estimateLossInput}
                      onKeyDown={handleNumberInputKeyDown}
                      onChange={(e) => {
                        setEstimateLossInput(e.target.value);
                      }}
                      onBlur={handleEstimateBlur}
                    />
                  </div>
                </div>

                {/* Subject Matter */}
                <div className="modal-row">
                  <div className="modal-form-group">
                    <label htmlFor="subject_matter">Subject Matter</label>
                    <input
                      type="text"
                      className="inputLarge"
                      id="subject_matter"
                      name="subject_matter"
                      value={formData.subject_matter || ''}
                      onChange={handleChange}
                    ></input>
                  </div>
                </div>

                {/* Additional Parties */}
                <div className="modal-row">
                  <div className="additional-parties-container">
                    <div className="additional-parties-header">
                      <label htmlFor="additional_parties">Additional Parties</label>
                      <button
                        type="button"
                        className="add-company-button"
                        aria-label="Add Company"
                        onClick={handleAddAdditionalParty}
                      >
                        +
                      </button>
                    </div>
                    {showAdditionalParties &&
                      additionalParties
                        .filter((ap) => ap.file_id === formData.id)
                        .map((ap) => (
                          <AdditionalPartyDisplay
                            key={ap.id}
                            additionalParty={ap}
                            onUpdated={(updatedParty) => {
                              updateAdditionalParty({
                                id: updatedParty.id,
                                updatedAdditionalParty: updatedParty,
                              });
                            }}
                            onDelete={(id) => {
                              deleteAdditionalParty(id);
                            }}
                            companies={companies}
                            contacts={contacts}
                          />
                        ))}
                  </div>
                </div>

                {/* Preliminary Findings */}
                <div className="modal-row">
                  <div className="modal-form-group">
                    <label htmlFor="preliminary_findings">Preliminary Findings</label>
                    <textarea
                      id="preliminary_findings"
                      name="preliminary_findings"
                      value={formData.preliminary_findings || ''}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                {/* File Note */}
                <div className="modal-row">
                  <div className="modal-form-group">
                    <label htmlFor="file_note">File Note</label>
                    <textarea
                      id="file_note"
                      name="file_note"
                      value={formData.file_note || ''}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <AddContactModal
            onClose={() => setShowAddContactModal(false)}
            companies={companies}
            onContactAdded={handleContactAddedLocal}
            preselectedCompanyId={currentField ? getPreselectedCompanyId(currentField) : null}
          />
        </Suspense>
      )}

      {/* Add Company Modal */}
      {showAddCompanyModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <AddCompanyModal
            onClose={() => setShowAddCompanyModal(false)}
            onCompanyAdded={handleCompanyAddedLocal}
          />
        </Suspense>
      )}
    </>
  );
};

export default ViewFileModal;
