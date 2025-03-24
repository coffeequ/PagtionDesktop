import { app, BrowserWindow, shell, ipcMain, webContents } from 'electron';
import path from 'path';

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

  mainWindow.on("closed", () => {
      mainWindow.close(); 
  });
}

app.whenReady().then(() => {
  createMainWindow();
});

app.setAsDefaultProtocolClient("myapp");

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle("openGoogleAuth", () => {
  shell.openExternal('http://localhost:3000/electronRedirectOauth');
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

      console.log("Айди юзера:", user);
      if (mainWindow) {
        mainWindow.webContents.send("deep-link", user);
        // localStorageUser.setItem("userData", JSON.stringify(user));
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
    // localStorageUser.setItem("userData", JSON.stringify(user));
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"), {hash: "document"});
    mainWindow.isFocused();
    //Сделать метод для отправки данных из локального хранилища данных
    // mainWindow.webContents.on("getStorageUserData", () => {
    //   const user = localStorageUser.getItem("userData");
    //   return user;
    // })
    
  }  
});