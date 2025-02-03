import React, { Suspense } from 'react';
import EntityModal from './EntityModal';
import { Company } from '../types';
import { useUpdateCompany } from '../hooks/UseMutations';

interface ViewCompanyModalProps {
  onClose: () => void;
  company: Company;
  onCompanyUpdated: (updatedCompany: Company) => void;
}

const ViewCompanyModal: React.FC<ViewCompanyModalProps> = ({
  onClose,
  company,
  onCompanyUpdated,
}) => {
  const updateCompanyMutation = useUpdateCompany();

  const handleSave = async (data: Partial<Company>) => {
    const updatedData = data as Partial<Company>;
    const response = await updateCompanyMutation.mutateAsync({
      id: company.id,
      updatedCompany: updatedData,
    });
    return response;
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntityModal
        mode="edit"
        entity="company"
        initialData={company}
        onSave={handleSave}
        onClose={onClose}
        onEntityUpdated={onCompanyUpdated}
      />
    </Suspense>
  );
};

export default ViewCompanyModal;
