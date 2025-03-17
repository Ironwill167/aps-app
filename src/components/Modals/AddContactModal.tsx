import React from 'react';
import EntityModal from './EntityModal';
import { Contact, Company } from '../types';
import { useAddContact } from '../hooks/UseMutations';
import { showErrorToast } from '../utils/toast';

interface AddContactModalProps {
  onClose: (e?: React.MouseEvent) => void;
  companies: Company[];
  onContactAdded: (newContact: Contact) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({
  onClose,
  companies,
  onContactAdded,
}) => {
  const addContactMutation = useAddContact();

  console.log('AddContactModal rendered');

  const handleSave = async (data: Partial<Contact>): Promise<Contact> => {
    try {
      console.log('AddContactModal handleSave called with:', data);
      const newContact = await addContactMutation.mutateAsync(data);
      console.log('New Contact created:', newContact);
      // Success - now explicitly call onContactAdded

      return newContact;
    } catch (error) {
      console.error('Add Contact Error:', error);
      showErrorToast('Failed to add contact');
      throw error;
    }
  };

  const handleEntityUpdated = (contact: Contact) => {
    console.log('Contact created - calling onContactAdded with:', contact);
    setTimeout(() => {
      onContactAdded(contact);
    }, 0);
  };

  const handleModalClose = (e?: React.MouseEvent) => {
    console.log('AddContactModal close triggered');
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    onClose(e);
  };

  return (
    <div className="add-contact-modal-container" onClick={(e) => e.stopPropagation()}>
      <EntityModal
        mode="add"
        entity="contact"
        onSave={handleSave}
        onClose={handleModalClose}
        onEntityUpdated={handleEntityUpdated}
        companies={companies}
      />
    </div>
  );
};

export default AddContactModal;
