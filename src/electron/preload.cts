const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
   handleOpenGoogleProvirder: () => {
    ipcRenderer.invoke("openGoogleAuth");
   }     
});

