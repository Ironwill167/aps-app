import React, { lazy, Suspense, useState } from 'react';
import { AdditionalParty, Contact, Company } from '../types';
import Select from 'react-select';

const AddCompanyModal = lazy(() => import('../Modals/AddCompanyModal'));
const AddContactModal = lazy(() => import('../Modals/AddContactModal'));

interface AdditionalPartyDisplayProps {
  additionalParty: AdditionalParty;
  onUpdated: (updatedParty: AdditionalParty) => void;
  onDelete: (id: number) => void;
  companies: Company[];
  contacts: Contact[];
}

interface OptionType {
  value: number;
  label: string;
}

const AdditionalPartyDisplay: React.FC<AdditionalPartyDisplayProps> = ({
  additionalParty,
  onUpdated,
  onDelete,
  companies,
  contacts,
}) => {
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));

  const contactOptionsForCompany = (companyId: number | null) => {
    if (!companyId) return [];
    return contacts
      .filter((contact) => contact.company_id === companyId)
      .map((contact) => ({ value: contact.id, label: contact.name }));
  };

  const handleSelectChange = (key: string, option: OptionType | null) => {
    const updated = { ...additionalParty, [key]: option ? option.value : null };
    console.log('Updated additional party:', updated);
    onUpdated(updated);
  };

  return (
    <div className="additional-party-content">
      <div className="additional-party-row">
        <div className="additional-party-name">
          <label>Additional Party:</label>
          <input
            type="text"
            value={additionalParty.adp_name}
            onChange={(e) => onUpdated({ ...additionalParty, adp_name: e.target.value })}
          >
            {additionalParty.adp_name}
          </input>
        </div>
        <div className="adp-company-form-group">
          <label htmlFor="adp_company_id">Company:</label>
          <div className="adp-select-container">
            <Select
              id="adp_company_id"
              className="reactSelectWide"
              options={companyOptions}
              onChange={(option) => handleSelectChange('adp_company_id', option as OptionType)}
              placeholder="Select a company..."
              isSearchable
              value={
                companyOptions.find((option) => option.value === additionalParty.adp_company_id) ||
                null
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

        <div className="adp-contact-form-group">
          <label htmlFor="adp_contact_id">Contact</label>
          <div className="adp-select-container">
            <Select
              id="adp_contact_id"
              className="reactSelectWide"
              options={contactOptionsForCompany(additionalParty.adp_company_id)}
              onChange={(option) => handleSelectChange('adp_contact_id', option as OptionType)}
              placeholder="Select a contact..."
              isSearchable
              value={
                additionalParty.adp_contact_id
                  ? contactOptionsForCompany(additionalParty.adp_company_id).find(
                      (option) => option.value === additionalParty.adp_contact_id
                    ) || null
                  : null
              }
            />

            <button
              type="button"
              className="add-company-button"
              onClick={() => setShowAddContactModal(true)}
              aria-label="Add Contact"
            >
              +
            </button>
          </div>
        </div>
        <div className="additional-party-actions">
          <button
            type="button"
            className="adp_delete-button"
            onClick={() => onDelete(additionalParty.id)}
          >
            X
          </button>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {showAddCompanyModal && (
          <AddCompanyModal
            onClose={() => setShowAddCompanyModal(false)}
            onCompanyAdded={(company) => {
              onUpdated({ ...additionalParty, adp_company_id: company.id });
              setShowAddCompanyModal(false);
            }}
          />
        )}
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        {showAddContactModal && (
          <AddContactModal
            onClose={() => setShowAddContactModal(false)}
            companies={companies}
            onContactAdded={(contact) => {
              onUpdated({ ...additionalParty, adp_contact_id: contact.id });
              setShowAddContactModal(false);
            }}
          />
        )}
      </Suspense>
    </div>
  );
};

export default AdditionalPartyDisplay;
