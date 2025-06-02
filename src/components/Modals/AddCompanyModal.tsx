import React, { Suspense } from 'react';
import EntityModal from './EntityModal';
import { Company } from '../types';
import { useAddCompany } from '../hooks/UseMutations';
import { showErrorToast, showSuccessToast } from '../utils/toast';

interface AddCompanyModalProps {
  onClose: () => void;
  onCompanyAdded: (newCompany: Company) => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ onClose, onCompanyAdded }) => {
  const addCompanyMutation = useAddCompany();

  const handleSave = async (data: Partial<Company>) => {
    try {
      console.log('Adding Company: ', data);
      const newCompany = await addCompanyMutation.mutateAsync(data as Partial<Company>);
      console.log('Add Company Response: ', newCompany);

      // Show success message
      showSuccessToast('Company added successfully!');

      return newCompany;
    } catch (error) {
      console.error('Error adding company:', error);
      showErrorToast('Failed to add company');
      throw error;
    }
  };

  const handleEntityUpdated = (newCompany: Company) => {
    console.log('Company added, passing to ViewFileModal:', newCompany);
    // Call the parent's callback to update the field in ViewFileModal
    onCompanyAdded(newCompany);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntityModal
        mode="add"
        entity="company"
        onSave={handleSave}
        onClose={() => {
          console.log('EntityModal closing AddCompanyModal');
          onClose();
        }}
        onEntityUpdated={handleEntityUpdated}
      />
    </Suspense>
  );
};

export default AddCompanyModal;
