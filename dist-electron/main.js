import { app as p, BrowserWindow as d, ipcMain as f, dialog as u, Menu as h } from "electron";
import { fileURLToPath as P } from "node:url";
import t from "node:path";
import F from "node:fs";
const b = t.dirname(P(import.meta.url));
process.env.APP_ROOT = t.join(b, "..");
const c = process.env.VITE_DEV_SERVER_URL, D = t.join(process.env.APP_ROOT, "dist-electron"), v = t.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = c ? t.join(process.env.APP_ROOT, "public") : v;
let e;
function w() {
  e = new d({
    icon: t.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: t.join(b, "preload.mjs")
    },
    autoHideMenuBar: !0
  }), e.maximize(), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), c ? e.loadURL(c) : e.loadFile(t.join(v, "index.html")), f.handle(
    "generate-invoice-pdf",
    async (m, l) => (console.log(`${m} Received generate-invoice-pdf request:`, l), new Promise((o, n) => {
      const i = new d({
        width: 1200,
        height: 1080,
        show: !1,
        webPreferences: {
          preload: t.join(b, "preload.mjs"),
          nodeIntegration: !1,
          contextIsolation: !0
        }
      }), g = c ? `${c}#/invoice` : `file://${t.join(v, "index.html")}#/invoice`;
      i.loadURL(g), i.webContents.on("did-finish-load", () => {
        console.log("Sending invoice data to InvoicePage"), i.webContents.send("invoice-data", l);
      }), f.once("invoice-rendered", async () => {
        console.log("Received invoice-rendered event");
        try {
          const s = await i.webContents.printToPDF({
            margins: { top: 0, right: 0, bottom: 0, left: 0 },
            scale: 1,
            preferCSSPageSize: !0,
            pageSize: "A4",
            printBackground: !0
          }), { canceled: r, filePath: a } = await u.showSaveDialog({
            title: "Save Fee Invoice PDF",
            defaultPath: `Fee Invoice - APS ${l.fileDetails.id}.pdf`,
            filters: [{ name: "PDF Files", extensions: ["pdf"] }]
          });
          if (r || !a) {
            n(new Error("Save dialog was canceled."));
            return;
          }
          F.writeFileSync(a, s), u.showMessageBox({
            type: "info",
            title: "PDF Generated",
            message: `Fee Invoice has been saved to ${a}`
          }), o(a);
        } catch (s) {
          console.error("Failed to generate PDF:", s), u.showErrorBox(
            "PDF Generation Error",
            "An error occurred while generating the PDF."
          ), n(s);
        } finally {
          i.close();
        }
      }), i.webContents.on("did-fail-load", (s, r, a) => {
        console.error(`${s}Failed to load InvoicePage: ${a} (${r})`), n(new Error(`Failed to load InvoicePage: ${a} (${r})`));
      }), setTimeout(() => {
        n(new Error("PDF generation timed out.")), i.isDestroyed() || i.close();
      }, 15e3);
    }))
  ), f.on("show-context-menu", (m, l, o) => {
    const n = [
      //{ role: 'undo' },
      // { role: 'redo' },
      // { type: 'separator' },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      //{ role: 'delete' },
      { type: "separator" }
    ];
    switch (l) {
      case "nothing":
        break;
      case "file":
        n.push(
          {
            label: "View File Details",
            click: () => {
              e == null || e.webContents.send("context-menu-action", "viewFile", "file", o);
            }
          },
          {
            label: "Change Status",
            click: () => {
              e == null || e.webContents.send("context-menu-action", "changeStatus", "file", o);
            }
          },
          {
            label: "Edit Note",
            click: () => {
              e == null || e.webContents.send("context-menu-action", "editNote", "file", o);
            }
          },
          {
            label: "Edit Fee",
            click: () => {
              e == null || e.webContents.send("context-menu-action", "editFee", "file", o);
            }
          },
          {
            label: "Mark as Important",
            click: () => {
              e == null || e.webContents.send("context-menu-action", "markImportant", "file", o);
            }
          }
        );
        break;
      case "contact":
        n.push(
          {
            label: "View Contact Details",
            click: () => {
              e == null || e.webContents.send("context-menu-action", "viewContact", "contact", o);
            }
          },
          {
            label: "Copy Email Address",
            click: () => {
              e == null || e.webContents.send("context-menu-action", "copyEmail", "contact", o);
            }
          }
        );
        break;
      case "company":
        n.push({
          label: "View Company Details",
          click: () => {
            e == null || e.webContents.send("context-menu-action", "viewCompany", "company", o);
          }
        });
        break;
      case "fee":
        n.push(
          {
            label: "View File Details",
            click: () => {
              e == null || e.webContents.send("context-menu-action", "viewFile", "fee", o);
            }
          },
          {
            label: "Edit Fee",
            click: () => {
              e == null || e.webContents.send("context-menu-action", "editFee", "fee", o);
            }
          }
        );
        break;
    }
    h.buildFromTemplate(n).popup({ window: d.fromWebContents(m.sender) || void 0 });
  });
}
p.on("window-all-closed", () => {
  process.platform !== "darwin" && (p.quit(), e = null);
});
p.on("activate", () => {
  d.getAllWindows().length === 0 && w();
});
p.whenReady().then(w);
export {
  D as MAIN_DIST,
  v as RENDERER_DIST,
  c as VITE_DEV_SERVER_URL
};
