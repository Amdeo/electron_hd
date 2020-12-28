'use strict'

import {
    app,
    protocol,
    BrowserWindow,
    Menu,
    ipcMain,
    globalShortcut
} from 'electron'
import {
    createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {
    VUEJS_DEVTOOLS
} from 'electron-devtools-installer'
// const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: {
        secure: true,
        standard: true
    }
}])
let mainWindow;
let settingWindow;

async function createWindow() {
    // Create the browser window.
    // console.log(path.join(path.resolve('./'), '/src/preload.js'));
    mainWindow = new BrowserWindow({
        width: 1800,
        height: 800,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            enableRemoteModule: true
            // nodeIntegration: true,
            // preload: path.join(path.resolve('./'), '/src/preload.js'),
        }
    })
    // console.log(process.env.ELECTRON_NODE_INTEGRATION);
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        await mainWindow.loadURL('app://./index.html')
    }

    globalShortcut.register('ESC', () => {
        mainWindow.setFullScreen(false);
    })

    mainWindow.on('enter-full-screen', () => {
        mainWindow.menuBarVisible = false;
        mainWindow.webContents.send('full-screen', true);
    })
    mainWindow.on('leave-full-screen', () => {
        mainWindow.webContents.send('exit-full-screen', false);
        mainWindow.menuBarVisible = true;
    })
}

// 打开设置
ipcMain.on('openSetting', (event,arg) => {
    // console.log(arg)
    settingWindow = new BrowserWindow({
        title: "设置",
        width: 800,
        height: 800,
        parent: mainWindow,
        frame: true,  //是否显示默认工具栏
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        settingWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'setting')
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
    } else {
        // Load the index.html when not in development
        settingWindow.loadURL('app://./setting.html')
    }

    settingWindow.once("ready-to-show", () => {
        settingWindow.show();
    });

    settingWindow.once("show", function() {
        settingWindow.webContents.send('fromParentData', arg);
    });
})

//关闭设置窗口
ipcMain.on('close_settings', () => {
    settingWindow.close();
})

// 设置窗口确认
ipcMain.on('confirm',() => {
    settingWindow.close();
    mainWindow.webContents.reload();
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installExtension(VUEJS_DEVTOOLS)
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
