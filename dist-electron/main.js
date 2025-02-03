import { app, BrowserWindow, ipcMain, dialog, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    },
    autoHideMenuBar: true
  });
  win.maximize();
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  ipcMain.handle(
    "generate-invoice-pdf",
    async (event, invoiceData) => {
      console.log(`${event} Received generate-invoice-pdf request:`, invoiceData);
      return new Promise((resolve, reject) => {
        const printWindow = new BrowserWindow({
          width: 1200,
          height: 1080,
          show: false,
          webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
            nodeIntegration: false,
            contextIsolation: true
          }
        });
        const invoiceUrl = VITE_DEV_SERVER_URL ? `${VITE_DEV_SERVER_URL}#/invoice` : `file://${path.join(RENDERER_DIST, "index.html")}#/invoice`;
        printWindow.loadURL(invoiceUrl);
        printWindow.webContents.on("did-finish-load", () => {
          console.log("Sending invoice data to InvoicePage");
          printWindow.webContents.send("invoice-data", invoiceData);
        });
        ipcMain.once("invoice-rendered", async () => {
          console.log("Received invoice-rendered event");
          try {
            const pdf = await printWindow.webContents.printToPDF({
              margins: { top: 0, right: 0, bottom: 0, left: 0 },
              scale: 1,
              preferCSSPageSize: true,
              pageSize: "A4",
              printBackground: true
            });
            const { canceled, filePath } = await dialog.showSaveDialog({
              title: "Save Fee Invoice PDF",
              defaultPath: `Fee Invoice - APS ${invoiceData.fileDetails.id}.pdf`,
              filters: [{ name: "PDF Files", extensions: ["pdf"] }]
            });
            if (canceled || !filePath) {
              reject(new Error("Save dialog was canceled."));
              return;
            }
            fs.writeFileSync(filePath, pdf);
            dialog.showMessageBox({
              type: "info",
              title: "PDF Generated",
              message: `Fee Invoice has been saved to ${filePath}`
            });
            resolve(filePath);
          } catch (error) {
            console.error("Failed to generate PDF:", error);
            dialog.showErrorBox(
              "PDF Generation Error",
              "An error occurred while generating the PDF."
            );
            reject(error);
          } finally {
            printWindow.close();
          }
        });
        printWindow.webContents.on("did-fail-load", (event2, errorCode, errorDescription) => {
          console.error(`${event2}Failed to load InvoicePage: ${errorDescription} (${errorCode})`);
          reject(new Error(`Failed to load InvoicePage: ${errorDescription} (${errorCode})`));
        });
        setTimeout(() => {
          reject(new Error("PDF generation timed out."));
          if (!printWindow.isDestroyed()) {
            printWindow.close();
          }
        }, 15e3);
      });
    }
  );
  ipcMain.on("show-context-menu", (event, contextType, contextId) => {
    const template = [
      //{ role: 'undo' },
      // { role: 'redo' },
      // { type: 'separator' },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      //{ role: 'delete' },
      { type: "separator" }
    ];
    switch (contextType) {
      case "nothing":
        break;
      case "file":
        template.push(
          {
            label: "View File Details",
            click: () => {
              win == null ? void 0 : win.webContents.send("context-menu-action", "viewFile", "file", contextId);
            }
          },
          {
            label: "Change Status",
            click: () => {
              win == null ? void 0 : win.webContents.send("context-menu-action", "changeStatus", "file", contextId);
            }
          },
          {
            label: "Edit Note",
            click: () => {
              win == null ? void 0 : win.webContents.send("context-menu-action", "editNote", "file", contextId);
            }
          },
          {
            label: "Edit Fee",
            click: () => {
              win == null ? void 0 : win.webContents.send("context-menu-action", "editFee", "file", contextId);
            }
          },
          {
            label: "Mark as Important",
            click: () => {
              win == null ? void 0 : win.webContents.send("context-menu-action", "markImportant", "file", contextId);
            }
          }
        );
        break;
      case "contact":
        template.push(
          {
            label: "View Contact Details",
            click: () => {
              win == null ? void 0 : win.webContents.send("context-menu-action", "viewContact", "contact", contextId);
            }
          },
          {
            label: "Copy Email Address",
            click: () => {
              win == null ? void 0 : win.webContents.send("context-menu-action", "copyEmail", "contact", contextId);
            }
          }
        );
        break;
      case "company":
        template.push({
          label: "View Company Details",
          click: () => {
            win == null ? void 0 : win.webContents.send("context-menu-action", "viewCompany", "company", contextId);
          }
        });
        break;
      case "fee":
        template.push(
          {
            label: "View File Details",
            click: () => {
              win == null ? void 0 : win.webContents.send("context-menu-action", "viewFile", "fee", contextId);
            }
          },
          {
            label: "Edit Fee",
            click: () => {
              win == null ? void 0 : win.webContents.send("context-menu-action", "editFee", "fee", contextId);
            }
          }
        );
        break;
    }
    const menu = Menu.buildFromTemplate(template);
    menu.popup({ window: BrowserWindow.fromWebContents(event.sender) || void 0 });
  });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
