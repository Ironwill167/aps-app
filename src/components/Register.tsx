import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { debounce } from 'lodash';
import { showErrorToast, showSuccessToast } from './utils/toast';
import { useData } from './hooks/UseData';
import { FileRecord, FeeRecord, Company, Contact } from './types';
import { createFile } from './hooks/ApiServices';

// Lazy load modals
const ViewFileModal = lazy(() => import('./Modals/ViewFileModal'));
const ViewCompanyModal = lazy(() => import('./Modals/ViewCompanyModal'));
const ViewContactModal = lazy(() => import('./Modals/ViewContactModal'));
const EditFeeModal = lazy(() => import('./Fees/EditFeeModal'));

const Register: React.FC = () => {
  const { contacts, companies, files, fees } = useData();

  // Handle Right-Click to Show Electron Context Menu
  const handleRightClick = useCallback((event: React.MouseEvent, file: FileRecord) => {
    event.preventDefault();
    event.stopPropagation();
    window.electronAPI.showContextMenu('file', file.id);
  }, []);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // View/Edit File Modal
  const [showViewFileModal, setShowViewFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);

  // Edit Fee Modal
  const [showEditFeeModal, setShowEditFeeModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);

  // View Company Modal
  const [showViewCompanyModal, setShowViewCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // View Contact Modal
  const [showViewContactModal, setShowViewContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Maps for quick lookup
  const contactsMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    (contacts as Contact[]).forEach((ct) => {
      map[ct.id] = `${ct.name} ${ct.surname ? ct.surname : ''}`;
    });
    return map;
  }, [contacts]);

  const companiesMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    (companies as Company[]).forEach((comp) => {
      map[comp.id] = comp.name;
    });
    return map;
  }, [companies]);

  // Utility functions
  const getContactFullName = useCallback(
    (contactId: number | null): string => {
      if (contactId === null) return 'N/A';
      return contactsMap[contactId] || 'Unknown';
    },
    [contactsMap]
  );

  const getCompanyName = useCallback(
    (companyId: number | null): string => {
      if (companyId === null) return 'N/A';
      return companiesMap[companyId] || 'Unknown';
    },
    [companiesMap]
  );

  // Debounce search input
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

  // Filter Files Based on Debounced Search Term
  const filteredFiles: FileRecord[] = useMemo(() => {
    if (!debouncedSearchTerm) return files as FileRecord[];

    const lowercasedTerm = debouncedSearchTerm ? debouncedSearchTerm.toLowerCase() : 'N/A';

    return (files as FileRecord[]).filter((file) => {
      // Collect all searchable fields
      const searchableFields = [
        String(file.id),
        file.status,
        getCompanyName(file.insured_id),
        getContactFullName(file.insured_contact_id),
        getCompanyName(file.principal_id),
        getContactFullName(file.principal_contact_id),
        getCompanyName(file.broker_id),
        getContactFullName(file.broker_contact_id),
        file.principal_ref,
        file.date_of_loss ? file.date_of_loss.split('T')[0] : '',
        file.subject_matter,
        file.file_note || '',
      ];

      // Check if any field includes the search term
      return searchableFields.some((field) =>
        field ? field.toLowerCase().includes(lowercasedTerm) : false
      );
    });
  }, [files, debouncedSearchTerm, getCompanyName, getContactFullName]);

  // Define Columns for DataTable
  const columns: TableColumn<FileRecord>[] = useMemo(
    () => [
      {
        id: 'file_number',
        name: 'File Number',
        selector: (row) => row.id,
        sortable: true,
        cell: (row) => (
          <span
            className="clickable-cell"
            onDoubleClick={() => handleViewFile(row)}
            onContextMenu={(e) => handleRightClick(e, row)}
          >
            {row.id}
          </span>
        ),
        className: 'column-file-number',
        width: '5vi',
      },
      {
        name: 'Status',
        selector: (row) => row.status,
        sortable: true,
        cell: (row) => (
          <span
            className={`status-${row.status ? row.status.toLowerCase() : 'N/A'}`}
            onContextMenu={(e) => handleRightClick(e, row)}
          >
            {row.status || 'N/A'}
          </span>
        ),
        width: '4vi',
      },
      {
        name: 'Insured',
        selector: (row) => getCompanyName(row.insured_id),
        sortable: true,
        cell: (row) => (
          <span
            className="clickable-cell"
            onDoubleClick={() => handleViewCompany(row.insured_id)}
            onContextMenu={(e) => handleRightClick(e, row)}
          >
            {getCompanyName(row.insured_id)}
          </span>
        ),
        width: '12vi',
      },
      {
        name: 'Insured Contact',
        selector: (row) => getContactFullName(row.insured_contact_id),
        sortable: true,
        cell: (row) => (
          <span
            className="clickable-cell"
            onDoubleClick={() => handleViewContact(row.insured_contact_id)}
            onContextMenu={(e) => handleRightClick(e, row)}
          >
            {getContactFullName(row.insured_contact_id)}
          </span>
        ),
        width: '6vi',
      },
      {
        name: 'Principal',
        selector: (row) => getCompanyName(row.principal_id),
        sortable: true,
        cell: (row) => (
          <span
            className="clickable-cell"
            onDoubleClick={() => handleViewCompany(row.principal_id)}
            onContextMenu={(e) => handleRightClick(e, row)}
          >
            {getCompanyName(row.principal_id)}
          </span>
        ),
        width: '12vi',
      },
      {
        name: 'Principal Contact',
        selector: (row) => getContactFullName(row.principal_contact_id),
        sortable: true,
        cell: (row) => (
          <span
            className="clickable-cell"
            onDoubleClick={() => handleViewContact(row.principal_contact_id)}
            onContextMenu={(e) => handleRightClick(e, row)}
          >
            {getContactFullName(row.principal_contact_id)}
          </span>
        ),
        width: '6vi',
      },
      {
        name: 'Broker',
        selector: (row) => getCompanyName(row.broker_id),
        sortable: true,
        cell: (row) => (
          <span
            className="clickable-cell"
            onDoubleClick={() => handleViewCompany(row.broker_id)}
            onContextMenu={(e) => handleRightClick(e, row)}
          >
            {getCompanyName(row.broker_id)}
          </span>
        ),
        width: '12vi',
      },
      {
        name: 'Broker Contact',
        selector: (row) => getContactFullName(row.broker_contact_id),
        sortable: true,
        cell: (row) => (
          <span
            className="clickable-cell"
            onDoubleClick={() => handleViewContact(row.broker_contact_id)}
            onContextMenu={(e) => handleRightClick(e, row)}
          >
            {getContactFullName(row.broker_contact_id)}
          </span>
        ),
        width: '6vi',
      },
      {
        name: 'Principal Ref',
        selector: (row) => row.principal_ref,
        sortable: true,
        width: '5vi',
      },
      {
        name: 'Date of Loss',
        selector: (row) => row.date_of_loss?.split('T')[0] || 'N/A',
        sortable: true,
        width: '6vi',
      },
      {
        name: 'Subject Matter',
        selector: (row) => row.subject_matter,
        sortable: true,
        width: '14vi',
      },
    ],
    [getCompanyName, getContactFullName]
  );

  // Handle Add File
  const handleAddNewFile = async () => {
    try {
      const newFile = await createFile(); //New row is added by backend with empty fields and new id.
      setSelectedFile(newFile.data as FileRecord);
      setShowViewFileModal(true);
    } catch (error) {
      console.error('Failed to fetch the new file:', error);
      showErrorToast('Failed to add new file');
    }
  };

  const handleViewFile = (file: FileRecord) => {
    setSelectedFile(file);
    setShowViewFileModal(true);
  };

  // Handle File Updated
  const handleFileUpdated = () => {};

  const handleViewCompany = (companyId: number | null) => {
    if (companyId === null) return;
    const companyData = companies.find((c) => c.id === companyId) || null;
    if (companyData) {
      setSelectedCompany(companyData);
      setShowViewCompanyModal(true);
    }
  };

  const handleViewContact = (contactId: number | null) => {
    if (contactId === null) return;
    const contactData = contacts.find((ct) => ct.id === contactId) || null;
    if (contactData) {
      setSelectedContact(contactData);
      setShowViewContactModal(true);
    }
  };

  const handleRowDoubleClicked = (row: FileRecord) => {
    setSelectedFile(row);
    setShowViewFileModal(true);
  };

  // Listener for context-menu-action
  const handleContextMenuAction = useCallback(
    (action: string, contextType: string, contextId: number) => {
      if (contextType !== 'file') return;

      switch (action) {
        case 'viewFile':
          const file = files.find((f) => f.id === contextId);
          if (file) {
            setSelectedFile(file);
            setShowViewFileModal(true);
          }
          break;

        case 'changeStatus':
          // Implement status change logic
          break;

        case 'addNote':
          // Implement add note logic
          break;

        case 'editFee':
          const fee = fees.find((f) => f.file_id === contextId);
          if (fee) {
            setSelectedFee(fee);
            setShowEditFeeModal(true);
          }
          break;

        // Handle more actions if needed

        default:
          break;
      }
    },
    [files, fees]
  );

  useEffect(() => {
    window.electronAPI.onContextMenuAction(handleContextMenuAction);

    return () => {
      window.electronAPI.offContextMenuAction(handleContextMenuAction);
    };
  }, [handleContextMenuAction]);

  return (
    <div className="main-content-contents" onContextMenu={(e) => e.preventDefault()}>
      <div className="mainContentHeader">
        <h2 className="mainContentHeading">Register</h2>

        {/* Add File Button and Search Bar */}
        <div className="mainControlsContainer">
          <input
            className="mainControlSearchBar"
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="mainControlButton" onClick={handleAddNewFile}>
            Add New File
          </button>
        </div>
      </div>

      <div className="mainContentSubject">
        {/* Data Table */}
        <DataTable
          className="register-data-table"
          columns={columns}
          data={filteredFiles}
          pagination
          defaultSortFieldId="file_number"
          defaultSortAsc={false}
          paginationPerPage={50}
          paginationRowsPerPageOptions={[50, 100, 200, 500]}
          onRowClicked={() => {}}
          onRowDoubleClicked={handleRowDoubleClicked}
          highlightOnHover
          pointerOnHover
          fixedHeader={true}
          customStyles={{
            rows: {
              style: {
                minHeight: '2vh',
                fontSize: '0.9vi',
              },
            },
            headCells: {
              style: {
                justifyContent: 'center',
                paddingLeft: '0',
                paddingTop: '0',
                paddingBottom: '0',
                paddingRight: '0',
                backgroundColor: '#84D11F',
                fontWeight: 'bold',
                fontSize: '1vi',
              },
            },
            cells: {
              style: {
                paddingLeft: '0.2vw',
                paddingRight: '0',
                paddingTop: '0.2vh',
                paddingBottom: '0.2vh',
              },
            },
          }}
        />

        {/* View/Edit File Modal */}
        {showViewFileModal && selectedFile && (
          <Suspense fallback={<div>Loading...</div>}>
            <ViewFileModal
              file={selectedFile!}
              onClose={() => setShowViewFileModal(false)}
              onFileUpdated={handleFileUpdated}
              companies={companies}
              contacts={contacts}
            />
          </Suspense>
        )}

        {/* Edit Fee Modal */}
        {showEditFeeModal && selectedFee && (
          <Suspense fallback={<div>Loading...</div>}>
            <EditFeeModal
              file={selectedFile!}
              fee={selectedFee}
              onClose={() => setShowEditFeeModal(false)}
              onFileUpdated={handleFileUpdated}
              companies={companies}
              contacts={contacts}
            />
          </Suspense>
        )}

        {/* View Company Modal */}
        {showViewCompanyModal && selectedCompany && (
          <Suspense fallback={<div>Loading...</div>}>
            <ViewCompanyModal
              onClose={() => setShowViewCompanyModal(false)}
              company={selectedCompany}
              onCompanyUpdated={() => {
                showSuccessToast('Company updated successfully!');
              }}
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
              onContactUpdated={() => {
                showSuccessToast('Contact updated successfully!');
              }}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Register;
