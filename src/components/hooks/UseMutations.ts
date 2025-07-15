import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../utils/SocketContext';
import {
  addContact,
  updateContact,
  deleteContact,
  addCompany,
  updateCompany,
  deleteCompany,
  updateFile,
  deleteFile,
  createFile,
  addOutstandingDocument,
  updateOutstandingDocument,
  deleteOutstandingDocument,
  addFileDocument,
  updateFileDocument,
  deleteFileDocument,
  addCauseOfLoss,
  addAdditionalParty,
  updateAdditionalParty,
  deleteAdditionalParty,
  updateCauseOfLoss,
  deleteCauseOfLoss,
  addFee,
  updateFee,
  deleteFee,
  addRate,
  updateRate,
  deleteRate,
  sendEmail,
  addFileNote,
  updateFileNote,
  deleteFileNote,
} from './ApiServices';
import {
  Contact,
  Company,
  FileRecord,
  CauseOfLoss,
  AdditionalParty,
  FeeRecord,
  OutstandingDocument,
  FileDocument,
  InvoiceRates,
  EmailSendRequest,
  FileNote,
} from '../types';

/* -------------------- Contacts -------------------- */
export const useAddContact = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  return useMutation({
    mutationFn: async (contact: Partial<Contact>) => {
      const res = await addContact(contact);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      socket?.emit('dataChanged', { type: 'contacts' });
    },
    onError: (error: Error) => {
      console.error('Add Contact Error:', error);
    },
  });
};

export interface UpdateContactParams {
  id: number;
  updatedContact: Partial<Contact>;
}

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  return useMutation({
    mutationFn: async (params: UpdateContactParams) => {
      const res = await updateContact(params.id, params.updatedContact);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      socket?.emit('dataChanged', { type: 'contacts' });
    },
    onError: (error: Error) => {
      console.error('Update Contact Error:', error);
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteContact(id);
      return res.data; // string
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      socket?.emit('dataChanged', { type: 'contacts' });
    },
    onError: (error: Error) => {
      console.error('Delete Contact Error:', error);
    },
  });
};

/* -------------------- Companies -------------------- */
export const useAddCompany = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  return useMutation({
    mutationFn: async (company: Partial<Company>) => {
      const res = await addCompany(company);
      return res.data; // Company
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      socket?.emit('dataChanged', { type: 'companies' });
    },
    onError: (error: Error) => {
      console.error('Add Company Error:', error);
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async ({
      id,
      updatedCompany,
    }: {
      id: number;
      updatedCompany: Partial<Company>;
    }) => {
      const res = await updateCompany(id, updatedCompany);
      return res.data; // Company
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      socket?.emit('dataChanged', { type: 'companies' });
    },
    onError: (error: Error) => {
      console.error('Update Company Error:', error);
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteCompany(id);
      return res.data; // string
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      socket?.emit('dataChanged', { type: 'companies' });
    },
    onError: (error: Error) => {
      console.error('Delete Company Error:', error);
    },
  });
};

/* -------------------- Files -------------------- */
export const useCreateFile = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation<FileRecord, Error, undefined, unknown>({
    mutationFn: async () => {
      const res = await createFile();
      return res.data; // FileRecord
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      socket?.emit('dataChanged', { type: 'files' });
    },
    onError: (error: Error) => {
      console.error('Create File Error:', error);
    },
  });
};

export interface UpdateFileParams {
  id: number;
  updatedFile: Partial<FileRecord>;
}

export const useUpdateFile = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  return useMutation({
    mutationFn: async ({ id, updatedFile }: UpdateFileParams) => {
      return await updateFile(id, updatedFile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      socket?.emit('dataChanged', { type: 'files' });
    },
    onError: (error: Error) => {
      console.error('Update File Error:', error);
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteFile(id);
      return res.data; // string
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      socket?.emit('dataChanged', { type: 'files' });
    },
    onError: (error: Error) => {
      console.error('Delete File Error:', error);
    },
  });
};

/* -------------------- Outstanding Documents -------------------- */
export const useAddOutstandingDoc = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (outstandingDocument: Partial<OutstandingDocument>) => {
      const res = await addOutstandingDocument(outstandingDocument);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outstandingDocuments'] });
      socket?.emit('dataChanged', { type: 'outstandingDocuments' });
    },
    onError: (error: Error) => {
      console.error('Add Outstanding Document Error:', error);
    },
  });
};

export const useUpdateOutstandingDoc = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async ({
      file_id,
      doc_id,
      updatedOutstandingDoc,
    }: {
      file_id: number;
      doc_id: number;
      updatedOutstandingDoc: Partial<OutstandingDocument>;
    }) => {
      const res = await updateOutstandingDocument(file_id, doc_id, updatedOutstandingDoc);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outstandingDocuments'] });
      socket?.emit('dataChanged', { type: 'outstandingDocuments' });
    },
    onError: (error: Error) => {
      console.error('Update Outstanding Document Error:', error);
    },
  });
};

export const useDeleteOutstandingDoc = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async ({ file_id, doc_id }: { file_id: number; doc_id: number }) => {
      const res = await deleteOutstandingDocument(file_id, doc_id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outstandingDocuments'] });
      socket?.emit('dataChanged', { type: 'outstandingDocuments' });
    },
    onError: (error: Error) => {
      console.error('Delete Outstanding Document Error:', error);
    },
  });
};

/* -------------------- File Documents -------------------- */
export const useAddFileDocument = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (fileDoc: Partial<FileDocument>) => {
      const res = await addFileDocument(fileDoc);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileDocuments'] });
      socket?.emit('dataChanged', { type: 'fileDocuments' });
    },
    onError: (error: Error) => {
      console.error('Add File Document Error:', error);
    },
  });
};

export const useUpdateFileDocument = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async ({
      id,
      updatedFileDoc,
    }: {
      id: number;
      updatedFileDoc: Partial<FileDocument>;
    }) => {
      const res = await updateFileDocument(id, updatedFileDoc);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileDocuments'] });
      socket?.emit('dataChanged', { type: 'fileDocuments' });
    },
    onError: (error: Error) => {
      console.error('Update File Document Error:', error);
    },
  });
};

export const useDeleteFileDocument = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteFileDocument(id);
      return res.data; // string
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileDocuments'] });
      socket?.emit('dataChanged', { type: 'fileDocuments' });
    },
    onError: (error: Error) => {
      console.error('Delete File Document Error:', error);
    },
  });
};

/* -------------------- File Notes -------------------- */
export const useAddFileNote = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (fileNote: Partial<FileNote>) => {
      const res = await addFileNote(fileNote);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileNotes'] });
      socket?.emit('dataChanged', { type: 'fileNotes' });
    },
    onError: (error: Error) => {
      console.error('Add File Note Error:', error);
    },
  });
};

export const useUpdateFileNote = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async ({
      id,
      updatedFileNote,
    }: {
      id: number;
      updatedFileNote: Partial<FileNote>;
    }) => {
      const res = await updateFileNote(id, updatedFileNote);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileNotes'] });
      socket?.emit('dataChanged', { type: 'fileNotes' });
    },
    onError: (error: Error) => {
      console.error('Update File Note Error:', error);
    },
  });
};

export const useDeleteFileNote = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteFileNote(id);
      return res.data; // string
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileNotes'] });
      socket?.emit('dataChanged', { type: 'fileNotes' });
    },
    onError: (error: Error) => {
      console.error('Delete File Note Error:', error);
    },
  });
};

/* -------------------- Causes of Loss -------------------- */
export const useAddCauseOfLoss = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (causeOfLoss: Partial<CauseOfLoss>) => {
      const res = await addCauseOfLoss(causeOfLoss);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['causesOfLoss'] });
      socket?.emit('dataChanged', { type: 'causesOfLoss' });
    },
    onError: (error: Error) => {
      console.error('Add Cause of Loss Error:', error);
    },
  });
};

export const useUpdateCauseOfLoss = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async ({
      id,
      updatedCauseOfLoss,
    }: {
      id: number;
      updatedCauseOfLoss: Partial<CauseOfLoss>;
    }) => {
      const res = await updateCauseOfLoss(id, updatedCauseOfLoss);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['causesOfLoss'] });
      socket?.emit('dataChanged', { type: 'causesOfLoss' });
    },
    onError: (error: Error) => {
      console.error('Update Cause of Loss Error:', error);
    },
  });
};

export const useDeleteCauseOfLoss = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteCauseOfLoss(id);
      return res.data; // string
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['causesOfLoss'] });
      socket?.emit('dataChanged', { type: 'causesOfLoss' });
    },
    onError: (error: Error) => {
      console.error('Delete Cause of Loss Error:', error);
    },
  });
};

/* -------------------- Additional Parties -------------------- */
export const useAddAdditionalParty = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (file_id: number) => {
      const res = await addAdditionalParty(file_id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additionalParties'] });
      socket?.emit('dataChanged', { type: 'additionalParties' });
    },
    onError: (error: Error) => {
      console.error('Add Additional Party Error:', error);
    },
  });
};

export const useUpdateAdditionalParty = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async ({
      id,
      updatedAdditionalParty,
    }: {
      id: number;
      updatedAdditionalParty: Partial<AdditionalParty>;
    }) => {
      const res = await updateAdditionalParty(id, updatedAdditionalParty);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additionalParties'] });
      socket?.emit('dataChanged', { type: 'additionalParties' });
    },
    onError: (error: Error) => {
      console.error('Update Additional Party Error:', error);
    },
  });
};

export const useDeleteAdditionalParty = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteAdditionalParty(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additionalParties'] });
      socket?.emit('dataChanged', { type: 'additionalParties' });
    },
    onError: (error: Error) => {
      console.error('Delete Additional Party Error:', error);
    },
  });
};

/* -------------------- Fees -------------------- */
export const useFetchFees = () => {
  // Optional: Implement if you need specific hooks for fetching fees
};

export const useAddFee = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (fee: Partial<FeeRecord>) => {
      const res = await addFee(fee);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      socket?.emit('dataChanged', { type: 'fees' });
    },
    onError: (error: Error) => {
      console.error('Add Fee Error:', error);
    },
  });
};

export const useUpdateFee = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async ({ id, updatedFee }: { id: number; updatedFee: Partial<FeeRecord> }) => {
      const res = await updateFee(id, updatedFee);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      socket?.emit('dataChanged', { type: 'fees' });
    },
    onError: (error: Error) => {
      console.error('Update Fee Error:', error);
    },
  });
};

export const useDeleteFee = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteFee(id);
      return res.data; // string
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      socket?.emit('dataChanged', { type: 'fees' });
    },
    onError: (error: Error) => {
      console.error('Delete Fee Error:', error);
    },
  });
};

/* -------------------- Invoice Rates -------------------- */
export const useFetchInvoiceRates = () => {
  // Optional: Implement if you need specific hooks for fetching invoice rates
};

export const useAddInvoiceRate = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (invoiceRate: Partial<InvoiceRates>) => {
      const res = await addRate(invoiceRate);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoiceRates'] });
      socket?.emit('dataChanged', { type: 'invoiceRates' });
    },
    onError: (error: Error) => {
      console.error('Add Invoice Rate Error:', error);
    },
  });
};

export const useUpdateInvoiceRate = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async ({ id, updatedRate }: { id: number; updatedRate: Partial<InvoiceRates> }) => {
      const res = await updateRate(id, updatedRate);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoiceRates'] });
      socket?.emit('dataChanged', { type: 'invoiceRates' });
    },
    onError: (error: Error) => {
      console.error('Update Invoice Rate Error:', error);
    },
  });
};

export const useDeleteInvoiceRate = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteRate(id);
      return res.data; // string
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoiceRates'] });
      socket?.emit('dataChanged', { type: 'invoiceRates' });
    },
    onError: (error: Error) => {
      console.error('Delete Invoice Rate Error:', error);
    },
  });
};

/* -------------------- Email -------------------- */
export const useSendEmail = () => {
  const { socket } = useSocket();

  return useMutation({
    mutationFn: async (emailData: EmailSendRequest) => {
      const res = await sendEmail(emailData);
      return res;
    },
    onSuccess: () => {
      // Optionally invalidate email-related queries if needed
      socket?.emit('dataChanged', { type: 'email' });
    },
    onError: (error: Error) => {
      console.error('Send Email Error:', error);
    },
  });
};
