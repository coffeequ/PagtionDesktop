import {app, BrowserWindow, ipcMain } from "electron";
import ElectronStore from "electron-store";
import path from "path";

let authWindow: BrowserWindow;
let mainWindow: BrowserWindow;
const store = new ElectronStore();

function loginWindow(){
    authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    authWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"), {hash: "login"});

    authWindow.on("closed", () => {
        authWindow.close();
    });
}

function MainWindow(){
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"), {hash: "document"});

    mainWindow.on("closed", () => {
        mainWindow.close(); 
    });
}

app.on("ready", () => {
    loginWindow();
    MainWindow();
})

ipcMain.on("login-success", (event, token) => {
    console.log("Токен получен: ", token);
    store.set("tokenAuth", token);
    if(authWindow) authWindow.close();
    if(mainWindow) mainWindow.show();
})