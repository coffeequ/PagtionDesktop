import { app, BrowserWindow, shell, ipcMain, nativeTheme, net } from 'electron';
import path from 'path';

//Интерфейсы
import { IUpdateProps } from './interfaces/IUpdateNote.js';
import { IFilesUpload } from './interfaces/IFilesUpload.js';
import { IUser } from './interfaces/IUser.js';

//Классы
import { DirectoryFile } from './classes/DirectoryFiles.js';
import { UserData } from "./classes/DirectoryUserData.js"
import { DirectorySyncNote } from './classes/DirectorySyncNote.js';
import { DirectoryNotes } from './classes/DirectoryNotes.js';
import { Note } from './classes/Note.js';

//Синглтон класса DirectoryLO
import { directoryLO } from './classes/ListOperation.js';

type Theme = "dark" | "light";

//TODO: 
// 1) Сделать проверку подключения к серверу используя его api. Уточнее: сделать эндпоинт для получения состояния.


//Remind: В продакшене использовать две .., в дев .
let mainWindow: BrowserWindow;

let directoryNotes = new DirectoryNotes();
let directoryFile = new DirectoryFile();

let directoryUserData = new UserData();
let directorySyncData = new DirectorySyncNote();

async function fetchData(userId: string) {
  const notes = await directorySyncData.fetchPostNote(userId)
    if(notes.ok){
      directorySyncData.ExistsNoteLocale(await notes.json());
    }
}

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

  mainWindow.focus();

  mainWindow.menuBarVisible = false;
}

//Создание окна при загрузки приложения
app.whenReady().then(async () => {

  //Чтение файлов
  directoryFile.createFolder();
  directoryFile.readNameFiles();
  
  //TODO: Данные почему-то не подтягиваются автоматически
  //Получение айди пользователя для фетчинга данных с сервера
  const userData = await directoryUserData.readUserFile();

  console.log(userData);

  if(userData !== undefined){
    const res = await directorySyncData.fetchPostNote(userData.id);

    if(res.ok){
    
      const notes: Note[] = await res.json();
    
      // console.log("get notes: ", notes);
    
      await directorySyncData.ExistsNoteLocale(notes);
    }
  }

  //Чтение заметок
  directoryNotes.readNotesDirectory();
  
  //Запуск основого окна
  createMainWindow();
});

//Создание кастомного протокола на macOS
app.setAsDefaultProtocolClient("pagtion");

function toggleTheme(theme: Theme){
  nativeTheme.themeSource = theme
}
//Завершение работы приложение
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

//Открытие аутентификации в браузере
ipcMain.handle("openAuth", (event, provider: string) => {
  shell.openExternal(`https://pagtion.vercel.app/electronRedirectOauth?selectProviders=${provider}`);
})

ipcMain.handle("openRegister", () => {
  shell.openExternal(`https://pagtion.vercel.app/register`);
})

ipcMain.handle("openResetPassword", () => {
  shell.openExternal(`https://pagtion.vercel.app/reset`);
})

//Смена темы
ipcMain.handle("ToggleTheme", (event, theme: Theme) => {
  toggleTheme(theme);
});

//Не допускать открытие нового окна. Передача данных из окна браузера
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv, workingDirectory) => {
    const deepLink = argv.find(arg => arg.startsWith('pagtion://'));
    if (deepLink) {
      //console.log("Получен deep link (в second-instance):", deepLink);

      const parsedUrl = new URL(deepLink);

      //console.log(parsedUrl);

      const user: IUser = {
        id: parsedUrl.searchParams.get("id")!,
        email: parsedUrl.searchParams.get("email")!,
        name: parsedUrl.searchParams.get("name")!,
        image: parsedUrl.searchParams.get("image")!,
      }

      
      if (mainWindow) {

        mainWindow.webContents.send("deep-link", user);
        
        mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"), {hash: "/document/startPage"});
        
        mainWindow.isFocused();
        
        fetchData(user.id);
        
        directoryUserData.saveUserFile(user);

        directoryLO.createListOpearionFile(user.id);
      }
    }
  });
}
//Получение глубокой ссылки с macOS
app.on("open-url", (event, url) => {
  event.preventDefault();
  //console.log("Получен deep link:", url);
  const parsedUrl = new URL(url);
  const user: IUser = {
    id: parsedUrl.searchParams.get("id")!,
    email: parsedUrl.searchParams.get("email")!,
    name: parsedUrl.searchParams.get("name")!,
    image: parsedUrl.searchParams.get("image")!,
  }
  if(mainWindow){
    mainWindow.webContents.send("deep-link", user);
    
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"), {hash: "/document/startPage"});
    
    mainWindow.isFocused();

    fetchData(user.id);

    directoryUserData.saveUserFile(user);
    
    directoryLO.createListOpearionFile(user.id);
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
  return directoryNotes.restoreNote(noteId);
});

ipcMain.handle("sidebar-notes", async (event, userId: string, parentDocumentId: string) => {
  return directoryNotes.sidebar(userId, parentDocumentId);
});

ipcMain.handle("archived-notes", async (event, noteId: string) => {
  return directoryNotes.archivedNote(noteId);
});

ipcMain.handle("getId-notes", async (event, noteId: string) => {
  return await directoryNotes.getIdNotes(noteId);
});

ipcMain.handle("update-notes", async (event, NoteUpdate: IUpdateProps) => {
  return directoryNotes.updateNotes({...NoteUpdate});
});

ipcMain.handle("trash-notes", async (event, noteId: string) => {
  return directoryNotes.trashNote(noteId);
});

ipcMain.handle("search-note", async(event, userId: string) => {
  return directoryNotes.searchNote(userId);
});

ipcMain.handle("upload-file", async(event, file: IFilesUpload) => {
  return directoryFile.handleUpload(file);
});

ipcMain.handle("path-notes", () => {
  return directoryNotes.GetFolderNotePath();
});

ipcMain.handle("path-files", () => {
  return directoryFile.GetFolderFilesPath();
});

ipcMain.handle("get-current-status-sync", () => {
  return directoryLO.handleGetSyncStatus();
});

ipcMain.handle("start-sync", async () => {
  return directoryLO.startSendOperation();
});

ipcMain.handle("stop-sync", () => {
  return directoryLO.stopSendOperation();
});

ipcMain.handle("save-user-data", async (event, user: UserData) => {
  
  await directoryLO.createListOpearionFile(user.id);

  return directoryUserData.saveUserFile(user);
})
