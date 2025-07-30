import React, { useState, useEffect, useCallback } from 'react';
import { FileNote, FileRecord } from '../types';
import { fetchFileNotesByFileId } from '../hooks/ApiServices';
import { useData } from '../hooks/UseData';
import { showErrorToast, showSuccessToast } from '../utils/toast';

interface FileNotesModalProps {
  file: FileRecord;
  onClose: () => void;
  onNotesUpdated: () => void;
}

const FileNotesModal: React.FC<FileNotesModalProps> = ({ file, onClose, onNotesUpdated }) => {
  const { addFileNote, deleteFileNote, updateFileNote } = useData();
  const [notes, setNotes] = useState<FileNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNoteText, setNewNoteText] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  // Fetch notes for this file
  const fetchNotes = useCallback(async () => {
    try {
      const result = await fetchFileNotesByFileId(file.id);
      if (result.data) {
        // Sort notes by date (newest first) - improved to handle TIMESTAMPTZ
        const sortedNotes = result.data.sort((a, b) => {
          const dateA = new Date(a.note_date);
          const dateB = new Date(b.note_date);

          // Handle invalid dates
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;

          return dateB.getTime() - dateA.getTime();
        });
        setNotes(sortedNotes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      showErrorToast('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [file.id]);

  // Add a new note
  const addNote = async () => {
    if (!newNoteText.trim()) {
      showErrorToast('Please enter a note');
      return;
    }

    setAdding(true);
    try {
      const result = await addFileNote({
        file_id: file.id,
        note_text: newNoteText.trim(),
        // Don't send note_date - let the backend handle it with current timestamp
      });

      if (result) {
        // Add new note and re-sort (newest first) - improved to handle TIMESTAMPTZ
        const updatedNotes = [...notes, result].sort((a, b) => {
          const dateA = new Date(a.note_date);
          const dateB = new Date(b.note_date);

          // Handle invalid dates
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;

          return dateB.getTime() - dateA.getTime();
        });
        setNotes(updatedNotes);
        setNewNoteText('');
        showSuccessToast('Note added successfully');
        onNotesUpdated();
      }
    } catch (error) {
      console.error('Error adding note:', error);
      showErrorToast('Failed to add note');
    } finally {
      setAdding(false);
    }
  };

  // Delete a note
  const deleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await deleteFileNote(noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
      showSuccessToast('Note deleted successfully');
      onNotesUpdated();
    } catch (error) {
      console.error('Error deleting note:', error);
      showErrorToast('Failed to delete note');
    }
  };

  // Start editing a note
  const startEditing = (note: FileNote) => {
    setEditingNoteId(note.id);
    setEditNoteText(note.note_text);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditNoteText('');
  };

  // Update a note
  const updateNote = async (noteId: number) => {
    if (!editNoteText.trim()) {
      showErrorToast('Please enter a note');
      return;
    }

    try {
      console.log('Updating note with ID:', noteId);

      // Only send the note_text for updates - don't include any other fields
      // This ensures the backend won't try to update note_date or any other fields
      const updateData = {
        note_text: editNoteText.trim(),
      };

      console.log('Update data:', updateData);

      const result = await updateFileNote({
        id: noteId,
        updatedFileNote: updateData,
      });

      if (result) {
        // Update the note in the local state and re-sort
        const updatedNotes = notes
          .map((note) => (note.id === noteId ? { ...note, note_text: editNoteText.trim() } : note))
          .sort((a, b) => {
            const dateA = new Date(a.note_date);
            const dateB = new Date(b.note_date);

            // Handle invalid dates
            if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
            if (isNaN(dateA.getTime())) return 1;
            if (isNaN(dateB.getTime())) return -1;

            return dateB.getTime() - dateA.getTime();
          });

        setNotes(updatedNotes);
        setEditingNoteId(null);
        setEditNoteText('');
        showSuccessToast('Note updated successfully');
        onNotesUpdated();
      }
    } catch (error) {
      console.error('Error updating note:', error);
      showErrorToast('Failed to update note');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Invalid Date';
      }

      // Format the date with proper localization
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'for dateString:', dateString);
      return 'Invalid Date';
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (editingNoteId !== null) {
        cancelEditing();
      } else {
        onClose();
      }
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      if (editingNoteId !== null) {
        updateNote(editingNoteId);
      } else {
        addNote();
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  if (loading) {
    return (
      <div className="modal" onClick={onClose}>
        <div
          className="modal-content file-notes-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <p>File Notes - File #{file.id}</p>
            <span
              className="close-modal-button"
              onClick={onClose}
              role="button"
              aria-label="Close Modal"
            >
              &times;
            </span>
          </div>
          <div className="modal-body">
            <div className="loading">Loading notes...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal-content file-notes-modal-content"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <p>File Notes - File #{file.id}</p>
          <span
            className="close-modal-button"
            onClick={onClose}
            role="button"
            aria-label="Close Modal"
          >
            &times;
          </span>
        </div>

        <div className="modal-body">
          {/* Notes history section */}
          <div className="notes-history-section">
            {notes.length === 0 ? (
              <div className="no-notes">No notes found for this file</div>
            ) : (
              <div className="notes-list">
                {notes.map((note) => (
                  <div key={note.id} className="modal-row">
                    <div className="note-item">
                      <div className="note-header">
                        <span className="note-date">{formatDate(note.note_date)}</span>
                        <div className="note-actions">
                          {editingNoteId === note.id ? (
                            <>
                              <button
                                onClick={() => updateNote(note.id)}
                                className="save-note-btn"
                                title="Save changes"
                              >
                                💾
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="cancel-edit-btn"
                                title="Cancel edit"
                              >
                                ❌
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(note)}
                                className="edit-note-btn"
                                title="Edit note"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => deleteNote(note.id)}
                                className="delete-note-btn"
                                title="Delete note"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="note-text">
                        {editingNoteId === note.id ? (
                          <textarea
                            value={editNoteText}
                            onChange={(e) => setEditNoteText(e.target.value)}
                            className="edit-note-textarea"
                            autoFocus
                            rows={3}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                e.preventDefault();
                                updateNote(note.id);
                              } else if (e.key === 'Escape') {
                                e.preventDefault();
                                cancelEditing();
                              }
                            }}
                          />
                        ) : (
                          <span onDoubleClick={() => startEditing(note)}>{note.note_text}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-form-group">
            <label htmlFor="newNote">New Note Text:</label>
            <textarea
              id="newNote"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Enter your note here..."
              rows={3}
              className="inputMedium"
            />
          </div>
          <button
            onClick={addNote}
            disabled={adding || !newNoteText.trim()}
            className="modal-submit"
          >
            {adding ? 'Adding Note...' : 'Add Note'}
          </button>
          <button onClick={onClose} className="modal-cancel">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileNotesModal;
