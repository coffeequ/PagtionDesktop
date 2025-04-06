const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
   handleOpenProvirder: (provider: string) => {
    ipcRenderer.invoke("openAuth", provider);
   },
   syncDeepLinkGoogle: (callback: any) => {
      ipcRenderer.on("deep-link", callback);
   },
   toggleLight: () => ipcRenderer.invoke('dark-mode:light'),
   toggleDark: () => ipcRenderer.invoke('dark-mode:light'),
   system: () => ipcRenderer.invoke('dark-mode:system'),
   currentTheme: () => ipcRenderer.invoke("current-theme"),
   
   createNote: (title: string, userId: string, parentDocumentId?: string) => {
      return ipcRenderer.invoke("create-notes", title, userId, parentDocumentId);
   },
   readNotes: () => {
      ipcRenderer.invoke("read-notes");
   },
   editNotes: (note: any) => {
      return ipcRenderer.invoke("edit-notes", note);
   },
   deleteNotes: (noteId: string) => {
      return ipcRenderer.invoke("delete-notes", noteId);
   },
   getAllNotes: () => {
      return ipcRenderer.invoke("get-all-notes");
   },
   restore: (noteId: string) => {
      return ipcRenderer.invoke("restore-notes", noteId);
   },
   sidebar: (userId: string, parentDocumentId: string) => {
      return ipcRenderer.invoke("sidebar-notes", userId, parentDocumentId);
   },
   archived: (noteId: string) => {
      return ipcRenderer.invoke("archived-notes", noteId);
   },
   idNote: (noteId: string) => {
      return ipcRenderer.invoke("getId-notes", noteId);
   },
   updateNote: (NoteUpdate: any) => {
      return ipcRenderer.invoke("update-notes", NoteUpdate);
   },
   trashNote: (userId: string) => {
      return ipcRenderer.invoke("trash-notes", userId);
   }
});



