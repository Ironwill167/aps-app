import React, { Suspense } from 'react';
import EntityModal from './EntityModal';
import { Company } from '../types';
import { useAddCompany } from '../hooks/UseMutations';

interface AddCompanyModalProps {
  onClose: () => void;
  onCompanyAdded: (newCompany: Company) => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ onClose, onCompanyAdded }) => {
  const addCompanyMutation = useAddCompany();

  const handleSave = async (data: Partial<Company>) => {
    console.log('Adding Company: ', data);
    const response = await addCompanyMutation.mutateAsync(data as Partial<Company>);
    console.log('Add Company Response: ', response);
    return response;
  };

  const handleEntityUpdated = (newCompany: Company) => {
    onCompanyAdded(newCompany);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntityModal
        mode="add"
        entity="company"
        onSave={handleSave}
        onClose={onClose}
        onEntityUpdated={handleEntityUpdated}
      />
    </Suspense>
  );
};

export default AddCompanyModal;
