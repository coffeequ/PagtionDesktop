import { app, BrowserWindow, shell, ipcMain } from 'electron';
import path from 'path';
import { GoogleProvderAuth } from './src/classes/GoogleProviderAuth.js';

//Использовать myapp://api/callback как redirect_url в google provider. myapp - созданный локальный протокол. 
//Открывать ссылку авторизации через shell.openurl(google). Можно как-нибудь использовать сервер для авторизации, 
//то есть редиректить или как-нибудь через http запросы

//Remind: В продакшене использовать две .., в дев .
let mainWindow: BrowserWindow;
let googleProvider = new GoogleProvderAuth("pagtionpagtions@gmail.com");

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
  app.setAsDefaultProtocolClient("myapp");
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle("openGoogleAuth", () => {
  shell.openExternal('http://localhost:3000/electronRedirectOauth');
})

app.on("open-url", (event, url) => {
  event.preventDefault();
  console.log("Получен deep link:", url);
  const parsedUrl = new URL(url);
  const userId = parsedUrl.searchParams.get("userId");
  const token = parsedUrl.searchParams.get("token");
  console.log("Айди юзера: ", userId, "токен: ", token);
});

