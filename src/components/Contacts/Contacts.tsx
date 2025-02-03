import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { debounce } from 'lodash';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import { useData } from '../hooks/UseData';
import { Contact, Company } from '../types';
import CustomDialog from '../utils/CustomDialog';

import Select from 'react-select';

// Lazy load modals
const AddContactModal = lazy(() => import('../Modals/AddContactModal'));
const ViewContactModal = lazy(() => import('../Modals/ViewContactModal'));
const AddCompanyModal = lazy(() => import('../Modals/AddCompanyModal'));
const ViewCompanyModal = lazy(() => import('../Modals/ViewCompanyModal'));

const Contacts: React.FC = () => {
  const { contacts, companies, updateContact, deleteContact } = useData();

  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Modal Visibility State
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showViewContactModal, setShowViewContactModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showViewCompanyModal, setShowViewCompanyModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Inline Editing State
  const [editContactId, setEditContactId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editSurname, setEditSurname] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editContactNo, setEditContactNo] = useState('');
  const [editCompanyContactNo, setEditCompanyContactNo] = useState('');
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
  const [editPosition, setEditPosition] = useState('');

  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  // Handle Right-Click to Show Electron Context Menu
  const handleRightClick = useCallback((event: React.MouseEvent, contact: Contact) => {
    event.preventDefault();
    event.stopPropagation();
    window.electronAPI.showContextMenu('contact', contact.id);
  }, []);

  // Maps for quick lookup
  const companiesMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    (companies as Company[]).forEach((comp) => {
      map[comp.id] = comp.name;
    });
    return map;
  }, [companies]);

  // Utility functions
  const getCompanyName = useCallback(
    (companyId: number | null): string => {
      if (companyId === null) return 'N/A';
      return companiesMap[companyId] || 'Unknown';
    },
    [companiesMap]
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

  // Filter Contacts Based on Debounced Search Term
  const filteredContacts = useMemo(() => {
    return (contacts as Contact[]).filter((contact: Contact) => {
      const combinedFields = [
        contact.name,
        contact.surname,
        contact.email,
        contact.contact_no,
        contact.company_contact_no,
        contact.position,
        (companies as Company[]).find((c) => c.id === contact.company_id)?.name ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return combinedFields.includes(debouncedSearchTerm.toLowerCase());
    });
  }, [contacts, companies, debouncedSearchTerm]);

  // Define Columns for DataTable
  const columns: TableColumn<Contact>[] = useMemo(
    () => [
      {
        name: 'Name',

        selector: (row) => row.name ?? '',
        sortable: true,
        cell: (row) =>
          editContactId === row.id ? (
            <input
              type="text"
              className="contact-row-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          ) : (
            <div onContextMenu={(e) => handleRightClick(e, row)}>{row.name}</div>
          ),
        width: '7vw',
      },

      {
        name: 'Surname',
        selector: (row) => row.surname ?? '',
        sortable: true,
        cell: (row) =>
          editContactId === row.id ? (
            <input
              type="text"
              className="contact-row-input"
              value={editSurname}
              onChange={(e) => setEditSurname(e.target.value)}
            />
          ) : (
            <div onContextMenu={(e) => handleRightClick(e, row)}>{row.surname || 'N/A'}</div>
          ),
        width: '7vw',
      },
      {
        name: 'Email',
        selector: (row) => row.email ?? '',
        sortable: true,
        cell: (row) =>
          editContactId === row.id ? (
            <input
              type="email"
              className="contact-row-input"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          ) : (
            <div
              onContextMenu={(e) => {
                handleRightClick(e, row);
              }}
            >
              {row.email || 'N/A'}
            </div>
          ),
        width: '14vw',
      },
      {
        name: 'Contact No',
        selector: (row) => row.contact_no ?? '',
        sortable: true,
        cell: (row) =>
          editContactId === row.id ? (
            <input
              className="contact-row-input"
              type="text"
              value={editContactNo}
              onChange={(e) => setEditContactNo(e.target.value)}
            />
          ) : (
            <div onContextMenu={(e) => handleRightClick(e, row)}>{row.contact_no || 'N/A'}</div>
          ),
        width: '7vw',
      },
      {
        name: 'Company Contact No',
        selector: (row) => row.company_contact_no ?? '',
        sortable: true,
        cell: (row) =>
          editContactId === row.id ? (
            <input
              className="contact-row-input"
              type="text"
              value={editCompanyContactNo}
              onChange={(e) => setEditCompanyContactNo(e.target.value)}
            />
          ) : (
            <div onContextMenu={(e) => handleRightClick(e, row)}>
              {row.company_contact_no || 'N/A'}{' '}
            </div>
          ),
        width: '7vw',
      },
      {
        name: 'Company',
        selector: (row) => getCompanyName(row.company_id ?? null),
        sortable: true,
        cell: (row) =>
          editContactId === row.id ? (
            <>
              <Select
                className="reactSelect"
                options={companyOptions}
                value={companyOptions.find((option) => option.value === editCompanyId) || null}
                onChange={(option) => setEditCompanyId(option?.value || null)}
                isSearchable
              />
              <button
                type="button"
                className="add-company-button"
                onClick={() => setShowAddCompanyModal(true)}
                aria-label="Add Company"
              >
                +
              </button>
            </>
          ) : (
            <div onContextMenu={(e) => handleRightClick(e, row)}>
              {getCompanyName(row.company_id ?? null)}
            </div>
          ),
      },
      {
        name: 'Position',
        selector: (row) => row.position ?? '',
        sortable: true,
        cell: (row) =>
          editContactId === row.id ? (
            <input
              className="contact-row-input"
              type="text"
              value={editPosition}
              onChange={(e) => setEditPosition(e.target.value)}
            />
          ) : (
            <div onContextMenu={(e) => handleRightClick(e, row)}>{row.position || 'N/A'} </div>
          ),
        width: '10vw',
      },
      {
        name: 'Actions',
        cell: (row) =>
          editContactId === row.id ? (
            <>
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => handleSaveEdit(row.id)}
              >
                Save
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <div>
              <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditRow(row)}>
                Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteContact(row.id)}>
                Delete
              </button>
            </div>
          ),
        width: '7vw',
      },
    ],
    [
      editContactId,
      editName,
      editSurname,
      editEmail,
      editContactNo,
      editCompanyContactNo,
      editCompanyId,
      editPosition,
      getCompanyName,
    ]
  );

  // Set up react-select options for companies
  const companyOptions = useMemo(
    () =>
      (companies as Company[]).map((company) => ({
        value: company.id,
        label: company.name,
      })),
    [companies]
  );

  // Handle Edit Row
  const handleEditRow = (row: Contact) => {
    setEditContactId(row.id);
    setEditName(row.name);
    setEditSurname(row.surname || '');
    setEditEmail(row.email || '');
    setEditContactNo(row.contact_no || '');
    setEditCompanyContactNo(row.company_contact_no || '');
    setEditCompanyId(row.company_id ?? null);
    setEditPosition(row.position || '');
  };

  // Save Edited Contact
  const handleSaveEdit = async (id: number) => {
    const updatedContact: Contact = {
      id,
      name: editName,
      surname: editSurname,
      email: editEmail,
      contact_no: editContactNo,
      company_contact_no: editCompanyContactNo,
      company_id: editCompanyId ?? undefined,
      position: editPosition,
    };

    try {
      await updateContact({ id, updatedContact });
      showSuccessToast('Contact updated successfully!');
      setEditContactId(null);
    } catch (err) {
      console.error('Error updating contact:', err);
      showErrorToast('There was an error updating the contact. Please try again.');
    }
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditContactId(null);
  };

  const handleDeleteContact = (id: number) => {
    const contact = contacts.find((c) => c.id === id) || null;
    setContactToDelete(contact);
  };

  // 3. Implement confirmation handlers
  const handleConfirmDelete = async () => {
    if (contactToDelete) {
      try {
        const message = await deleteContact(contactToDelete.id);
        showSuccessToast(message);
        setContactToDelete(null);
      } catch (err) {
        console.error('Error deleting contact:', err);
        showErrorToast('There was an error deleting the contact. Please try again.');
      }
    }
  };

  const handleCancelDelete = () => {
    setContactToDelete(null);
  };

  const handleContactAddedLocal = (newContact: Contact) => {
    setEditContactId(newContact.id);
    setShowAddContactModal(false);
  };

  const handleContactUpdated = () => {
    setSelectedContact(null);
    setShowViewContactModal(false);
    showSuccessToast('Contact updated successfully!');
  };

  const handleCompanyAddedLocal = (newCompany: Company) => {
    setEditCompanyId(newCompany.id);
    setShowAddCompanyModal(false);
    showSuccessToast('Company added successfully!');
  };

  const handleCompanyUpdated = () => {
    setSelectedCompany(null);
    setShowViewCompanyModal(false);
    showSuccessToast('Company updated successfully!');
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
        <h2 className="mainContentHeading">Contacts</h2>

        {/* Search and Add Button */}
        <div className="mainControlsContainer">
          <input
            className="mainControlSearchBar"
            type="text"
            placeholder="Search Contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="mainControlButton" onClick={() => setShowAddContactModal(true)}>
            Add Contact
          </button>
        </div>
      </div>
      <div className="mainContentSubject">
        {/* Contacts Table */}
        <DataTable
          columns={columns}
          data={filteredContacts}
          pagination
          paginationPerPage={50}
          paginationRowsPerPageOptions={[50, 100, 200, 500]}
          defaultSortFieldId="name"
          defaultSortAsc={true}
          highlightOnHover
          pointerOnHover
          onRowClicked={() => {}} // Optional: Implement if needed
          onRowDoubleClicked={(row) => handleEditRow(row)}
          fixedHeader={true}
          customStyles={{
            rows: {
              style: {
                minHeight: '1.5vi',
              },
            },
            headCells: {
              style: {
                fontWeight: 'bold',
                backgroundColor: '#84D11F',
              },
            },
            cells: {
              style: {
                paddingLeft: '0.4vi',
                paddingRight: '0.4vi',
                fontSize: '1rem',
              },
            },
          }}
        />
        {/* Custom Dialog */}
        <CustomDialog
          open={false}
          title="Delete Contact"
          message={`Are you sure you want to delete ${contactToDelete?.name}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            handleCancelDelete;
          }}
        />

        {/* Add Contact Modal */}
        {showAddContactModal && (
          <Suspense fallback={<div>Loading...</div>}>
            <AddContactModal
              onClose={() => setShowAddContactModal(false)}
              companies={companies}
              onContactAdded={handleContactAddedLocal}
            />
          </Suspense>
        )}

        {/* View Contact Modal */}
        {showViewContactModal && selectedContact && (
          <Suspense fallback={<div>Loading...</div>}>
            <ViewContactModal
              onClose={() => setShowViewContactModal(false)}
              contact={selectedContact}
              companies={companies}
              onContactUpdated={handleContactUpdated}
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

        {/* View Company Modal */}
        {showViewCompanyModal && selectedCompany && (
          <Suspense fallback={<div>Loading...</div>}>
            <ViewCompanyModal
              onClose={() => setShowViewCompanyModal(false)}
              company={selectedCompany}
              onCompanyUpdated={handleCompanyUpdated}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Contacts;
