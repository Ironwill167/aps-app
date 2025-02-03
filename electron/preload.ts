import { ipcRenderer, contextBridge } from 'electron'
import { FileRecord, FeeRecord } from '../src/components/types';

// Exposing ipcRenderer
contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (...args: Parameters<typeof ipcRenderer.on>) => ipcRenderer.on(...args),
  off: (...args: Parameters<typeof ipcRenderer.off>) => ipcRenderer.off(...args),
  send: (...args: Parameters<typeof ipcRenderer.send>) => ipcRenderer.send(...args),
  invoke: (...args: Parameters<typeof ipcRenderer.invoke>) => ipcRenderer.invoke(...args),
})

// Exposing electronAPI
contextBridge.exposeInMainWorld('electronAPI', {
  showContextMenu: (contextType: string, contextId: number) => {
    ipcRenderer.send('show-context-menu', contextType, contextId);
  },

  onContextMenuAction: (
    callback: (action: string, contextType: string, contextId: number) => void
  ) => {
    ipcRenderer.on('context-menu-action', (event, action: string, contextType: string, contextId: number) => {
      callback(action, contextType, contextId);
      console.log(`${event} sent back.`);
    });
  },

  offContextMenuAction: (
    callback: (action: string, contextType: string, contextId: number) => void
  ) => {
    ipcRenderer.removeListener('context-menu-action', (event, action, contextType, contextId) => {
      callback(action, contextType, contextId);
      console.log(`${event} sent back.`);
    });
  },

  generateInvoicePdf: (invoiceData: { fileDetails: FileRecord; feeDetails: FeeRecord }) => {
    return ipcRenderer.invoke('generate-invoice-pdf', invoiceData);
  },
  onInvoiceData: (callback: (data: { fileDetails: FileRecord; feeDetails: FeeRecord }) => void) => {
    ipcRenderer.on('invoice-data', (_event, data) => callback(data));
  },
  sendInvoiceRendered: () => {
    ipcRenderer.send('invoice-rendered');
  },
  
  // ... other API methods
});