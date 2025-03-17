import { app, BrowserWindow } from 'electron';
import path from 'path';

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


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});