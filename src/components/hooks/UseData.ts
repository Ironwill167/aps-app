import { useQuery } from '@tanstack/react-query';
import {
  fetchContacts,
  fetchCompanies,
  fetchFiles,
  fetchOutstandingDocuments,
  fetchFileDocuments,
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
  useAddOutstandingDoc,
  useUpdateOutstandingDoc,
  useDeleteOutstandingDoc,
  useAddFileDocument,
  useUpdateFileDocument,
  useDeleteFileDocument,
  useAddCauseOfLoss,
  useUpdateCauseOfLoss,
  useDeleteCauseOfLoss,
  useAddAdditionalParty,
  useUpdateAdditionalParty,
  useDeleteAdditionalParty,
  useAddFee,
  useUpdateFee,
  useDeleteFee,
  useAddInvoiceRate,
  useUpdateInvoiceRate,
  useDeleteInvoiceRate,
} from './UseMutations';

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

  /* -------------------- Outstanding Documents -------------------- */
  const {
    data: outstandingDocuments = [],
    isLoading: outstandingDocumentsLoading,
    error: outstandingDocumentsError,
  } = useQuery({
    queryKey: ['outstandingDocuments'],
    queryFn: async () => {
      const res = await fetchOutstandingDocuments();
      return res.data; // OutstandingDocument[]
    },
    initialData: [],
    refetchInterval,
  });

  // Mutations
  const addOutstandingDocument = useAddOutstandingDoc();
  const updateOutstandingDocument = useUpdateOutstandingDoc();
  const deleteOutstandingDocument = useDeleteOutstandingDoc();

  /* -------------------- File Documents -------------------- */
  const {
    data: fileDocuments = [],
    isLoading: fileDocumentsLoading,
    error: fileDocumentsError,
  } = useQuery({
    queryKey: ['fileDocuments'],
    queryFn: async () => {
      const res = await fetchFileDocuments();
      return res.data; // File[]
    },
    initialData: [],
    refetchInterval,
  });

  // Mutations
  const addFileDocument = useAddFileDocument();
  const updateFileDocument = useUpdateFileDocument();
  const deleteFileDocument = useDeleteFileDocument();

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
    data: invoice_rates = [],
    isLoading: invoiceRatesLoading,
    error: invoiceRatesError,
  } = useQuery({
    queryKey: ['invoiceRates'],
    queryFn: async () => {
      const res = await fetchRates();
      return res.data; // InvoiceRates[]
    },
    initialData: [],
    refetchInterval,
  });

  // Mutations
  const addRate = useAddInvoiceRate();
  const updateRate = useUpdateInvoiceRate();
  const deleteRate = useDeleteInvoiceRate();

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

    // Outstanding Documents
    outstandingDocuments,
    outstandingDocumentsLoading,
    outstandingDocumentsError,
    addOutstandingDocument: addOutstandingDocument.mutateAsync,
    updateOutstandingDocument: updateOutstandingDocument.mutateAsync,
    deleteOutstandingDocument: deleteOutstandingDocument.mutateAsync,

    // File Documents
    fileDocuments,
    fileDocumentsLoading,
    fileDocumentsError,
    addFileDocument: addFileDocument.mutateAsync,
    updateFileDocument: updateFileDocument.mutateAsync,
    deleteFileDocument: deleteFileDocument.mutateAsync,

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
    invoice_rates,
    invoiceRatesLoading,
    invoiceRatesError,
    addRate: addRate.mutateAsync,
    updateRate: updateRate.mutateAsync,
    deleteRate: deleteRate.mutateAsync,
  };
};
