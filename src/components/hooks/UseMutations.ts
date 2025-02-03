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
  addFee,
  updateFee,
  deleteFee,
} from './ApiServices';
import { Contact, Company, FileRecord, FeeRecord } from '../types';

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

export const useUpdateFile = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async ({
      id,
      updatedFile,
    }: {
      id: number;
      updatedFile: Partial<FileRecord>;
    }) => {
      const res = await updateFile(id, updatedFile);
      return res.data; // FileRecord
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