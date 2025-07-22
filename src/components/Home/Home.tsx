import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy, useRef } from 'react';
import debounce from 'lodash.debounce';
import { useData } from '../hooks/UseData';
import { FileRecord, Company, FeeRecord, Contact, FileNote } from '../types';
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
const DocumentRequest = lazy(() => import('../Reporting/DocumentRequest'));
const EmailModal = lazy(() => import('../Emails/EmailModal'));
const FileNotesModal = lazy(() => import('../Modals/FileNotesModal'));

const Home: React.FC = () => {
  const {
    contacts = [],
    companies = [] as Company[],
    files = [] as FileRecord[],
    fees = [] as FeeRecord[],
    fileNotes = [] as FileNote[],
    updateFile,
    refetchFiles,
    addFileNote,
  } = useData();

  // Edit Status Dropdown
  const [editStatus, setEditStatus] = useState<number | null>(null);

  // File note state
  const [showAddNote, setShowAddNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [latestNotes, setLatestNotes] = useState<Record<number, string>>({});

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

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

  const [showDocumentRequest, setShowDocumentRequest] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailType, setEmailType] = useState<'acknowledgment' | 'general'>('general');
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [emailDropdownPosition, setEmailDropdownPosition] = useState({ top: 0, left: 0 });
  const [openEmailDropdownUpwards, setOpenEmailDropdownUpwards] = useState(false);
  const emailBtnRef = useRef<HTMLButtonElement>(null);

  // File Notes Modal
  const [showFileNotesModal, setShowFileNotesModal] = useState(false);

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

  // Process file notes to get latest note for each file
  useEffect(() => {
    const latestNotesMap: Record<number, { note_text: string; note_date: string }> = {};
    fileNotes.forEach((note: FileNote) => {
      const noteDate = new Date(note.note_date);

      // Skip invalid dates
      if (isNaN(noteDate.getTime())) {
        console.warn('Invalid note date:', note.note_date, 'for note:', note.id);
        return;
      }

      if (
        !latestNotesMap[note.file_id] ||
        noteDate > new Date(latestNotesMap[note.file_id].note_date)
      ) {
        latestNotesMap[note.file_id] = {
          note_text: note.note_text,
          note_date: note.note_date,
        };
      }
    });

    // Convert to simple string map for compatibility
    const simpleLatestNotes: Record<number, string> = {};
    Object.entries(latestNotesMap).forEach(([fileId, noteData]) => {
      simpleLatestNotes[parseInt(fileId)] = noteData.note_text;
    });

    setLatestNotes(simpleLatestNotes);
  }, [fileNotes]);

  // Get latest note for a file
  const getLatestNote = useCallback(
    (fileId: number): string => {
      return latestNotes[fileId] || '';
    },
    [latestNotes]
  );

  // Get all notes for a file for search purposes
  const getAllNotesForFile = useCallback(
    (fileId: number): string => {
      const fileNotesForSearch = fileNotes
        .filter((note: FileNote) => note.file_id === fileId)
        .map((note: FileNote) => note.note_text)
        .join(' ');
      return fileNotesForSearch;
    },
    [fileNotes]
  );

  // Handle File Updated
  const handleFileUpdated = useCallback(async () => {
    // Refetch the files to get the latest data
    await refetchFiles();
  }, [refetchFiles]);

  // Update the selected file when files data changes
  useEffect(() => {
    if (selectedFile) {
      const updatedFile = files.find((f) => f.id === selectedFile.id);
      if (updatedFile) {
        setSelectedFile(updatedFile);
      }
    }
  }, [files, selectedFile]);

  // Add a new file note using the API service
  const handleAddFileNote = useCallback(
    async (fileId: number, noteText: string) => {
      try {
        await addFileNote({
          file_id: fileId,
          note_text: noteText,
        });
        showSuccessToast('Note added successfully');
        // handleFileUpdated is called via the mutation success callback
      } catch (error) {
        console.error('Error adding note:', error);
        showErrorToast('Failed to add note');
        throw error;
      }
    },
    [addFileNote]
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
        getAllNotesForFile(file.id), // Use new notes system instead of file.file_note
      ];

      return searchableFields.some((field) =>
        field ? field.toLowerCase().includes(lowercasedTerm) : false
      );
    });
  }, [files, debouncedSearchTerm, getCompanyName, getContactName, getAllNotesForFile]);

  const groupOrder = useMemo(
    () => ['New Files', 'Doc Requests', 'Report Writing', 'Fees', 'OpenFiles'],
    []
  );

  // Group files based on status
  const groupedFiles = useMemo(() => {
    const groups: { [key: string]: FileRecord[] } = {
      'New Files': [],
      'Doc Requests': [],
      'Report Writing': [],
      Fees: [],
      OpenFiles: [],
    };

    // Status orders for each group
    const newFilesOrder: Record<string, number> = {
      NEW: 1,
      SURVEY: 2,
      PRELIM: 3,
    };
    const docRequestsOrder: Record<string, number> = {
      'DOC-RI': 1,
      'DOC-RR': 2,
      'DOC-RF': 3,
    };
    const reportWritingOrder: Record<string, number> = {
      'RPT-BS': 1,
      'RPT-C': 2,
      'RPT-D': 3,
      'RPT-S': 4,
    };
    const feesOrder: Record<string, number> = {
      'FEE-R': 1,
      'FEE-P': 2,
    };

    // Distribute files into groups
    filteredFiles.forEach((file) => {
      if (file.status && newFilesOrder[file.status] !== undefined) {
        groups['New Files'].push(file);
      } else if (file.status && docRequestsOrder[file.status] !== undefined) {
        groups['Doc Requests'].push(file);
      } else if (file.status && reportWritingOrder[file.status] !== undefined) {
        groups['Report Writing'].push(file);
      } else if (file.status && feesOrder[file.status] !== undefined) {
        groups['Fees'].push(file);
      }
    });

    // Helper to sort by defined order, then updated_at ascending (oldest on top)
    const sortGroup = (items: FileRecord[], priority: Record<string, number>) =>
      items.sort((a, b) => {
        const orderA = priority[a.status!] || 999;
        const orderB = priority[b.status!] || 999;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        // Same status => sort by updated_at ascending
        const dateA = new Date(a.updated_at || '').getTime();
        const dateB = new Date(b.updated_at || '').getTime();
        return dateA - dateB;
      });

    // Sort each group
    groups['New Files'] = sortGroup(groups['New Files'], newFilesOrder);
    groups['Doc Requests'] = sortGroup(groups['Doc Requests'], docRequestsOrder);
    groups['Report Writing'] = sortGroup(groups['Report Writing'], reportWritingOrder);
    groups['Fees'] = sortGroup(groups['Fees'], feesOrder);
    // If needed, define an order for OpenFiles or just use updated_at
    groups['OpenFiles'].sort(
      (a, b) => new Date(a.updated_at || '').getTime() - new Date(b.updated_at || '').getTime()
    );

    return groups;
  }, [filteredFiles]);

  const getReminderDueClass = useCallback((file: FileRecord) => {
    const today = new Date();
    const dateModified = new Date(file.updated_at);
    const diffDays = Math.floor((today.getTime() - dateModified.getTime()) / (1000 * 60 * 60 * 24));

    if (
      (file.status === 'DOC-RI' && diffDays >= 7) ||
      (file.status === 'DOC-RR' && diffDays >= 7)
    ) {
      return 'action-status-red';
    } else if (file.updated_at && diffDays >= 7) {
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
          // handleFileUpdated is called via the mutation success callback
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
        // handleFileUpdated is called via the mutation success callback
      } catch (error) {
        showErrorToast('Failed to update file.');
      }
    },
    [updateFile]
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

  //Function to handle showing the email dropdown with smart positioning
  const handleEmailDropdownToggle = () => {
    if (!showEmailDropdown && emailBtnRef.current) {
      // Get button dimensions
      const buttonRect = emailBtnRef.current.getBoundingClientRect();

      // Calculate if there's enough space below
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceNeeded = 100; // Approximate height of dropdown
      const openUpwards = spaceBelow < spaceNeeded;

      // For absolute positioning, position relative to the button
      // We want the dropdown's right edge to align with the button's right edge
      const dropdownWidth = 200; // Fixed dropdown width from CSS
      const leftPosition = buttonRect.width - dropdownWidth; // Align right edges
      const topPosition = openUpwards ? -spaceNeeded : buttonRect.height;

      setEmailDropdownPosition({
        top: topPosition,
        left: leftPosition,
      });
      setOpenEmailDropdownUpwards(openUpwards);
    }
    setShowEmailDropdown(!showEmailDropdown);
  };

  // Listener for electron context-menu-action
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

          case 'changeStatus': {
            setEditStatus(contextId);
            break;
          }

          case 'editNote': {
            // Open the FileNotesModal for the new multiple notes system
            setSelectedFile(targetFile);
            setShowFileNotesModal(true);
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

  // Close email dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.emailDropdownContainer') && showEmailDropdown) {
        setShowEmailDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmailDropdown]);

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
            <Header />
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
                    getLatestNote={getLatestNote}
                    addFileNote={handleAddFileNote}
                    editStatus={editStatus}
                    setEditStatus={setEditStatus}
                    showAddNote={showAddNote}
                    setShowAddNote={setShowAddNote}
                    noteText={noteText}
                    setNoteText={setNoteText}
                    handleIsImportandChange={handleIsImportandChange}
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
                    <div className="actionFileDetailsHeaderLeft">
                      <button
                        className="actionFileDetailsEditButton"
                        onClick={() => setShowViewFileModal(true)}
                      >
                        Edit
                      </button>
                      <button
                        className="actionFileDetailsEditButton"
                        onClick={() => setShowFileNotesModal(true)}
                      >
                        Notes
                      </button>
                    </div>
                    <div className="actionFileDetailsHeaderRight">
                      {' '}
                      <div className="emailDropdownContainer">
                        <button
                          className="actionFileDetailsFeeButton"
                          onClick={handleEmailDropdownToggle}
                          ref={emailBtnRef}
                        >
                          Emails
                        </button>
                        {showEmailDropdown && (
                          <div
                            className={`emailDropdownMenu ${openEmailDropdownUpwards ? 'dropdown-open-up' : 'dropdown-open-down'}`}
                            style={{
                              top: emailDropdownPosition.top,
                              left: emailDropdownPosition.left,
                            }}
                            onKeyDown={(e) => {
                              // Handle keyboard navigation
                              if (e.key === 'Escape') {
                                setShowEmailDropdown(false);
                              } else if (e.key === 'ArrowDown') {
                                // Focus next item
                                const currentEl = document.activeElement;
                                const items = Array.from(
                                  document.querySelectorAll('.emailDropdownItem')
                                );
                                const currentIndex = items.indexOf(currentEl as Element);
                                const nextItem = items[(currentIndex + 1) % items.length];
                                if (nextItem) (nextItem as HTMLElement).focus();
                              } else if (e.key === 'ArrowUp') {
                                // Focus previous item
                                const currentEl = document.activeElement;
                                const items = Array.from(
                                  document.querySelectorAll('.emailDropdownItem')
                                );
                                const currentIndex = items.indexOf(currentEl as Element);
                                const prevIndex =
                                  currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                                const prevItem = items[prevIndex];
                                if (prevItem) (prevItem as HTMLElement).focus();
                              }
                            }}
                          >
                            <div
                              className="emailDropdownItem"
                              onClick={() => {
                                setEmailType('general');
                                setShowEmailModal(true);
                                setShowEmailDropdown(false);
                              }}
                              tabIndex={0}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  setEmailType('general');
                                  setShowEmailModal(true);
                                  setShowEmailDropdown(false);
                                }
                              }}
                            >
                              Basic Email
                            </div>
                            <div
                              className="emailDropdownItem"
                              onClick={() => {
                                setEmailType('acknowledgment');
                                setShowEmailModal(true);
                                setShowEmailDropdown(false);
                              }}
                              tabIndex={0}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  setEmailType('acknowledgment');
                                  setShowEmailModal(true);
                                  setShowEmailDropdown(false);
                                }
                              }}
                            >
                              Acknowledgement
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        className="actionFileDetailsFeeButton"
                        onClick={() => setShowDocumentRequest(true)}
                      >
                        Docs
                      </button>
                      <button
                        className="actionFileDetailsFeeButton"
                        onClick={() => setShowPrelimReport(true)}
                      >
                        Prelim
                      </button>
                      <button
                        className="actionFileDetailsFeeButton"
                        onClick={() => {
                          const fee = fees.find((f) => f.id === selectedFile.id);
                          setSelectedFee(fee || null); // pass the correct fee record
                          setShowFeeInvoice(true);
                        }}
                      >
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>
                <div className="fileDetailsContents">
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
                        onClick={(e) =>
                          handleClickView(e, 'company', selectedFile.principal_id || 0)
                        }
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
                      <p className="fileDetailsLabel">Latest Note:</p>
                      <p className="fileDetailsNoteText">{getLatestNote(selectedFile.id)}</p>
                    </div>
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
      {/* Document Request */}
      {showDocumentRequest && selectedFile && (
        <Suspense fallback={<div>Loading...</div>}>
          <DocumentRequest
            filerecord={selectedFile}
            onClose={() => setShowDocumentRequest(false)}
          />
        </Suspense>
      )}{' '}
      {/* Email Modal */}
      {showEmailModal && selectedFile && (
        <Suspense fallback={<div>Loading...</div>}>
          <EmailModal
            onClose={() => {
              setShowEmailModal(false);
              setShowEmailDropdown(false);
            }}
            file={selectedFile}
            contacts={contacts}
            companies={companies}
            emailType={emailType}
          />
        </Suspense>
      )}
      {/* File Notes Modal */}
      {showFileNotesModal && selectedFile && (
        <Suspense fallback={<div>Loading...</div>}>
          <FileNotesModal
            file={selectedFile}
            onClose={() => setShowFileNotesModal(false)}
            onNotesUpdated={handleFileUpdated}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Home;
