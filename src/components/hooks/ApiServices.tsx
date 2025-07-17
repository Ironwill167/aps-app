import axios, { AxiosResponse } from 'axios';
import { AppConfig } from '../config';
import apiClient from '../auth/apiClient';
import {
  Company,
  Contact,
  FileRecord,
  FileDocument,
  OutstandingDocument,
  CauseOfLoss,
  AdditionalParty,
  FeeRecord,
  InvoiceRates,
  EmailSendRequest,
  EmailSendResponse,
  EmailAccountsResponse,
  FileNote,
} from '../types';

interface APIResponse<T> {
  data: T;
}

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
    const response: AxiosResponse<Contact[]> = await apiClient.get('/api/people');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add a new contact
export const addContact = async (contact: Partial<Contact>): Promise<APIResponse<Contact>> => {
  try {
    const response: AxiosResponse<Contact> = await apiClient.post('/api/people', contact);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Update an existing contact
export const updateContact = async (id: number, contact: Partial<Contact>): Promise<Contact> => {
  try {
    const response: AxiosResponse<Contact> = await apiClient.put(`/api/people/${id}`, contact);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Delete a contact
export const deleteContact = async (id: number): Promise<APIResponse<string>> => {
  try {
    await apiClient.delete(`/api/people/${id}`);
    return { data: `Contact deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// -------------------- Companies API --------------------

// Fetch all companies
export const fetchCompanies = async (): Promise<APIResponse<Company[]>> => {
  try {
    const response: AxiosResponse<Company[]> = await apiClient.get('/api/companies');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add a new company
export const addCompany = async (company: Partial<Company>): Promise<APIResponse<Company>> => {
  try {
    const response: AxiosResponse<Company> = await apiClient.post('/api/companies', company);
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
    const response: AxiosResponse<Company> = await apiClient.put(`/api/companies/${id}`, company);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete a company
export const deleteCompany = async (id: number): Promise<APIResponse<string>> => {
  try {
    await apiClient.delete(`/api/companies/${id}`);
    return { data: `Company deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// -------------------- Files API --------------------

// Fetch all files with related data
export const fetchFiles = async (): Promise<APIResponse<FileRecord[]>> => {
  try {
    const response: AxiosResponse<FileRecord[]> = await apiClient.get('/api/files');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Create a new file
export const createFile = async (): Promise<APIResponse<FileRecord>> => {
  try {
    const response: AxiosResponse<FileRecord> = await apiClient.post('/api/files', {
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
    const response = await apiClient.put(`/api/files/${id}`, file);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete a file
export const deleteFile = async (id: number): Promise<APIResponse<string>> => {
  try {
    await apiClient.delete(`/api/files/${id}`);
    return { data: `File deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// -------------------- File Documents API --------------------
// Fetch all documents
export const fetchFileDocuments = async (): Promise<APIResponse<FileDocument[]>> => {
  try {
    const response = await apiClient.get('/api/file_documents');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add a new document
export const addFileDocument = async (
  document: Partial<FileDocument>
): Promise<APIResponse<FileDocument>> => {
  try {
    const response = await apiClient.post('/api/file_documents', document);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Update an existing document
export const updateFileDocument = async (
  id: number,
  document: Partial<FileDocument>
): Promise<APIResponse<FileDocument>> => {
  try {
    const response = await apiClient.put(`/api/file_documents/${id}`, document);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete a document
export const deleteFileDocument = async (id: number): Promise<APIResponse<string>> => {
  try {
    await apiClient.delete(`/api/file_documents/${id}`);
    return { data: `Document deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// -------------------- Outstanding Documents API --------------------
// Fetch outstanding documents for file
export const fetchOutstandingDocuments = async (): Promise<APIResponse<OutstandingDocument[]>> => {
  try {
    const response = await apiClient.get(`/api/outstanding_docs`);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add a new outstanding document
export const addOutstandingDocument = async (
  document: Partial<OutstandingDocument>
): Promise<APIResponse<OutstandingDocument>> => {
  try {
    const response = await apiClient.post('/api/outstanding_docs', document);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Update an existing outstanding document
export const updateOutstandingDocument = async (
  file_id: number,
  doc_id: number,
  document: Partial<OutstandingDocument>
): Promise<APIResponse<OutstandingDocument>> => {
  try {
    const response = await apiClient.put(`/api/outstanding_docs/${file_id}/${doc_id}`, document);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete an outstanding document
export const deleteOutstandingDocument = async (
  file_id: number,
  doc_id: number
): Promise<APIResponse<string>> => {
  try {
    await apiClient.delete(`/api/outstanding_docs/${file_id}/${doc_id}`);
    return { data: `Outstanding document deleted with ID: ${file_id}/${doc_id}` };
  } catch (error) {
    return handleError(error);
  }
};

// -------------------- Causes of Loss API --------------------
// Fetch all causes of loss
export const fetchCausesOfLoss = async (): Promise<APIResponse<CauseOfLoss[]>> => {
  try {
    const response = await apiClient.get('/api/cause_of_loss');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add a new cause of loss
export const addCauseOfLoss = async (
  cause: Partial<CauseOfLoss>
): Promise<APIResponse<CauseOfLoss>> => {
  try {
    const response = await apiClient.post('/api/cause_of_loss', cause);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Update an existing cause of loss
export const updateCauseOfLoss = async (
  id: number,
  cause: Partial<CauseOfLoss>
): Promise<APIResponse<CauseOfLoss>> => {
  try {
    const response = await apiClient.put(`/api/cause_of_loss/${id}`, cause);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete a cause of loss
export const deleteCauseOfLoss = async (id: number): Promise<APIResponse<string>> => {
  try {
    await apiClient.delete(`/api/cause_of_loss/${id}`);
    return { data: `Cause of loss deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// -------------------- Additional Parties API --------------------

// Fetch additional parties for a file
export const fetchAdditionalParties = async (): Promise<APIResponse<AdditionalParty[]>> => {
  try {
    const response = await apiClient.get(`/api/additional_party`);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add a new additional party
export const addAdditionalParty = async (
  file_id: number
): Promise<APIResponse<AdditionalParty>> => {
  try {
    const response: AxiosResponse<AdditionalParty> = await apiClient.post('/api/additional_party', {
      file_id,
    });
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Update an existing additional party
export const updateAdditionalParty = async (
  id: number,
  additionalParty: Partial<AdditionalParty>
): Promise<APIResponse<AdditionalParty>> => {
  try {
    const response = await apiClient.put(`/api/additional_party/${id}`, additionalParty);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete an additional party
export const deleteAdditionalParty = async (id: number): Promise<APIResponse<string>> => {
  try {
    await apiClient.delete(`/api/additional_party/${id}`);
    return { data: `Additional party deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// -------------------- Fees API --------------------

// Fetch all fees
export const fetchFees = async (): Promise<APIResponse<FeeRecord[]>> => {
  try {
    const response: AxiosResponse<FeeRecord[]> = await apiClient.get('/api/fees');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add a new fee
export const addFee = async (fee: Partial<FeeRecord>): Promise<APIResponse<FeeRecord>> => {
  try {
    const response: AxiosResponse<FeeRecord> = await apiClient.post('/api/fees', fee);
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
    const response: AxiosResponse<FeeRecord> = await apiClient.put(`/api/fees/${id}`, fee);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete a fee
export const deleteFee = async (id: number): Promise<APIResponse<string>> => {
  try {
    await apiClient.delete(`/api/fees/${id}`);
    return { data: `Fee deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// Fetch Invoice Rates from backend
export const fetchRates = async (): Promise<APIResponse<InvoiceRates[]>> => {
  try {
    const response: AxiosResponse<InvoiceRates[]> = await apiClient.get('/api/invoice_rates');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add new Invoice Rates Preset
export const addRate = async (rate: Partial<InvoiceRates>): Promise<APIResponse<InvoiceRates>> => {
  try {
    const response: AxiosResponse<InvoiceRates> = await apiClient.post('/api/invoice_rates', rate);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Update Invoice Rates Preset
export const updateRate = async (
  id: number,
  rate: Partial<InvoiceRates>
): Promise<APIResponse<InvoiceRates>> => {
  try {
    const response: AxiosResponse<InvoiceRates> = await apiClient.put(
      `/api/invoice_rates/${id}`,
      rate
    );
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete Invoice Rates Preset
export const deleteRate = async (id: number): Promise<APIResponse<string>> => {
  try {
    await apiClient.delete(`/api/invoice_rates/${id}`);
    return { data: `Invoice Rate deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};

// -------------------- Email API --------------------

// Create email API instance using AppConfig for email endpoints
const emailApi = axios.create({
  baseURL: AppConfig.emailApiUrl,
  headers: {
    'Content-Type': 'application/json',
    'x-electron-app-secret': import.meta.env.VITE_REACT_APP_API_SECRET || 'development-key',
  },
});

// Fetch available email accounts
export const fetchEmailAccounts = async (): Promise<EmailAccountsResponse> => {
  try {
    console.log('Fetching email accounts from:', `${AppConfig.emailApiUrl}/email/accounts`);
    const response: AxiosResponse<EmailAccountsResponse> = await emailApi.get('/email/accounts');
    console.log('Email accounts response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching email accounts:', error);

    // If the backend doesn't have the endpoint, return predefined accounts
    console.log('Backend endpoint not available, using predefined email accounts');
    return {
      success: true,
      accounts: [
        {
          email: 'aps@agprospec.co.za',
          name: 'APS',
          displayName: 'APS (aps@agprospec.co.za)',
        },
        {
          email: 'mannie@agprospec.co.za',
          name: 'Mannie',
          displayName: 'Mannie (mannie@agprospec.co.za)',
        },
        {
          email: 'willie@agprospec.co.za',
          name: 'Willie',
          displayName: 'Willie (willie@agprospec.co.za)',
        },
        {
          email: 'elize@agprospec.co.za',
          name: 'Elize',
          displayName: 'Elize (elize@agprospec.co.za)',
        },
      ],
    };
  }
};

// Send email
export const sendEmail = async (emailData: EmailSendRequest): Promise<EmailSendResponse> => {
  try {
    console.log('Sending email with data:', emailData);
    const response: AxiosResponse<EmailSendResponse> = await emailApi.post(
      '/email/send',
      emailData
    );
    console.log('Email send response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        error: error.response.data?.error || 'Failed to send email',
        details: error.response.data?.details || error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Test email connection
export const testEmailConnection = async (from?: string): Promise<EmailSendResponse> => {
  try {
    const url = from ? `/email/test?from=${encodeURIComponent(from)}` : '/email/test';
    const response: AxiosResponse<EmailSendResponse> = await emailApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error testing email connection:', error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        error: error.response.data?.error || 'Email connection test failed',
        details: error.response.data?.details || error.message,
      };
    }
    return {
      success: false,
      error: 'Email connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// -------------------- File Notes API --------------------

// Fetch all file notes
export const fetchFileNotes = async (): Promise<APIResponse<FileNote[]>> => {
  try {
    const response: AxiosResponse<FileNote[]> = await apiClient.get('/api/file_notes');
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Fetch file notes for a specific file
export const fetchFileNotesByFileId = async (fileId: number): Promise<APIResponse<FileNote[]>> => {
  try {
    const response: AxiosResponse<FileNote[]> = await apiClient.get(
      `/api/file_notes/file/${fileId}`
    );
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Add a new file note
export const addFileNote = async (fileNote: Partial<FileNote>): Promise<APIResponse<FileNote>> => {
  try {
    const response: AxiosResponse<FileNote> = await apiClient.post('/api/file_notes', fileNote);
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Update an existing file note
export const updateFileNote = async (
  id: number,
  fileNote: Partial<FileNote>
): Promise<APIResponse<FileNote>> => {
  try {
    const response: AxiosResponse<FileNote> = await apiClient.put(
      `/api/file_notes/${id}`,
      fileNote
    );
    return { data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Delete a file note
export const deleteFileNote = async (id: number): Promise<APIResponse<string>> => {
  try {
    await apiClient.delete(`/api/file_notes/${id}`);
    return { data: `File note deleted with ID: ${id}` };
  } catch (error) {
    return handleError(error);
  }
};
