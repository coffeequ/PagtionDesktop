const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
   handleOpenGoogleProvirder: (provider: string) => {
    ipcRenderer.invoke("openGoogleAuth", provider);
   },
   syncDeepLinkGoogle: (callback: any) => {
      ipcRenderer.on("deep-link", callback);
   },
   toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
   system: () => ipcRenderer.invoke('dark-mode:system'),
});



