const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
   handleOpenGoogleProvirder: () => {
    ipcRenderer.invoke("openGoogleAuth");
   },
   syncDeepLinkGoogle: (callback: any) => {
      ipcRenderer.on("deep-link", callback);
   },
   getStorageUser: () => {
   }
});

