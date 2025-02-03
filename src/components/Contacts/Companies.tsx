import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { debounce } from 'lodash';
import { showErrorToast, showInfoToast, showSuccessToast } from '../utils/toast';
import CustomDialog from '../utils/CustomDialog';
import { useData } from '../hooks/UseData';
import { Contact, Company } from '../types';

const AddContactModal = lazy(() => import('../Modals/AddContactModal'));
const ViewContactModal = lazy(() => import('../Modals/ViewContactModal'));
const AddCompanyModal = lazy(() => import('../Modals/AddCompanyModal'));
const ViewCompanyModal = lazy(() => import('../Modals/ViewCompanyModal'));

const Companies: React.FC = () => {
  const { contacts, companies, files, deleteCompany } = useData();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showViewContactModal, setShowViewContactModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showViewCompanyModal, setShowViewCompanyModal] = useState(false);

  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);

  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const handleRightClick = useCallback(
    (event: React.MouseEvent, contextType: string, contextId: number) => {
      event.preventDefault();
      event.stopPropagation();
      window.electronAPI.showContextMenu(contextType, contextId);
    },
    []
  );

  // Debounce search input to optimize performance
  const debounceSearch = useMemo(
    () =>
      debounce((term: string) => {
        setDebouncedSearchTerm(term);
      }, 300),
    []
  );

  useEffect(() => {
    debounceSearch(searchTerm);
    return () => {
      debounceSearch.cancel();
    };
  }, [searchTerm, debounceSearch]);

  // Filter Companies Based on Debounced Search Term
  const filteredCompanies = useMemo(() => {
    return (companies as Company[]).filter((company: Company) => {
      const combinedFields = [
        company.name,
        company.streetaddress,
        company.town,
        company.area,
        company.province,
        company.country,
        company.company_type,
        (contacts as Contact[]).find((contact) => contact.company_id === company.id)?.name,
        (contacts as Contact[]).find((contact) => contact.company_id === company.id)?.surname,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return combinedFields.includes(debouncedSearchTerm.toLowerCase());
    });
  }, [contacts, companies, debouncedSearchTerm]);

  const companyContacts = useMemo(() => {
    return contacts.filter((contact) => contact.company_id === selectedCompany?.id);
  }, [contacts, selectedCompany]);

  const handleAddContact = () => {
    setShowAddContactModal(false);
  };

  // Handle Adding Company
  const handleAddCompanyLocal = (company: Company) => {
    setShowAddCompanyModal(false);
    setSelectedCompany(company);
  };

  //Handle Updating Company
  const handleUpdateCompanyLocal = () => {
    setShowViewCompanyModal(false);
  };

  // Handle Delete Company
  const handleDeleteClick = (companyId: number) => {
    if (contacts.find((contact) => contact.company_id === companyId)) {
      showErrorToast('Cannot delete a company with contacts');
      return;
    }

    const companyFiles = files.filter(
      (file) =>
        file.insured_id === companyId ||
        file.principal_id === companyId ||
        file.broker_id === companyId
    );

    if (companyFiles.length > 0) {
      showInfoToast(
        'This company is associated with files: ' +
          companyFiles.map((file) => file.id).join(', ') +
          '.'
      );
      return;
    } else {
      setCompanyToDelete(companyId);
      setDialogTitle('Delete Company');
      setDialogMessage('Are you sure you want to delete this company?');
      setShowDialog(true);
    }
  };

  const handleDeleteCompany = useCallback(async (id: number): Promise<void> => {
    try {
      const message = await deleteCompany(id);
      showSuccessToast(message);
      setCompanyToDelete(null);
      setShowDialog(false);
      // Optionally, refresh data or update state
    } catch (err) {
      console.error('Error deleting company:', err);
      showErrorToast('There was an error deleting the company. Please try again.');
    }
  }, []);

  const handleCancelDelete = () => {
    setCompanyToDelete(null);
    setShowDialog(false);
  };

  const handleUpdateContactLocal = () => {
    setShowViewContactModal(false);
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowViewContactModal(true);
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setShowViewCompanyModal(true);
  };

  // Listener for Electron context-menu-action
  const handleContextMenuAction = useCallback(
    (action: string, contextType: string, contextId: number) => {
      if (contextType !== 'contact') return;

      switch (action) {
        case 'viewContact':
          const contact = contacts.find((c) => c.id === contextId);
          if (contact) {
            setSelectedContact(contact);
            setShowViewContactModal(true);
          }
          break;

        case 'copyEmail':
          const contactToCopy = contacts.find((c) => c.id === contextId);
          if (contactToCopy && contactToCopy.email) {
            navigator.clipboard.writeText(contactToCopy.email);
          }
          break;

        default:
          break;
      }
    },
    [contacts]
  );

  useEffect(() => {
    window.electronAPI.onContextMenuAction(handleContextMenuAction);

    return () => {
      window.electronAPI.offContextMenuAction(handleContextMenuAction);
    };
  }, [handleContextMenuAction]);

  return (
    <div className="main-content-contents">
      <div className="mainContentHeader">
        <h2 className="mainContentHeading">Companies</h2>

        {/* Search and Add Button */}
        <div className="mainControlsContainer">
          <input
            className="mainControlSearchBar"
            type="text"
            placeholder="Search Companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="mainControlButton" onClick={() => setShowAddCompanyModal(true)}>
            Add Company
          </button>
        </div>
      </div>
      <div className="mainContentSubject">
        <div className="companiesContentContainer">
          <div className="companiesTable">
            <div className="companiesTableHeader">
              <div className="companiesTableCell companiesTableNameColumn">Name</div>
              <div className="companiesTableCell companiesTableAddressColumn">Address</div>
              <div className="companiesTableCell companiesTableTypeColumn">Type</div>
            </div>
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="companiesTableRow"
                onClick={() =>
                  setSelectedCompany(company.id === selectedCompany?.id ? null : company)
                }
                onContextMenu={(e) => handleRightClick(e, 'company', company.id)}
              >
                <div className="companiesTableCell companiesTableNameColumn">{company.name}</div>
                <div className="companiesTableCell companiesTableAddressColumn">
                  {company.streetaddress}, {company.town}, {company.area}, {company.province},{' '}
                  {company.country}
                </div>

                <div className="companiesTableCell companiesTableTypeColumn">
                  {company.company_type}
                </div>
              </div>
            ))}
          </div>

          <div className="companiesViewerContainer">
            {selectedCompany ? (
              <div className="companiesViewerDetails">
                <div className="companiesViewerDetailsHeader">
                  <h3>{selectedCompany.name}</h3>
                  <div className="companiesViewerDetailsButtons">
                    <button
                      className="companiesViewerDetailsViewButton"
                      onClick={() => handleViewCompany(selectedCompany)}
                    >
                      View
                    </button>
                    <button
                      className="companiesViewerDetailsDeleteButton"
                      onClick={() => handleDeleteClick(selectedCompany.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="companiesViewerDetailsBody">
                  <div>
                    <strong>Address:</strong> {selectedCompany.streetaddress},{' '}
                    {selectedCompany.town}, {selectedCompany.area}, {selectedCompany.province},{' '}
                    {selectedCompany.country}
                  </div>
                  <div>
                    <strong>Type:</strong> {selectedCompany.company_type}
                  </div>
                  <div>
                    <strong>VAT No:</strong> {selectedCompany.vat_no}
                  </div>

                  {companyContacts.length > 0 ? (
                    <div className="companiesViewerContacts">
                      <div className="companiesViewerContactsHeader">{`Contacts for ${selectedCompany.name}`}</div>
                      <div className="companiesViewerContactsList">
                        {companyContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className="companiesViewerContact"
                            onClick={() => handleViewContact(contact)}
                            onContextMenu={(e) => handleRightClick(e, 'contact', contact.id)}
                          >
                            <div className="companiesViewerContactName">
                              {contact.name} {contact.surname}
                            </div>
                            <div className="companiesViewerContactDetails">
                              <div className="companiesViewerContactPosition">
                                {contact.position}
                              </div>
                              <div className="companiesViewerContactEmail">{contact.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="companiesViewerContactsPlaceholder">
                      No contacts found for this company
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="companiesViewerPlaceholder">Select a company to view details</div>
            )}
          </div>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {showAddCompanyModal && (
          <AddCompanyModal
            onClose={() => setShowAddCompanyModal(false)}
            onCompanyAdded={handleAddCompanyLocal}
          />
        )}
        {showViewCompanyModal && selectedCompany && (
          <ViewCompanyModal
            company={selectedCompany}
            onClose={() => setShowViewCompanyModal(false)}
            onCompanyUpdated={handleUpdateCompanyLocal}
          />
        )}
      </Suspense>

      <CustomDialog
        open={showDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={() => {
          if (companyToDelete !== null) {
            handleDeleteCompany(companyToDelete);
          }
        }}
        onCancel={handleCancelDelete}
      />

      <Suspense fallback={<div>Loading...</div>}>
        {showAddContactModal && (
          <AddContactModal
            companies={companies}
            onClose={() => setShowAddContactModal(false)}
            onContactAdded={handleAddContact}
          />
        )}
        {showViewContactModal && selectedContact && (
          <ViewContactModal
            contact={selectedContact}
            companies={companies}
            onClose={() => setShowViewContactModal(false)}
            onContactUpdated={handleUpdateContactLocal}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Companies;
