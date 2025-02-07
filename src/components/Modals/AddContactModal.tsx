import React, { Suspense } from 'react';
import EntityModal from './EntityModal';
import { Contact, Company } from '../types';
import { useAddContact } from '../hooks/UseMutations';
import { showErrorToast } from '../utils/toast';

interface AddContactModalProps {
  onClose: () => void;
  companies: Company[];
  onContactAdded: (newContact: Contact) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, companies }) => {
  const addContactMutation = useAddContact();

  const handleSave = async (data: Partial<Contact>): Promise<Contact> => {
    try {
      const newContact = await addContactMutation.mutateAsync(data);
      console.log('New Contact:', newContact);
      return newContact;
    } catch (error) {
      console.error('Add Contact Error:', error);
      showErrorToast('Failed to add contact');
      throw error;
    }
  };

  const handleEntityUpdated = () => {
    // Handle post-save actions, e.g., refetch or update state
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntityModal
        mode="add"
        entity="contact"
        onSave={handleSave}
        onClose={onClose}
        onEntityUpdated={handleEntityUpdated}
        companies={companies}
      />
    </Suspense>
  );
};

export default AddContactModal;
