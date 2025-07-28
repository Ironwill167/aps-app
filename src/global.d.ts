import { FileRecord, FeeRecord, Company, InvoiceRates } from './components/types';

export {};

declare global {
  interface Window {
    ipcRenderer: {
      on: (channel: string, listener: (...args: unknown[]) => void) => void;
      off: (channel: string, listener: (...args: unknown[]) => void) => void;
      send: (channel: string, ...args: unknown[]) => void;
      invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
    };
    electronAPI: {
      showContextMenu: (contextType: string, contextId: number) => void;
      onContextMenuAction: (
        callback: (action: string, contextType: string, contextId: number) => void
      ) => void;
      offContextMenuAction: (
        callback: (action: string, contextType: string, contextId: number) => void
      ) => void;
      generateInvoicePdf: (invoiceData: {
        fileDetails: FileRecord;
        feeDetails: FeeRecord;
        companies?: Company[];
        invoiceRates?: InvoiceRates[];
      }) => Promise<string>;
      onInvoiceData: (
        callback: (data: {
          fileDetails: FileRecord;
          feeDetails: FeeRecord;
          companies?: Company[];
          invoiceRates?: InvoiceRates[];
        }) => void
      ) => void;
      sendInvoiceRendered: () => void;

      // Auto-update API
      checkForUpdates: () => Promise<void>;
      quitAndInstall: () => Promise<void>;
      onUpdateStatus: (
        callback: (status: {
          status: string;
          version?: string;
          error?: string;
          progress?: number;
        }) => void
      ) => void;

      // Add other API methods if necessary
    };
  }
}
