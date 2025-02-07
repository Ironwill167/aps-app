import { useQuery } from '@tanstack/react-query';
import {
  fetchContacts,
  fetchCompanies,
  fetchFiles,
  fetchCausesOfLoss,
  fetchAdditionalParties,
  fetchFees,
  fetchRates,
} from './ApiServices';
import {
  useAddContact,
  useUpdateContact,
  useDeleteContact,
  useAddCompany,
  useUpdateCompany,
  useDeleteCompany,
  useCreateFile,
  useUpdateFile,
  useDeleteFile,
  useAddCauseOfLoss,
  useUpdateCauseOfLoss,
  useDeleteCauseOfLoss,
  useAddAdditionalParty,
  useUpdateAdditionalParty,
  useDeleteAdditionalParty,
  useAddFee,
  useUpdateFee,
  useDeleteFee,
} from './UseMutations';
import { Rates } from '../types';

export const useData = () => {
  const refetchInterval = 30000;

  /* -------------------- Contacts -------------------- */
  const {
    data: contacts = [],
    isLoading: contactsLoading,
    error: contactsError,
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const res = await fetchContacts();
      return res.data; // Contact[]
    },
    initialData: [],
    refetchInterval,
  });

  // Mutations
  const addContact = useAddContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  /* -------------------- Companies -------------------- */
  const {
    data: companies = [],
    isLoading: companiesLoading,
    error: companiesError,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await fetchCompanies();
      return res.data; // Company[]
    },
    initialData: [],
    refetchInterval,
  });

  // Mutations
  const addCompany = useAddCompany();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  /* -------------------- Files -------------------- */
  const {
    data: files = [],
    isLoading: filesLoading,
    error: filesError,
    refetch: refetchFiles,
  } = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const res = await fetchFiles();
      return res.data;
    },
    initialData: [],
    refetchInterval,
  });

  // Mutations
  const createFile = useCreateFile();
  const updateFile = useUpdateFile();
  const deleteFile = useDeleteFile();

  /* -------------------- Causes of Loss -------------------- */
  const {
    data: causesOfLoss = [],
    isLoading: causesOfLossLoading,
    error: causesOfLossError,
  } = useQuery({
    queryKey: ['causesOfLoss'],
    queryFn: async () => {
      const res = await fetchCausesOfLoss();
      return res.data; // CauseOfLoss[]
    },
    initialData: [],
    refetchInterval,
  });

  // Mutations
  const addCauseOfLoss = useAddCauseOfLoss();
  const updateCauseOfLoss = useUpdateCauseOfLoss();
  const deleteCauseOfLoss = useDeleteCauseOfLoss();

  /* -------------------- Additional Parties -------------------- */
  const {
    data: additionalParties = [],
    isLoading: additionalPartiesLoading,
    error: additionalPartiesError,
  } = useQuery({
    queryKey: ['additionalParties'],
    queryFn: async () => {
      const res = await fetchAdditionalParties();
      return res.data; // AdditionalParty[]
    },
    initialData: [],
    refetchInterval,
  });

  // Mutations
  const addAdditionalParty = useAddAdditionalParty();
  const updateAdditionalParty = useUpdateAdditionalParty();
  const deleteAdditionalParty = useDeleteAdditionalParty();

  /* -------------------- Fees -------------------- */
  const {
    data: fees = [],
    isLoading: feesLoading,
    error: feesError,
  } = useQuery({
    queryKey: ['fees'],
    queryFn: async () => {
      const res = await fetchFees();
      return res.data; // FeeRecord[]
    },
    initialData: [],
    refetchInterval,
  });

  // Mutations
  const addFee = useAddFee();
  const updateFee = useUpdateFee();
  const deleteFee = useDeleteFee();

  /* -------------------- Rates -------------------- */
  const {
    data: rates,
    isLoading: ratesLoading,
    error: ratesError,
  } = useQuery<Rates, Error>({
    queryKey: ['rates'],
    queryFn: async () => {
      const res = await fetchRates();
      return res.data; // Rates
    },
    initialData: {
      surveyHourlyRate: 0,
      reportHourlyRate: 0,
      adminHourlyRate: 0,
      travelHourlyRate: 0,
      travelKmRate: 0,
    },
  });
  return {
    // Contacts
    contacts,
    contactsLoading,
    contactsError,
    addContact: addContact.mutateAsync,
    updateContact: updateContact.mutateAsync,
    deleteContact: deleteContact.mutateAsync,

    // Companies
    companies,
    companiesLoading,
    companiesError,
    addCompany: addCompany.mutateAsync,
    updateCompany: updateCompany.mutateAsync,
    deleteCompany: deleteCompany.mutateAsync,

    // Files
    files,
    filesLoading,
    filesError,
    createFile: createFile.mutateAsync,
    updateFile: updateFile.mutateAsync,
    deleteFile: deleteFile.mutateAsync,
    refetchFiles,

    // Causes of Loss
    causesOfLoss,
    causesOfLossLoading,
    causesOfLossError,
    addCauseOfLoss: addCauseOfLoss.mutateAsync,
    updateCauseOfLoss: updateCauseOfLoss.mutateAsync,
    deleteCauseOfLoss: deleteCauseOfLoss.mutateAsync,

    // Additional Parties
    additionalParties,
    additionalPartiesLoading,
    additionalPartiesError,
    addAdditionalParty: addAdditionalParty.mutateAsync,
    updateAdditionalParty: updateAdditionalParty.mutateAsync,
    deleteAdditionalParty: deleteAdditionalParty.mutateAsync,

    // Fees
    fees,
    feesLoading,
    feesError,
    addFee: addFee.mutateAsync,
    updateFee: updateFee.mutateAsync,
    deleteFee: deleteFee.mutateAsync,

    // Rates
    rates,
    ratesLoading,
    ratesError,
  };
};
