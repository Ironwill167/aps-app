import axios, { AxiosResponse } from 'axios';
import { BaseUrl } from '../config';
import { Company, Contact, FileRecord, FeeRecord, Rates } from '../types';

interface APIResponse<T> {
  data: T;
}

const api = axios.create({
  baseURL: BaseUrl,
});

// Error handling for API calls
const handleError = (error: unknown): never => {
  let errorMessage = 'An unknown error occurred';
  if (axios.isAxiosError(error)) {
    if (error.response) {
      errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'No response received from server';
    } else {
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  console.error('API Error:', errorMessage);
  throw new Error(errorMessage);
};

// -------------------- Contacts API --------------------

// Fetch all contacts
export const fetchContacts = async (): Promise<APIResponse<Contact[]>> => {
  try {
    const response: AxiosResponse<Contact[]> = await api.get('/api/people');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add a new contact
export const addContact = async (contact: Partial<Contact>): Promise<APIResponse<Contact>> => {
  try {
    const response: AxiosResponse<Contact> = await api.post('/api/people', contact);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Update an existing contact
export const updateContact = async (id: number, contact: Partial<Contact>): Promise<Contact> => {
  try {
    const response: AxiosResponse<Contact> = await api.put(`/api/people/${id}`, contact);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Delete a contact
export const deleteContact = async (id: number): Promise<APIResponse<string>> => {
  try {
    await api.delete(`/api/people/${id}`);
    return { data: `Contact deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// -------------------- Companies API --------------------

// Fetch all companies
export const fetchCompanies = async (): Promise<APIResponse<Company[]>> => {
  try {
    const response: AxiosResponse<Company[]> = await api.get('/api/companies');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add a new company
export const addCompany = async (company: Partial<Company>): Promise<APIResponse<Company>> => {
  try {
    const response: AxiosResponse<Company> = await api.post('/api/companies', company);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Update an existing company
export const updateCompany = async (
  id: number,
  company: Partial<Company>
): Promise<APIResponse<Company>> => {
  try {
    const response: AxiosResponse<Company> = await api.put(`/api/companies/${id}`, company);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete a company
export const deleteCompany = async (id: number): Promise<APIResponse<string>> => {
  try {
    await api.delete(`/api/companies/${id}`);
    return { data: `Company deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// -------------------- Files API --------------------

// Fetch all files with related data
export const fetchFiles = async (): Promise<APIResponse<FileRecord[]>> => {
  try {
    const response: AxiosResponse<FileRecord[]> = await api.get('/api/files');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Create a new file
export const createFile = async (): Promise<APIResponse<FileRecord>> => {
  try {
    const response: AxiosResponse<FileRecord> = await api.post('/api/files', {
      status: 'NEW', // Set default status or any required fields
      // Add other minimal fields if necessary
    });
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Update an existing file
export const updateFile = async (
  id: number,
  file: Partial<FileRecord>
): Promise<APIResponse<FileRecord>> => {
  try {
    const response: AxiosResponse<FileRecord> = await api.put(`/api/files/${id}`, file);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete a file
export const deleteFile = async (id: number): Promise<APIResponse<string>> => {
  try {
    await api.delete(`/api/files/${id}`);
    return { data: `File deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// -------------------- Fees API --------------------

// Fetch all fees
export const fetchFees = async (): Promise<APIResponse<FeeRecord[]>> => {
  try {
    const response: AxiosResponse<FeeRecord[]> = await api.get('/api/fees');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add a new fee
export const addFee = async (fee: Partial<FeeRecord>): Promise<APIResponse<FeeRecord>> => {
  try {
    const response: AxiosResponse<FeeRecord> = await api.post('/api/fees', fee);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Update an existing fee
export const updateFee = async (
  id: number,
  fee: Partial<FeeRecord>
): Promise<APIResponse<FeeRecord>> => {
  try {
    const response: AxiosResponse<FeeRecord> = await api.put(`/api/fees/${id}`, fee);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete a fee
export const deleteFee = async (id: number): Promise<APIResponse<string>> => {
  try {
    await api.delete(`/api/fees/${id}`);
    return { data: `Fee deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// Fetch Variables from backend
export const fetchRates = async (): Promise<APIResponse<Rates>> => {
  try {
    const response = await api.get('/api/rates');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};
