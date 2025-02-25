"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on: (...args) => electron.ipcRenderer.on(...args),
  off: (...args) => electron.ipcRenderer.off(...args),
  send: (...args) => electron.ipcRenderer.send(...args),
  invoke: (...args) => electron.ipcRenderer.invoke(...args)
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  showContextMenu: (contextType, contextId) => {
    electron.ipcRenderer.send("show-context-menu", contextType, contextId);
  },
  onContextMenuAction: (callback) => {
    electron.ipcRenderer.on("context-menu-action", (event, action, contextType, contextId) => {
      callback(action, contextType, contextId);
      console.log(`${event} sent back.`);
    });
  },
  offContextMenuAction: (callback) => {
    electron.ipcRenderer.removeListener("context-menu-action", (event, action, contextType, contextId) => {
      callback(action, contextType, contextId);
      console.log(`${event} sent back.`);
    });
  },
  generateInvoicePdf: (invoiceData) => {
    return electron.ipcRenderer.invoke("generate-invoice-pdf", invoiceData);
  },
  onInvoiceData: (callback) => {
    electron.ipcRenderer.on("invoice-data", (_event, data) => callback(data));
  },
  sendInvoiceRendered: () => {
    electron.ipcRenderer.send("invoice-rendered");
  }
  // ... other API methods
});
