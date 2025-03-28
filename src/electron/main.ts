import { app, BrowserWindow, shell, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { startServer } from './server.js';

interface IUser {
  id: string,
  email: string,
  name: string,
  image: string | null
}

//Remind: В продакшене использовать две .., в дев .
let mainWindow: BrowserWindow;

function createMainWindow(){

  mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences:{
          preload: path.join(app.getAppPath(), "./dist-electron/preload.cjs")
      },
  });

  mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"), {hash: "login"});

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  });

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  });

  mainWindow.on("closed", () => {
    mainWindow.close(); 
  });
}

app.whenReady().then(() => {
  startServer();
  createMainWindow();
});

app.setAsDefaultProtocolClient("myapp");

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle("openGoogleAuth", (event, provider: string) => {
  shell.openExternal(`http://localhost:3000/electronRedirectOauth?selectProviders=${provider}`);
})

//Для работы на windows 
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

//Для работы на macOS
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