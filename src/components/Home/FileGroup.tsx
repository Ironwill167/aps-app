import React from 'react';
import { FeeRecord, FileRecord } from '../types';
import FileItem from './FileItem';

interface FileGroupProps {
  title: string;
  files: FileRecord[];
  getCompanyName: (id: number | null) => string;
  getContactName: (id: number | null) => string;
  getTotalFee: (id: number | null) => string;
  editStatus: number | null;
  setEditStatus: (id: number | null) => void;
  showAddNote: number | null;
  setShowAddNote: (id: number | null) => void;
  noteText: string | '';
  setNoteText: (text: string) => void;
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
            editStatus={editStatus}
            setEditStatus={setEditStatus}
            showAddNote={showAddNote}
            setShowAddNote={setShowAddNote}
            noteText={noteText}
            setNoteText={setNoteText}
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
