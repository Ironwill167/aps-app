import React, { Suspense } from 'react';
import EntityModal from './EntityModal';
import { Contact, Company } from '../types';
import { useUpdateContact } from '../hooks/UseMutations';

interface ViewContactModalProps {
  onClose: () => void;
  contact: Contact;
  companies: Company[];
  onContactUpdated: (updatedContact: Contact) => void;
}

const ViewContactModal: React.FC<ViewContactModalProps> = ({
  onClose,
  contact,
  companies,
  onContactUpdated,
}) => {
  const updateContactMutation = useUpdateContact();

  const handleSave = async (data: Partial<Contact>) => {
    const updatedData = data as Partial<Contact>;
    const response = await updateContactMutation.mutateAsync({
      id: contact.id,
      updatedContact: updatedData,
    });
    return response;
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntityModal
        mode="edit"
        entity="contact"
        initialData={contact}
        onSave={handleSave}
        onClose={onClose}
        onEntityUpdated={onContactUpdated}
        companies={companies}
      />
    </Suspense>
  );
};

export default ViewContactModal;
