const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    getLoginSuccess: (token: string) => ipcRenderer.send("login-success", token),
});