import React from 'react';
import { FeeRecord, FileRecord } from '../types';
import FileItem from './FileItem';

interface FileGroupProps {
  title: string;
  files: FileRecord[];
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

const FileGroup: React.FC<FileGroupProps> = ({
  title,
  files,
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
  handleIsImportandChange,
  updateFile,
  getReminderDueClass,
  getStatusClass,
  onRightClick,
  setSelectedFile,
  setSelectedFee,
  openFileDetails,
}) => {
  if (files.length === 0) return null;

  return (
    <div className="filesGroupContainer">
      <p className="actionGroupHeading">{title}</p>
      <div className="filesGroup">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            getCompanyName={getCompanyName}
            getContactName={getContactName}
            getTotalFee={getTotalFee}
            getLatestNote={getLatestNote}
            addFileNote={addFileNote}
            editStatus={editStatus}
            setEditStatus={setEditStatus}
            showAddNote={showAddNote}
            setShowAddNote={setShowAddNote}
            noteText={noteText}
            setNoteText={setNoteText}
            handleIsImportandChange={handleIsImportandChange}
            updateFile={updateFile}
            getReminderDueClass={getReminderDueClass}
            getStatusClass={getStatusClass}
            onRightClick={onRightClick}
            setSelectedFile={setSelectedFile}
            setSelectedFee={setSelectedFee}
            openFileDetails={openFileDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(FileGroup);
