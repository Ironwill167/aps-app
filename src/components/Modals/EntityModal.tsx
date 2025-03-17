import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Select from 'react-select';
import { Contact, Company } from '../types';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import CustomDialog from '../utils/CustomDialog';

const AddCompanyModal = React.lazy(() => import('./AddCompanyModal'));

interface EntityModalProps {
  mode: 'add' | 'edit';
  entity: 'contact' | 'company';
  initialData?: Partial<Contact> | Partial<Company>;
  onSave: (data: Partial<Contact> | Partial<Company>) => Promise<Contact | Company>;
  onClose: () => void;
  onEntityUpdated: (updatedEntity: Contact | Company) => void;
  companies?: Company[]; // For contact's company selection
}

const EntityModal: React.FC<EntityModalProps> = ({
  mode,
  entity,
  initialData = {},
  onSave,
  onClose,
  onEntityUpdated,
  companies = [],
}) => {
  const [formData, setFormData] = useState<Partial<Contact> | Partial<Company>>({ ...initialData });

  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);

  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customDialogTitle, setCustomDialogTitle] = useState('');
  const [customDialogMessage, setCustomDialogMessage] = useState('');

  const firstInputRef = useRef<HTMLInputElement>(null);
  const initialFocusApplied = useRef<boolean>(false);

  useEffect(() => {
    if (!initialFocusApplied.current && firstInputRef.current) {
      firstInputRef.current.focus();
      initialFocusApplied.current = true;
    }
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  interface SelectOption {
    value: number;
    label: string;
  }

  const handleSelectChange = useCallback((name: string, selectedOption: SelectOption | null) => {
    setFormData((prev) => ({ ...prev, [name]: selectedOption ? selectedOption.value : null }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Basic Validation
    if (
      (entity === 'contact' && !(formData as Contact).name) ||
      (entity === 'company' && !(formData as Company).name)
    ) {
      showErrorToast(`Name is required to create a new ${entity}.`);
      return;
    }

    if (
      entity === 'company' &&
      (!(formData as Company).streetaddress || (formData as Company).streetaddress?.trim() === '')
    ) {
      setCustomDialogTitle('No Street Address');
      setCustomDialogMessage(
        'You have not entered a street address for the company. Do you wish to proceed without entering a street address?'
      );
      setShowCustomDialog(true);
      return;
    }

    saveFunction();
  };

  const handleCompanyAddedLocal = (company: Company) => {
    setFormData((prev) => ({ ...prev, company_id: company.id }));
    setShowAddCompanyModal(false);
  };

  const saveFunction = async () => {
    try {
      console.log('Entity modal saving:', formData);
      const savedEntity = await onSave(formData);
      console.log('Entity saved successfully:', savedEntity);
      showSuccessToast(`${entity.charAt(0).toUpperCase() + entity.slice(1)} saved successfully!`);
      if (savedEntity) {
        console.log('Entity updated callback called with:', savedEntity);
        onEntityUpdated(savedEntity);
        console.log('Entity updated callback called');
        setTimeout(() => {
          console.log('Closing modal after save');
          onClose();
        }, 10);

        return;
      }
      onClose();
    } catch (err) {
      console.error(`Error saving ${entity}:`, err);
      showErrorToast(`Failed to ${mode} ${entity}. Please try again.`);
    }
  };

  return (
    <>
      <div
        className="modal"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${entity}-modal-title`}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <p id={`${entity}-modal-title`}>
              {mode === 'add'
                ? `Add New ${entity.charAt(0).toUpperCase() + entity.slice(1)}`
                : `Edit ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}
            </p>
            <span
              className="close-modal-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              role="button"
              aria-label="Close Modal"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onClose();
              }}
            >
              &times;
            </span>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Example for Contact and Company */}
              {entity === 'contact' && (
                <>
                  {/* Name */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        className="inputMedium"
                        id="name"
                        type="text"
                        name="name"
                        value={(formData as Contact).name || ''}
                        onChange={handleChange}
                        required
                        ref={firstInputRef}
                        placeholder="Enter name"
                      />
                    </div>
                  </div>
                  {/* Surname */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="surname">Surname</label>
                      <input
                        id="surname"
                        className="inputMedium"
                        type="text"
                        name="surname"
                        value={(formData as Contact).surname || ''}
                        onChange={handleChange}
                        placeholder="Enter surname"
                      />
                    </div>
                  </div>
                  {/* Email */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        className="inputMedium"
                        type="email"
                        name="email"
                        value={(formData as Contact).email || ''}
                        onChange={handleChange}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  {/* Contact Number */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="contact_no">Contact Number</label>
                      <input
                        id="contact_no"
                        className="inputMedium"
                        type="text"
                        name="contact_no"
                        value={(formData as Contact).contact_no || ''}
                        onChange={handleChange}
                        required
                        placeholder="Enter contact number"
                      />
                    </div>
                  </div>
                  {/* Company Selection */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="company_id">Company</label>
                      <div className="select-company-container">
                        <Select
                          id="company_id"
                          className="reactSelectWide"
                          options={companies.map((company) => ({
                            value: company.id,
                            label: company.name,
                          }))}
                          onChange={(option) =>
                            handleSelectChange('company_id', option as SelectOption | null)
                          }
                          placeholder="Select Company"
                          isClearable
                          isSearchable
                          value={
                            companies.find((c) => c.id === (formData as Contact).company_id)
                              ? {
                                  value: (formData as Contact).company_id,
                                  label: companies.find(
                                    (c) => c.id === (formData as Contact).company_id
                                  )?.name,
                                }
                              : null
                          }
                        />
                        <button
                          type="button"
                          className="add-company-button"
                          onClick={() => setShowAddCompanyModal(true)}
                          aria-label="Add Company"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Position */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="position">Position</label>
                      <input
                        id="position"
                        className="inputMedium"
                        type="text"
                        name="position"
                        value={(formData as Contact).position || ''}
                        onChange={handleChange}
                        placeholder="Enter position"
                      />
                    </div>
                  </div>
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="company_contact_no">Company Contact Number</label>
                      <input
                        id="company_contact_no"
                        className="inputMedium"
                        type="text"
                        name="company_contact_no"
                        value={(formData as Contact).company_contact_no || ''}
                        onChange={handleChange}
                        placeholder="Enter company contact number"
                      />
                    </div>
                  </div>
                </>
              )}

              {entity === 'company' && (
                <>
                  {/* Company Name */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="company-name">Company Name*</label>
                      <input
                        id="company-name"
                        className="inputMedium"
                        type="text"
                        name="name"
                        value={(formData as Company).name || ''}
                        onChange={handleChange}
                        required
                        ref={firstInputRef}
                        placeholder="Enter company name"
                      />
                    </div>
                  </div>
                  {/* Street Address */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="streetaddress">Street Address</label>
                      <input
                        id="streetaddress"
                        className="inputMedium"
                        type="text"
                        name="streetaddress"
                        value={(formData as Company).streetaddress || ''}
                        onChange={handleChange}
                        placeholder="Enter street address"
                      />
                    </div>
                  </div>
                  {/* Area */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="area">Area</label>
                      <input
                        id="area"
                        className="inputMedium"
                        type="text"
                        name="area"
                        value={(formData as Company).area || ''}
                        onChange={handleChange}
                        placeholder="Enter area"
                      />
                    </div>
                  </div>
                  {/* Town */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="town">Town</label>
                      <input
                        id="town"
                        className="inputMedium"
                        type="text"
                        name="town"
                        value={(formData as Company).town || ''}
                        onChange={handleChange}
                        placeholder="Enter town"
                      />
                    </div>
                  </div>
                  {/* Province */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="province">Province</label>
                      <input
                        id="province"
                        className="inputMedium"
                        type="text"
                        name="province"
                        value={(formData as Company).province || ''}
                        onChange={handleChange}
                        placeholder="Enter province"
                      />
                    </div>
                  </div>
                  {/* Country */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="country">Country</label>
                      <input
                        id="country"
                        className="inputMedium"
                        type="text"
                        name="country"
                        value={(formData as Company).country || ''}
                        onChange={handleChange}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                  {/* Company Type */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="company_type">Company Type</label>
                      <input
                        id="company_type"
                        className="inputMedium"
                        type="text"
                        name="company_type"
                        value={(formData as Company).company_type || ''}
                        onChange={handleChange}
                        placeholder="Enter company type"
                      />
                    </div>
                  </div>
                  {/* VAT Number */}
                  <div className="modal-row">
                    <div className="modal-form-group">
                      <label htmlFor="vat_no">VAT Number</label>
                      <input
                        id="vat_no"
                        className="inputMedium"
                        type="text"
                        name="vat_no"
                        value={(formData as Company).vat_no || ''}
                        onChange={handleChange}
                        placeholder="Enter VAT Number or 'Non VAT Vendor'"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form Actions */}
              <div className="modal-footer">
                <button
                  type="submit"
                  className="modal-submit"
                  tabIndex={6}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubmit(e);
                  }}
                >
                  {mode === 'add' ? 'Add' : 'Save'}
                </button>
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  tabIndex={7}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          {/* Add Company Modal */}
          {showAddCompanyModal && (
            <Suspense fallback={<div>Loading...</div>}>
              <AddCompanyModal
                onClose={() => setShowAddCompanyModal(false)}
                onCompanyAdded={handleCompanyAddedLocal}
              />
            </Suspense>
          )}

          {/* Custom Dialog */}
          <CustomDialog
            open={showCustomDialog}
            title={customDialogTitle}
            message={customDialogMessage}
            onConfirm={saveFunction}
            onCancel={() => {}}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(EntityModal);
