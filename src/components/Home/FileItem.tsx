import React from 'react';
import { FileRecord, FeeRecord } from '../types';
import { showErrorToast } from '../utils/toast';
import { convertToLocalDate } from '../utils/DateUtils';

interface FileItemProps {
  file: FileRecord;
  getCompanyName: (id: number | null) => string;
  getContactName: (id: number | null) => string;
  getTotalFee: (id: number | null) => string;
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

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStatus = e.target.value;
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
      const updatedFile: Partial<FileRecord> = {
        id: file.id,
        file_note: noteText,
        updated_at: new Date().toISOString(),
      };
      try {
        await updateFile(updatedFile);
        setShowAddNote(null);
      } catch (error) {
        showErrorToast('Failed to add note.');
      }
    };

    const handleCancelNote = () => {
      setShowAddNote(null);
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
        <div className="StatusColumn">
          {editStatus === file.id ? (
            <select
              value={file.status || ''}
              className="actionStatusSelect"
              onChange={handleStatusChange}
              onBlur={() => setEditStatus(null)}
              autoFocus
            >
              {statusOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.value}
                </option>
              ))}
            </select>
          ) : (
            <span onDoubleClick={() => setEditStatus(file.id)}>{file.status}</span>
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
        <div className="FileNoteColumn">
          {showAddNote === file.id ? (
            <div className="AddNoteContainer">
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} />
              <div className="AddNoteButtons">
                <button className="ConfirmButton" onClick={handleAddNote}>
                  ✓
                </button>
                <button className="CancelButton" onClick={() => handleCancelNote()}>
                  X
                </button>
              </div>
            </div>
          ) : (
            <span onDoubleClick={() => setShowAddNote(file.id)}>{file.file_note}</span>
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
