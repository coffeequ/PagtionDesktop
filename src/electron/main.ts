import { app, BrowserWindow, shell, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { DirectoryNotes } from './classes/DirectoryNotes.js';
import { Note } from './classes/Note.js';

interface IUser {
  id: string,
  email: string,
  name: string,
  image: string | null
}
//Remind: В продакшене использовать две .., в дев .
let mainWindow: BrowserWindow;

let directoryNotes = new DirectoryNotes();

//Главное окно приложения
function createMainWindow(){
  mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences:{
          preload: path.join(app.getAppPath(), "./dist-electron/preload.cjs")
      },
  });

  mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"), {hash: "login"});
  


  mainWindow.on("closed", () => {
    mainWindow.close(); 
  });
}

//Создание окна при полной загрузки приложения
app.whenReady().then(async () => {
  directoryNotes.readNotesDirectory();
  createMainWindow();
});

//Создание кастомного протокола на macOS
app.setAsDefaultProtocolClient("myapp");

//Завершение работы приложение
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

//Открытие аутентификации в браузере
ipcMain.handle("openAuth", (event, provider: string) => {
  shell.openExternal(`http://localhost:3000/electronRedirectOauth?selectProviders=${provider}`);
})

//Смена темы
ipcMain.handle('dark-mode:light', () => {
  nativeTheme.themeSource = "light"
});

ipcMain.handle('dark-mode:dark', () => {
  nativeTheme.themeSource = "light"
});

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
});

ipcMain.handle("current-theme", () => {
  return nativeTheme.themeSource;
});

//Не допускать открытие нового окна и передача данные из окна браузера
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv, workingDirectory) => {
    const deepLink = argv.find(arg => arg.startsWith('myapp://'));
    if (deepLink) {
      console.log("Получен deep link (в second-instance):", deepLink);

      const parsedUrl = new URL(deepLink);

      const user: IUser = {
        id: parsedUrl.searchParams.get("id")!,
        email: parsedUrl.searchParams.get("email")!,
        name: parsedUrl.searchParams.get("name")!,
        image: parsedUrl.searchParams.get("image")!
      }
      
      if (mainWindow) {

        mainWindow.webContents.send("deep-link", user);
        
        mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"), {hash: "document"});
        
        mainWindow.isFocused();
      }
    }
  });
}
//Получение глубокой ссылки с macOS
app.on("open-url", (event, url) => {
  event.preventDefault();
  console.log("Получен deep link:", url);
  const parsedUrl = new URL(url);
  const user: IUser = {
    id: parsedUrl.searchParams.get("id")!,
    email: parsedUrl.searchParams.get("email")!,
    name: parsedUrl.searchParams.get("name")!,
    image: parsedUrl.searchParams.get("image")!
  }
  if(mainWindow){
    mainWindow.webContents.send("deep-link", user);
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"), {hash: "document"});
    mainWindow.isFocused();    
  }  
});

ipcMain.handle("read-notes", async () => {
  await directoryNotes.readNotesDirectory()
  return directoryNotes.notes;
});


ipcMain.handle("create-notes", async (event, title: string, userId: string, parentDocumentId?: string) => {
  const note = new Note(title, userId, parentDocumentId);
  const newNote = directoryNotes.createNotesDirectory(note);
  return newNote;
});

ipcMain.handle("edit-notes", async (event, note : Note) => {
  await directoryNotes.editNoteDirectory(note);
  return directoryNotes.notes;
});


ipcMain.handle("delete-notes", async (event, noteId : string) => {
  await directoryNotes.deleteNoteDirectory(noteId);
  return directoryNotes.notes;
});

ipcMain.handle("get-all-notes", async (event) => {
  return directoryNotes.notes;
});

ipcMain.handle("restore-notes", async (event, noteId: string) => {
  return directoryNotes.recursiveRestoreNote(noteId);
})

ipcMain.handle("sidebar-notes", async (event, userId: string, parentDocumentId?: string) => {
  return directoryNotes.sidebar(userId, parentDocumentId);
})

ipcMain.handle("archived-notes", async (event, noteId: string) => {
  return directoryNotes.recursiveArchivedNote(noteId);
})

ipcMain.handle("getId-notes", async (event, noteId: string) => {
  return await directoryNotes.getIdNotes(noteId);
})

ipcMain.handle("update-notes", async (event, noteId: string, isPublished?: boolean, userId?: string, title?: string, content?: string, coverImage?: string, icon?: string) => {
  return directoryNotes.updateNotes(noteId, isPublished, userId, title, content, coverImage, icon);
})

ipcMain.handle("trash-notes", async (event, noteId: string) => {
  return directoryNotes.trashNote(noteId);
})
