import { app, BrowserWindow, Menu, ipcMain, MenuItemConstructorOptions, dialog } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { FileRecord, FeeRecord } from '../src/components/types';
import { AppUpdater } from './updater';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;
let appUpdater: AppUpdater | null = null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    autoHideMenuBar: true,
  });
  win.maximize();

  // Initialize auto-updater after window is created
  appUpdater = new AppUpdater(win);

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  //invoice code from here
  ipcMain.handle(
    'generate-invoice-pdf',
    async (event, invoiceData: { fileDetails: FileRecord; feeDetails: FeeRecord }) => {
      console.log(`${event} Received generate-invoice-pdf request:`, invoiceData);
      return new Promise<string>((resolve, reject) => {
        // Create a hidden BrowserWindow to load the InvoicePage
        const printWindow = new BrowserWindow({
          width: 1200,
          height: 1080,
          show: false,
          webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
          },
        });

        // Load the InvoicePage URL
        const invoiceUrl = VITE_DEV_SERVER_URL
          ? `${VITE_DEV_SERVER_URL}#/invoice`
          : `file://${path.join(RENDERER_DIST, 'index.html')}#/invoice`;
        printWindow.loadURL(invoiceUrl);

        // Once the InvoicePage is loaded, send the invoice data
        printWindow.webContents.on('did-finish-load', () => {
          console.log('Sending invoice data to InvoicePage');
          printWindow.webContents.send('invoice-data', invoiceData);
        });

        // Listen for 'invoice-rendered' event
        ipcMain.once('invoice-rendered', async () => {
          console.log('Received invoice-rendered event');
          try {
            const pdf = await printWindow.webContents.printToPDF({
              margins: { top: 0, right: 0, bottom: 0, left: 0 },
              scale: 1.0,
              preferCSSPageSize: true,
              pageSize: 'A4',
              printBackground: true,
            });

            // Prompt user to save the PDF
            const { canceled, filePath } = await dialog.showSaveDialog({
              title: 'Save Fee Invoice PDF',
              defaultPath: `Fee Invoice - APS ${invoiceData.fileDetails.id}.pdf`,
              filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
            });

            if (canceled || !filePath) {
              reject(new Error('Save dialog was canceled.'));
              return;
            }

            // Save the PDF
            fs.writeFileSync(filePath, pdf);

            // Inform the user
            dialog.showMessageBox({
              type: 'info',
              title: 'PDF Generated',
              message: `Fee Invoice has been saved to ${filePath}`,
            });

            resolve(filePath);
          } catch (error) {
            console.error('Failed to generate PDF:', error);
            dialog.showErrorBox(
              'PDF Generation Error',
              'An error occurred while generating the PDF.'
            );
            reject(error);
          } finally {
            printWindow.close();
          }
        });

        // Handle load failures
        printWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
          console.error(`${event}Failed to load InvoicePage: ${errorDescription} (${errorCode})`);
          reject(new Error(`Failed to load InvoicePage: ${errorDescription} (${errorCode})`));
        });

        // Set a timeout to prevent hanging
        setTimeout(() => {
          reject(new Error('PDF generation timed out.'));
          if (!printWindow.isDestroyed()) {
            printWindow.close();
          }
        }, 15000); // 15 seconds timeout
      });
    }
  );
  //invoice code ends here

  // Update-related IPC handlers
  ipcMain.handle('check-for-updates', () => {
    appUpdater?.checkForUpdates();
  });

  ipcMain.handle('quit-and-install', () => {
    appUpdater?.quitAndInstall();
  });

  ipcMain.on('show-context-menu', (event, contextType: string, contextId: number) => {
    const template: MenuItemConstructorOptions[] = [
      //{ role: 'undo' },
      // { role: 'redo' },
      // { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      //{ role: 'delete' },
      { type: 'separator' },
    ];

    switch (contextType) {
      case 'nothing':
        break;
      case 'file':
        template.push(
          {
            label: 'View File Details',
            click: () => {
              win?.webContents.send('context-menu-action', 'viewFile', 'file', contextId);
            },
          },
          {
            label: 'Change Status',
            click: () => {
              win?.webContents.send('context-menu-action', 'changeStatus', 'file', contextId);
            },
          },
          {
            label: 'Edit Note',
            click: () => {
              win?.webContents.send('context-menu-action', 'editNote', 'file', contextId);
            },
          },
          {
            label: 'Edit Fee',
            click: () => {
              win?.webContents.send('context-menu-action', 'editFee', 'file', contextId);
            },
          },
          {
            label: 'Mark as Important',
            click: () => {
              win?.webContents.send('context-menu-action', 'markImportant', 'file', contextId);
            },
          }
        );
        break;

      case 'contact':
        template.push(
          {
            label: 'View Contact Details',
            click: () => {
              win?.webContents.send('context-menu-action', 'viewContact', 'contact', contextId);
            },
          },
          {
            label: 'Copy Email Address',
            click: () => {
              win?.webContents.send('context-menu-action', 'copyEmail', 'contact', contextId);
            },
          }
        );
        break;

      case 'company':
        template.push({
          label: 'View Company Details',
          click: () => {
            win?.webContents.send('context-menu-action', 'viewCompany', 'company', contextId);
          },
        });
        break;

      case 'fee':
        template.push(
          {
            label: 'View File Details',
            click: () => {
              win?.webContents.send('context-menu-action', 'viewFile', 'fee', contextId);
            },
          },
          {
            label: 'Edit Fee',
            click: () => {
              win?.webContents.send('context-menu-action', 'editFee', 'fee', contextId);
            },
          }
        );
        break;

      default:
        break;
    }

    const menu = Menu.buildFromTemplate(template);
    menu.popup({ window: BrowserWindow.fromWebContents(event.sender) || undefined });
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
