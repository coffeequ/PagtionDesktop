const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
   handleOpenProvirder: (provider: string) => {
    ipcRenderer.invoke("openAuth", provider);
   },
   handleOpenRegister: () => {
      ipcRenderer.invoke("openRegister");
   },
   handleOpenReset: () => {
      ipcRenderer.invoke("openResetPassword");
   },
   syncDeepLinkGoogle: (callback: any) => {
      ipcRenderer.on("deep-link", callback);
   },
   setTheme: (value: string) => {
      ipcRenderer.invoke("ToggleTheme", value);
   },
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
   },
   searchNote: (userId: string) => {
      return ipcRenderer.invoke("search-note", userId);
   },
   handleUploadFile: (file: any) => {
      return ipcRenderer.invoke("upload-file", file);
   },
   GetNotePath: () => {
      return ipcRenderer.invoke("path-notes");
   },
   GetFilePath: () => {
      return ipcRenderer.invoke("path-files");
   },
   StartSend: () => {
      return ipcRenderer.invoke("start-sync")
   },
   StopSend: () => {
      return ipcRenderer.invoke("stop-sync")
   },
   GetIsStatusSync: () => {
      return ipcRenderer.invoke("get-current-status-sync");
   },
   SaveUserData: (user: any) => {
      return ipcRenderer.invoke("save-user-data", user);
   },
   RefreshNotesAfterLogin: () => {
      return ipcRenderer.invoke("refresh-notes-after-login");
   }
});



