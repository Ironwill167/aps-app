import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import debounce from 'lodash.debounce';
import { useData } from '../hooks/UseData';
import { FileRecord, Company, FeeRecord, Contact } from '../types';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import { convertToLocalDate } from '../utils/DateUtils';
import Header from './Header';
import FileGroup from './FileGroup';

// Lazy load modals
const ViewContactModal = lazy(() => import('../Modals/ViewContactModal'));
const ViewFileModal = lazy(() => import('../Modals/ViewFileModal'));
const ViewCompanyModal = lazy(() => import('../Modals/ViewCompanyModal'));
const PrelimReport = lazy(() => import('../Reporting/PrelimRoport'));
const FeeInvoice = lazy(() => import('../Fees/FeeInvoice'));

const Home: React.FC = () => {
  const {
    contacts = [],
    companies = [] as Company[],
    files = [] as FileRecord[],
    fees = [] as FeeRecord[],
    updateFile,
    refetchFiles,
  } = useData();

  // Edit Status Dropdown
  const [editStatus, setEditStatus] = useState<number | null>(null);

  // File note state
  const [showAddNote, setShowAddNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  // Diary Date state
  const [showChangeDiaryDate, setShowChangeDiaryDate] = useState<number | null>(null);
  const [diaryDate, setDiaryDate] = useState<string>('');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [statusSortOrder, setStatusSortOrder] = useState<'asc' | 'desc'>('asc');

  // View/Edit Modals
  const [showViewContactModal, setShowViewContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [showPrelimReport, setShowPrelimReport] = useState(false);

  const [showViewCompanyModal, setShowViewCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [showViewFileModal, setShowViewFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);

  const [showFeeInvoice, setShowFeeInvoice] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);

  // Handle Right-Click to Show Electron Context Menu
  const handleRightClick = useCallback(
    (event: React.MouseEvent, contextType: string, contextId: number) => {
      event.preventDefault();
      event.stopPropagation();
      window.electronAPI.showContextMenu(contextType, contextId);
    },
    []
  );

  const getCompanyName = useCallback(
    (companyId: number | null): string => {
      if (companyId === null) return 'N/A';
      const company = companies.find((comp) => comp.id === companyId);
      return company ? company.name : 'Unknown';
    },
    [companies]
  );

  const getContactName = useCallback(
    (contactId: number | null): string => {
      if (contactId === null) return 'N/A';
      const contact = contacts.find((ct) => ct.id === contactId);
      return contact ? `${contact.name} ${contact.surname || ''}` : 'Unknown';
    },
    [contacts]
  );

  const getTotalFee = useCallback(
    (feeId: number | null): string => {
      if (feeId === null) return 'N/A';
      const fee = fees.find((f) => f.id === feeId);
      return fee ? fee.total_fee.toString() : 'Unknown';
    },
    [fees]
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
  const filteredFiles = useMemo(() => {
    if (!debouncedSearchTerm) return files as FileRecord[];
    const lowercasedTerm = debouncedSearchTerm.toLowerCase();

    return (files as FileRecord[]).filter((file) => {
      // Include display names in searchable fields
      const searchableFields = [
        String(file.id),
        file.status,
        getCompanyName(file.insured_id),
        getContactName(file.insured_contact_id),
        getCompanyName(file.principal_id),
        getContactName(file.principal_contact_id),
        getCompanyName(file.broker_id),
        getContactName(file.broker_contact_id),
        file.principal_ref,
        file.date_of_loss ? file.date_of_loss.split('T')[0] : '',
        file.subject_matter,
        file.file_note || '',
      ];

      return searchableFields.some((field) =>
        field ? field.toLowerCase().includes(lowercasedTerm) : false
      );
    });
  }, [files, debouncedSearchTerm, getCompanyName, getContactName]);

  // Status Priority Within Each Group using useMemo to avoid re-creation on every render
  const statusPriorityWithinGroups: { [group: string]: { [key: string]: number } } = useMemo(
    () => ({
      'New Files': {
        NEW: 1,
        SURVEY: 2,
        PRELIM: 3,
      },
      'Doc Requests': {
        'DOC-RI': 1,
        'DOC-RR': 2,
        'DOC-RF': 3,
      },
      Reports: {
        'RPT-BS': 1,
        'RPT-C': 2,
        'RPT-D': 3,
        'RPT-S': 4,
      },
      Fees: {
        'FEE-R': 1,
        'FEE-P': 2,
      },
      OpenFiles: {
        // Assign priorities to any other statuses if needed
      },
    }),
    []
  );

  const groupOrder = useMemo(
    () => ['New Files', 'Doc Requests', 'Reports', 'Fees', 'OpenFiles'],
    []
  );

  // Group files based on status
  const groupedFiles = useMemo(() => {
    const groups: { [key: string]: FileRecord[] } = {
      'New Files': [],
      'Doc Requests': [],
      Reports: [],
      Fees: [],
      OpenFiles: [],
    };

    filteredFiles.forEach((file) => {
      switch (file.status) {
        case 'NEW':
        case 'SURVEY':
        case 'PRELIM':
          groups['New Files'].push(file);
          break;

        case 'DOC-RI':
        case 'DOC-RR':
        case 'DOC-RF':
          groups['Doc Requests'].push(file);
          break;

        case 'RPT-BS':
        case 'RPT-C':
        case 'RPT-D':
        case 'RPT-S':
          groups['Reports'].push(file);
          break;

        case 'FEE-R':
        case 'FEE-P':
          groups['Fees'].push(file);
          break;

        default:
          if (file.status !== 'Closed' && file.status !== '') {
            groups['OpenFiles'].push(file);
          }
          break;
      }
    });

    // Sort each group based on status priority
    groupOrder.forEach((groupName) => {
      if (groups[groupName].length > 0) {
        const priorityMap = statusPriorityWithinGroups[groupName] || {};
        groups[groupName].sort((a, b) => {
          const priorityA = priorityMap[a.status] || 999;
          const priorityB = priorityMap[b.status] || 999;

          if (statusSortOrder === 'asc') {
            return priorityA - priorityB;
          } else {
            return priorityB - priorityA;
          }
        });
      }
    });

    return groups;
  }, [filteredFiles, groupOrder, statusSortOrder, statusPriorityWithinGroups]);

  const getReminderDueClass = useCallback((file: FileRecord) => {
    const today = new Date();
    const dateModified = new Date(file.updated_at);
    const diffDays = Math.floor((today.getTime() - dateModified.getTime()) / (1000 * 60 * 60 * 24));

    if (
      (file.status === 'DOC-RI' && diffDays >= 7) ||
      (file.status === 'DOC-RR' && diffDays >= 7)
    ) {
      return 'action-status-red';
    } else if (file.diary_date && new Date(file.diary_date) < today) {
      return 'action-status-orange';
    } else if (file.is_important === 'true') {
      return 'action-status-yellow';
    }
    return '';
  }, []);

  // Get CSS class for status
  const getStatusClass = useCallback((file: FileRecord) => {
    switch (file.status) {
      case 'NEW':
        return 'action-status-new';
      case 'SURVEY':
        return 'action-status-survey';
      case 'PRELIM':
        return 'action-status-prelim';
      case 'DOC-RI':
        return 'action-status-doc-ri';
      case 'DOC-RR':
        return 'action-status-doc-rr';
      case 'DOC-RF':
        return 'action-status-doc-rf';
      case 'RPT-BS':
        return 'action-status-rpt-bs';
      case 'RPT-C':
        return 'action-status-rpt-c';
      case 'RPT-D':
        return 'action-status-rpt-d';
      case 'RPT-S':
        return 'action-status-rpt-s';
      case 'FEE-R':
        return 'action-status-fee-r';
      case 'FEE-P':
        return 'action-status-fee-p';
      case 'Closed':
        return 'action-status-closed';
      default:
        return '';
    }
  }, []);

  // Handler to toggle sort order
  const handleStatusSort = useCallback(() => {
    setStatusSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  }, []);

  // Handle File Updated
  const handleFileUpdated = useCallback(() => {}, []);

  const debouncedMarkImportant = useMemo(
    () =>
      debounce(async (file: FileRecord) => {
        console.log('Received markImportant for file id', file.id);
        const updatedFile: Partial<FileRecord> = {
          is_important: file.is_important === 'true' ? 'false' : 'true',
          updated_at: new Date().toISOString(),
        };
        try {
          await updateFile({ id: file.id, updatedFile });
          setEditStatus(null);
        } catch (error) {
          showErrorToast('Failed to update importance.');
        }
      }, 300),
    [updateFile]
  );

  const handleIsImportandChange = useCallback(
    (file: FileRecord) => {
      console.log('handleIsImportandChange called for file id', file.id);
      debouncedMarkImportant(file);
    },
    [debouncedMarkImportant]
  );

  const updateFileHandler = useCallback(
    async (file: Partial<FileRecord>) => {
      try {
        if (file.id !== undefined) {
          await updateFile({ id: file.id, updatedFile: file });
        }
        handleFileUpdated();
      } catch (error) {
        showErrorToast('Failed to update file.');
      }
    },
    [updateFile, handleFileUpdated]
  );

  const handleClickView = useCallback(
    (e: React.MouseEvent, contextType: string, contextId: number) => {
      e.preventDefault();
      e.stopPropagation();
      if (contextType === 'contact') {
        setShowViewContactModal(true);
        setSelectedContact(contacts.find((c) => c.id === contextId) || null);
      } else if (contextType === 'company') {
        setShowViewCompanyModal(true);
        setSelectedCompany(companies.find((c) => c.id === contextId) || null);
      }
    },
    [contacts, companies]
  );

  //Listener for electron context-menu-action
  const handleContextMenuAction = useCallback(
    async (action: string, contextType: string, contextId: number) => {
      if (contextType === 'file') {
        console.log(`handleContextMenuAction Received ${action} for file id ${contextId}`);
        await refetchFiles(); // Ensure files are up to date
        const targetFile = files.find((f) => f.id === contextId);
        console.log('files.find got Selected File:', targetFile);
        if (!targetFile) return;
        switch (action) {
          case 'viewFile': {
            const file = files.find((f) => f.id === contextId);
            if (file) {
              setSelectedFile(file);
              setShowViewFileModal(true);
            }
            break;
          }

          case 'changeStatus':
            setEditStatus(contextId);
            break;

          case 'changeDiaryDate': {
            const fileDiaryDate = files.find((f) => f.id === contextId)?.diary_date;
            setDiaryDate(fileDiaryDate || '');
            setShowChangeDiaryDate(contextId);
            break;
          }

          case 'editNote': {
            const fileNote = files.find((f) => f.id === contextId)?.file_note;
            setNoteText(fileNote || 'Add note here...');
            setShowAddNote(contextId);
            break;
          }

          case 'editFee': {
            const fee = fees.find((f) => f.id === contextId);
            console.log(fee);
            if (fee) {
              setSelectedFee(fee);
              setShowFeeInvoice(true);
            }
            break;
          }

          case 'markImportant': {
            handleIsImportandChange(targetFile);
            break;
          }

          default:
            break;
        }
      } else if (contextType === 'contact') {
        switch (action) {
          case 'viewContact':
            setShowViewContactModal(true);
            setSelectedContact(contacts.find((c) => c.id === contextId) || null);
            break;

          case 'copyEmail': {
            const contactEmail = contacts.find((c) => c.id === contextId)?.email;
            if (contactEmail) {
              navigator.clipboard.writeText(contactEmail);
            }
            break;
          }

          default:
            break;
        }
      } else if (contextType === 'company') {
        switch (action) {
          case 'viewCompany':
            setShowViewCompanyModal(true);
            setSelectedCompany(companies.find((c) => c.id === contextId) || null);
            break;

          default:
            break;
        }
      } else {
        return;
      }
    },
    [files, companies, contacts, fees, handleIsImportandChange, refetchFiles]
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
        <h2 className="mainContentHeading">Action Center</h2>
        <div className="mainControlsContainer">
          <input
            className="mainControlSearchBar"
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="mainContentSubject">
        <div className="actionCenterContainer">
          <div className="actionFilesContainer">
            <Header onStatusSort={handleStatusSort} sortOrder={statusSortOrder} />
            {groupOrder.map(
              (groupName) =>
                groupedFiles[groupName] &&
                groupedFiles[groupName].length > 0 && (
                  <FileGroup
                    key={groupName}
                    title={groupName}
                    files={groupedFiles[groupName]}
                    getCompanyName={getCompanyName}
                    getContactName={getContactName}
                    getTotalFee={getTotalFee}
                    editStatus={editStatus}
                    setEditStatus={setEditStatus}
                    showAddNote={showAddNote}
                    setShowAddNote={setShowAddNote}
                    noteText={noteText}
                    setNoteText={setNoteText}
                    handleIsImportandChange={handleIsImportandChange}
                    setDiaryDate={setDiaryDate}
                    diaryDate={diaryDate}
                    showChangeDiaryDate={showChangeDiaryDate}
                    setShowChangeDiaryDate={setShowChangeDiaryDate}
                    updateFile={updateFileHandler}
                    getReminderDueClass={getReminderDueClass}
                    getStatusClass={getStatusClass}
                    onRightClick={handleRightClick}
                    setSelectedFile={setSelectedFile}
                    setSelectedFee={setSelectedFee}
                    openFileDetails={() => setShowViewFileModal(true)}
                  />
                )
            )}
          </div>
          <div className="actionFileDetailsContainer">
            {selectedFile ? (
              <div className="actionFileDetails">
                <div className="actionFileDetailsHeader">
                  <h2>File Details</h2>
                  <div className="actionFileDetailsHeaderActions">
                    <button
                      className="actionFileDetailsEditButton"
                      onClick={() => setShowViewFileModal(true)}
                    >
                      Edit
                    </button>
                    <button
                      className="actionFileDetailsFeeButton"
                      onClick={() => setShowPrelimReport(true)}
                    >
                      Prelim
                    </button>
                    <button
                      className="actionFileDetailsFeeButton"
                      onClick={() => setShowFeeInvoice(true)}
                    >
                      Fee Invoice
                    </button>
                  </div>
                </div>

                <div className="fileDetailsRow">
                  <div className="fileDetailsItem fileDetailsLeftItem">
                    <p className="fileDetailsLabel">ID:</p>
                    <p className="fileDetailsData">{selectedFile.id}</p>
                  </div>
                  <div className="fileDetailsItem fileDetailsRightItem">
                    <p className="fileDetailsLabel">Status:</p>
                    <p className="fileDetailsData">{selectedFile.status}</p>
                  </div>
                </div>
                <div className="fileDetailsRow">
                  <div className="fileDetailsItem">
                    <p className="fileDetailsLabel">Insured:</p>
                    <div
                      className="fileDetailsDataCompany"
                      onClick={(e) => handleClickView(e, 'company', selectedFile.insured_id || 0)}
                    >
                      {getCompanyName(selectedFile.insured_id)}
                    </div>
                  </div>
                </div>
                <div className="fileDetailsRow">
                  <div className="fileDetailsItem">
                    <p className="fileDetailsLabel">Insured Contact:</p>
                    <div
                      className="fileDetailsDataContact"
                      onClick={(e) =>
                        handleClickView(e, 'contact', selectedFile.insured_contact_id || 0)
                      }
                    >
                      {getContactName(selectedFile.insured_contact_id)}
                    </div>
                  </div>
                </div>
                <div className="fileDetailsRow">
                  <div className="fileDetailsItem">
                    <p className="fileDetailsLabel">Broker:</p>
                    <div
                      className="fileDetailsDataCompany"
                      onClick={(e) => handleClickView(e, 'company', selectedFile.broker_id || 0)}
                    >
                      {getCompanyName(selectedFile.broker_id)}
                    </div>
                  </div>
                </div>
                <div className="fileDetailsRow">
                  <div className="fileDetailsItem">
                    <p className="fileDetailsLabel">Broker Contact:</p>
                    <div
                      className="fileDetailsDataContact"
                      onClick={(e) =>
                        handleClickView(e, 'contact', selectedFile.broker_contact_id || 0)
                      }
                    >
                      {getContactName(selectedFile.broker_contact_id)}
                    </div>
                  </div>
                </div>
                <div className="fileDetailsRow">
                  <div className="fileDetailsItem">
                    <p className="fileDetailsLabel">Principal:</p>
                    <div
                      className="fileDetailsDataCompany"
                      onClick={(e) => handleClickView(e, 'company', selectedFile.principal_id || 0)}
                    >
                      {getCompanyName(selectedFile.principal_id)}
                    </div>
                  </div>
                </div>
                <div className="fileDetailsRow">
                  <div className="fileDetailsItem">
                    <p className="fileDetailsLabel">Principal Contact:</p>

                    <div
                      className="fileDetailsDataContact"
                      onClick={(e) =>
                        handleClickView(e, 'contact', selectedFile.principal_contact_id || 0)
                      }
                    >
                      {getContactName(selectedFile.principal_contact_id)}
                    </div>
                  </div>
                </div>
                <div className="fileDetailsRow">
                  <div className="fileDetailsItem">
                    <p className="fileDetailsLabel">Principal Ref:</p>
                    <p className="fileDetailsData">{selectedFile.principal_ref}</p>
                  </div>
                </div>
                <div className="fileDetailsRow">
                  <div className="fileDetailsItem">
                    <p className="fileDetailsLabel">Date of Loss:</p>
                    <p className="fileDetailsData">
                      {selectedFile.date_of_loss
                        ? convertToLocalDate(selectedFile.date_of_loss)
                        : ''}
                    </p>
                  </div>
                </div>
                <div className="fileDetailsRow">
                  <div className="fileDetailsItem">
                    <p className="fileDetailsLabel">Subject Matter:</p>
                    <p className="fileDetailsData">{selectedFile.subject_matter}</p>
                  </div>
                </div>
                <div className="fileDetailsRow">
                  <div className="fileDetailsItem">
                    <p className="fileDetailsLabel">Fee:</p>
                    <p className="fileDetailsData">{getTotalFee(selectedFile.id)}</p>
                  </div>
                </div>
                <div className="fileDetailsRow">
                  <div className="fileDetailsItem">
                    <p className="fileDetailsLabel">File Note:</p>
                    <p>{selectedFile.file_note}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="actionFileDetails">
                <h3>File Details</h3>
                <p>Select a file to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

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

      {/* View/Edit File Modal */}
      {showViewFileModal && selectedFile && (
        <Suspense fallback={<div>Loading...</div>}>
          <ViewFileModal
            file={selectedFile}
            onClose={() => setShowViewFileModal(false)}
            onFileUpdated={handleFileUpdated}
            companies={companies}
            contacts={contacts}
          />
        </Suspense>
      )}

      {/* Preliminary Report */}
      {showPrelimReport && selectedFile && (
        <Suspense fallback={<div>Loading...</div>}>
          <PrelimReport
            file={selectedFile}
            contacts={contacts}
            companies={companies}
            onClose={() => setShowPrelimReport(false)}
          />
        </Suspense>
      )}

      {/* Fee Invoice */}
      {showFeeInvoice && selectedFile && selectedFee && (
        <Suspense fallback={<div>Loading...</div>}>
          <FeeInvoice
            fileDetails={selectedFile}
            feeDetails={selectedFee}
            onClose={() => setShowFeeInvoice(false)}
            onFileUpdated={handleFileUpdated}
            companies={companies}
            contacts={contacts}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Home;
