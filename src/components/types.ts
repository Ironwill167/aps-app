// src/types.ts
export type ItemType = 'contact' | 'company' | 'file';

export interface Company {
  id: number;
  name: string;
  streetaddress?: string;
  area?: string;
  town?: string;
  province?: string;
  country?: string;
  company_type?: string;
  vat_no?: string;
}

export interface Contact {
  id: number;
  name: string;
  surname?: string;
  email?: string;
  contact_no?: string;
  company_contact_no?: string;
  position?: string;
  company_id?: number;
}

export interface FileRecord {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  insured_id: number | null;
  insured_contact_id: number | null;
  broker_id: number | null;
  broker_contact_id: number | null;
  principal_id: number | null;
  principal_contact_id: number | null;
  principal_ref: string;
  date_of_loss: string;
  subject_matter: string;
  fee_id: number | null;
  file_note: string;
  diary_date: string;
  is_important: string;
  cause_of_loss_id: number | null;
  estimate_of_loss: number;
  preliminary_findings: string;
  claim_currency: string;
}

export interface CauseOfLoss {
  id: number;
  col_name: string;
  col_description: string;
}

export interface AdditionalParty {
  id: number;
  file_id: number;
  adp_name: string;
  adp_company_id: number;
  adp_contact_id: number;
}

export interface FileDocument {
  id: number;
  name: string;
  description: string;
  long_description: string;
  category: string;
}

export interface OutstandingDocument {
  file_id: number;
  doc_id: number;
  from_company_id: number;
  from_contact_id: number;
  is_required: boolean;
  is_received: boolean;
  long_description: boolean;
}

export interface FeeRecord {
  id: number;
  file_id: number;
  total_fee: number;
  handling_time: number;
  travel_time: number;
  travel_km: number;
  survey_time: number;
  report_time: number;
  fee_raised: number;
  inv_date: string;
  fee_paid: number;
  aps_cut: number;
  mannie_cut: number;
  elize_cut: number;
  willie_cut: number;
  other_cut: number;
  sundries_amount: number;
  sundries_description: string;
  total_description: string;
  is_manual_total_fee?: boolean;
  invoice_rate_preset: number;
}

export interface InvoiceRates {
  id: number;
  rate_preset_currency: string;
  rate_preset_name: string;
  survey_hourly_rate: number;
  report_hourly_rate: number;
  admin_hourly_rate: number;
  travel_hourly_rate: number;
  travel_km_rate: number;
  rate_preset_description: string;
}

export interface FileContext {
  type: 'file';
  item: FileRecord;
  fee?: FeeRecord;
}

export interface FeeContext {
  type: 'fee';
  item: FeeRecord;
}

export interface ContactContext {
  type: 'contact';
  item: Contact;
}

export interface CompanyContext {
  type: 'company';
  item: Company;
}

export type ContextMenuItem = FileContext | ContactContext | CompanyContext | FeeContext;
