import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { FileRecord, FeeRecord } from '../types';
import { showErrorToast } from '../utils/toast';
import { convertToLocalDate } from '../utils/DateUtils';

interface FileItemProps {
  file: FileRecord;
  getCompanyName: (id: number | null) => string;
  getContactName: (id: number | null) => string;
  getTotalFee: (id: number | null) => string;
  getLatestNote: (fileId: number) => string;
  addFileNote: (fileId: number, noteText: string) => Promise<void>;
  editStatus: number | null;
  setEditStatus: (id: number | null) => void;
  showAddNote: number | null;
  setShowAddNote: (id: number | null) => void;
  noteText: string | '';
  setNoteText: (text: string) => void;
  handleIsImportandChange: (file: FileRecord) => void;
  updateFile: (file: Partial<FileRecord>) => Promise<void>;
  getReminderDueClass: (file: FileRecord) => string;
  getStatusClass: (file: FileRecord) => string;
  onRightClick: (event: React.MouseEvent, contextType: string, contextId: number) => void;
  setSelectedFile: (file: FileRecord) => void;
  setSelectedFee: (fee: FeeRecord) => void;
  openFileDetails: () => void;
}

const FileItem: React.FC<FileItemProps> = React.memo(
  ({
    file,
    getCompanyName,
    getContactName,
    getTotalFee,
    getLatestNote,
    addFileNote,
    editStatus,
    setEditStatus,
    showAddNote,
    setShowAddNote,
    noteText,
    setNoteText,
    updateFile,
    getReminderDueClass,
    getStatusClass,
    onRightClick,
    setSelectedFile,
    setSelectedFee,
    openFileDetails,
  }) => {
    // Add refs for dropdown click-outside detection and column positioning
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const statusColumnRef = useRef<HTMLDivElement>(null);
    const fileNoteColumnRef = useRef<HTMLDivElement>(null);
    const fileNoteEditorRef = useRef<HTMLDivElement>(null);
    const isMountedRef = useRef<boolean>(true);

    // Cleanup on unmount
    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    // State to track dropdown and note editor positions
    const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0 });
    const [noteEditorPosition, setNoteEditorPosition] = React.useState({
      top: 0,
      left: 0,
      maxHeight: 350,
    });

    // State to track if dropdown should open upwards
    const [openUpwards, setOpenUpwards] = React.useState(false);

    // Positioning effect for the dropdown
    useEffect(() => {
      if (editStatus === file.id && statusColumnRef.current) {
        const rect = statusColumnRef.current.getBoundingClientRect();

        // Add class to the parent fileItem to control z-index during dropdown open
        const parentFileItem = statusColumnRef.current.closest('.fileItem');
        if (parentFileItem) {
          parentFileItem.classList.add('status-dropdown-open');
        }

        // Function to calculate and set the final position
        const calculatePosition = () => {
          if (!isMountedRef.current) return; // Prevent state updates on unmounted components

          if (statusDropdownRef.current && statusColumnRef.current) {
            const currentRect = statusColumnRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const dropdownHeight = statusDropdownRef.current.offsetHeight;

            // Check available space below and above
            const spaceBelow = windowHeight - currentRect.bottom;
            const spaceAbove = currentRect.top;

            // Determine if dropdown should open upwards
            // Only open upwards if there's not enough space below AND there's more space above than below
            const shouldOpenUpwards = spaceBelow < dropdownHeight + 10 && spaceAbove > spaceBelow;

            // Update state to reflect direction (with mount check)
            if (isMountedRef.current) {
              setOpenUpwards(shouldOpenUpwards);

              let topPosition;
              if (shouldOpenUpwards) {
                // When opening upwards, make sure it doesn't go above the viewport
                const proposedTopPosition = currentRect.top - dropdownHeight + 5;
                topPosition = Math.max(10, proposedTopPosition); // Ensure at least 10px from top of screen
              } else {
                topPosition = currentRect.top - 5;
              }

              setDropdownPosition({
                top: topPosition,
                left: currentRect.left - 5,
              });
            }
          }
        };

        // Set initial position immediately
        setDropdownPosition({
          top: rect.top - 5,
          left: rect.left - 5,
        });

        // Calculate final position after a small delay to ensure dropdown is rendered
        const positionTimeout = setTimeout(calculatePosition, 10);

        return () => {
          clearTimeout(positionTimeout);
        };
      }
    }, [editStatus, file.id]);

    // Effect to close dropdown when clicking outside or pressing Escape

    // Effect to close dropdown when clicking outside or pressing Escape
    useEffect(() => {
      if (editStatus === file.id) {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            statusDropdownRef.current &&
            !statusDropdownRef.current.contains(event.target as Node)
          ) {
            setEditStatus(null);
            setOpenUpwards(false); // Reset direction state
            // Remove the class when dropdown closes
            const fileItems = document.querySelectorAll('.fileItem');
            fileItems.forEach((item) => item.classList.remove('status-dropdown-open'));
          }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            setEditStatus(null);
            setOpenUpwards(false); // Reset direction state
            // Remove the class when dropdown closes
            const fileItems = document.querySelectorAll('.fileItem');
            fileItems.forEach((item) => item.classList.remove('status-dropdown-open'));
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleKeyDown);
        };
      }
    }, [editStatus, file.id, setEditStatus]);

    const handleCancelNote = useCallback(() => {
      setShowAddNote(null);
      // Remove the class when note editor closes
      const fileItems = document.querySelectorAll('.fileItem');
      fileItems.forEach((item) => item.classList.remove('note-editor-open'));
    }, [setShowAddNote]);

    // Effect to position note editor when it opens
    useEffect(() => {
      if (showAddNote === file.id && fileNoteColumnRef.current) {
        const rect = fileNoteColumnRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Calculate ideal position (centered on the note column)
        const initialLeft = rect.left + rect.width / 2 - 250; // 500px wide editor centered on column

        // Make sure it doesn't go off-screen horizontally
        const left = Math.max(20, Math.min(initialLeft, windowWidth - 520));

        // Constants for editor sizing
        const minEditorHeight = 200; // Minimum usable height for the editor
        const maxEditorHeight = 350; // Maximum preferred height
        const editorHeaderFooterHeight = 100; // Approximate height of header + footer + padding
        const padding = 20; // Padding from screen edges

        // Check available space above and below
        const spaceBelow = windowHeight - rect.bottom - padding;
        const spaceAbove = rect.top - padding;

        let top;
        let maxHeight;

        // Determine if we should position above or below
        const preferredHeightWithChrome = maxEditorHeight + editorHeaderFooterHeight;

        if (spaceBelow >= preferredHeightWithChrome) {
          // Enough space below - position below the note column
          top = rect.bottom + 10;
          maxHeight = Math.min(maxEditorHeight, spaceBelow - editorHeaderFooterHeight);
        } else if (spaceAbove >= preferredHeightWithChrome) {
          // Not enough space below but enough above - position above the note column
          const editorTotalHeight =
            Math.min(maxEditorHeight, spaceAbove - editorHeaderFooterHeight) +
            editorHeaderFooterHeight;
          top = rect.top - editorTotalHeight - 10;
          maxHeight = Math.min(maxEditorHeight, spaceAbove - editorHeaderFooterHeight);
        } else {
          // Limited space both above and below - choose the side with more space
          if (spaceBelow > spaceAbove) {
            // Position below with compressed height
            top = rect.bottom + 10;
            maxHeight = Math.max(minEditorHeight, spaceBelow - editorHeaderFooterHeight);
          } else {
            // Position above with compressed height
            const availableHeight = Math.max(
              minEditorHeight,
              spaceAbove - editorHeaderFooterHeight
            );
            const editorTotalHeight = availableHeight + editorHeaderFooterHeight;
            top = rect.top - editorTotalHeight - 10;
            maxHeight = availableHeight;
          }
        }

        // Ensure the editor doesn't go off screen vertically
        top = Math.max(
          padding,
          Math.min(top, windowHeight - minEditorHeight - editorHeaderFooterHeight - padding)
        );

        setNoteEditorPosition({
          top,
          left,
          maxHeight,
        });

        // Add class to the parent fileItem to control z-index during editor open
        const parentFileItem = fileNoteColumnRef.current.closest('.fileItem');
        if (parentFileItem) {
          parentFileItem.classList.add('note-editor-open');
        }
      }
    }, [showAddNote, file.id]);

    // Effect to close note editor when clicking outside or pressing Escape
    useEffect(() => {
      if (showAddNote === file.id) {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            fileNoteEditorRef.current &&
            !fileNoteEditorRef.current.contains(event.target as Node)
          ) {
            handleCancelNote();
          }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            handleCancelNote();
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleKeyDown);
        };
      }
    }, [showAddNote, file.id, handleCancelNote]);

    const statusOptions = [
      { id: 'NEW', value: 'New' },
      { id: 'SURVEY', value: 'Survey to be done.' },
      { id: 'PRELIM', value: 'Preliminary Report to be done.' },
      { id: 'DOC-RI', value: 'Document Request Initial.' },
      { id: 'DOC-RR', value: 'Document Request Reminder.' },
      { id: 'DOC-RF', value: 'Document Request Final.' },
      { id: 'RPT-BS', value: 'Report basic details to be filled.' },
      { id: 'RPT-C', value: 'Complete full report' },
      { id: 'RPT-D', value: 'Report is written, but not ready' },
      { id: 'RPT-S', value: 'Report is ready to send' },
      { id: 'FEE-R', value: 'Report Sent and Fee Raised' },
      { id: 'FEE-P', value: 'Fee Paid' },
      { id: 'Closed', value: 'Closed' },
    ];

    const handleStatusChange = async (newStatus: string) => {
      const updatedFile: Partial<FileRecord> = {
        id: file.id,
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      try {
        await updateFile(updatedFile);
        setEditStatus(null);
      } catch (error) {
        showErrorToast('Failed to update status.');
      }
    };

    const handleAddNote = async () => {
      if (!noteText.trim()) {
        showErrorToast('Please enter a note');
        return;
      }

      try {
        await addFileNote(file.id, noteText.trim());
        setShowAddNote(null);
        setNoteText('');
        // Remove the class when note editor closes
        const fileItems = document.querySelectorAll('.fileItem');
        fileItems.forEach((item) => item.classList.remove('note-editor-open'));
      } catch (error) {
        showErrorToast('Failed to add note.');
      }
    };

    return (
      <div
        className={`fileItem ${getStatusClass(file)} ${getReminderDueClass(file)}`}
        onContextMenu={(e) => onRightClick(e, 'file', file.id)}
        onClick={() => {
          setSelectedFile(file);
          setSelectedFee({} as FeeRecord);
        }}
        onDoubleClick={() => {
          setSelectedFile(file);
          setSelectedFee({} as FeeRecord);
          openFileDetails();
        }}
      >
        <div className="FileNumberColumn">{file.id}</div>
        <div className="vertSeperator"></div>
        <div className="StatusColumn" ref={statusColumnRef}>
          <span onDoubleClick={() => setEditStatus(file.id)}>{file.status}</span>
          {editStatus === file.id &&
            ReactDOM.createPortal(
              <div
                className={`custom-status-dropdown ${openUpwards ? 'dropdown-open-up' : 'dropdown-open-down'}`}
                ref={statusDropdownRef}
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  maxHeight: openUpwards ? `${Math.min(350, dropdownPosition.top - 10)}px` : '60vh', // Limit height when opening upwards
                }}
              >
                {statusOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`custom-status-option ${file.status === option.id ? 'selected' : ''}`}
                    onClick={() => handleStatusChange(option.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleStatusChange(option.id);
                      } else if (e.key === 'Escape') {
                        setEditStatus(null);
                      }
                    }}
                  >
                    {option.value}
                  </div>
                ))}
                <div
                  className="custom-status-option cancel-option"
                  onClick={() => setEditStatus(null)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setEditStatus(null);
                    }
                  }}
                >
                  Cancel
                </div>
              </div>,
              document.body // Mount the dropdown directly to the body to avoid clipping
            )}
        </div>
        <div className="vertSeperator"></div>
        <div
          className="InsuredColumn"
          onContextMenu={(e) => onRightClick(e, 'company', file.insured_id || 0)}
        >
          {getCompanyName(file.insured_id)}
        </div>
        <div className="vertSeperator"></div>
        <div
          className="PrincipalColumn"
          onContextMenu={(e) => onRightClick(e, 'company', file.principal_id || 0)}
        >
          {getCompanyName(file.principal_id)}
        </div>
        <div className="vertSeperator"></div>
        <div
          className="PrincipalContactColumn"
          onContextMenu={(e) => onRightClick(e, 'contact', file.principal_contact_id || 0)}
        >
          {getContactName(file.principal_contact_id)}
        </div>
        <div className="vertSeperator"></div>
        <div className="PrincipalRefColumn">{file.principal_ref}</div>
        <div className="vertSeperator"></div>
        <div className="LastUpdatedColumn">
          <span>{convertToLocalDate(file.updated_at || '')}</span>
        </div>
        <div className="vertSeperator"></div>
        <div className="FileNoteColumn" ref={fileNoteColumnRef}>
          <span
            onDoubleClick={() => {
              setNoteText('');
              setShowAddNote(file.id);
            }}
            onClick={() => {
              setNoteText('');
              setShowAddNote(file.id);
            }}
            title={getLatestNote(file.id) || 'Click to add note...'}
            className="file-note-text"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setNoteText('');
                setShowAddNote(file.id);
              }
            }}
          >
            {getLatestNote(file.id) || 'Click to add note...'}
          </span>
          {showAddNote === file.id &&
            ReactDOM.createPortal(
              <div
                className="file-note-editor"
                ref={fileNoteEditorRef}
                style={{
                  top: `${noteEditorPosition.top}px`,
                  left: `${noteEditorPosition.left}px`,
                  minHeight: '200px', // Ensure minimum usable height
                }}
              >
                <div className="file-note-editor-header">
                  <h3>Edit File Note</h3>
                </div>
                <div
                  className="file-note-editor-content"
                  style={{
                    height: `${noteEditorPosition.maxHeight}px`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter your file notes here..."
                    autoFocus
                    style={{
                      flex: 1,
                      resize: 'none',
                      minHeight: '150px', // Ensure minimum readable height
                    }}
                    onKeyDown={(e) => {
                      // Allow Ctrl+Enter or Cmd+Enter to save
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNote();
                      }
                      // Escape key to cancel
                      else if (e.key === 'Escape') {
                        e.preventDefault();
                        handleCancelNote();
                      }
                    }}
                  />
                </div>
                <div className="file-note-editor-footer">
                  <button className="save-note-btn" onClick={handleAddNote}>
                    Save Note
                  </button>
                  <button className="cancel-note-btn" onClick={handleCancelNote}>
                    Cancel
                  </button>
                </div>
              </div>,
              document.body // Mount the editor directly to the body to avoid clipping
            )}
        </div>
        <div className="vertSeperator"></div>
        <div
          className="TotalFeeColumn"
          onContextMenu={(e) => onRightClick(e, 'file', file.id)}
        >{`R ${getTotalFee(file.id)}`}</div>
      </div>
    );
  }
);

export default FileItem;
