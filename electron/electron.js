const path = require('path');
const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const isDev = process.env.IS_DEV == "true" ? true : false;

function createMainWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const mainWindow = new BrowserWindow({
    width: Math.min(1000, width),
    height: Math.min(620, height),
    webPreferences: {
      devTools: isDev,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
    frame: false,
    maximizable: false,
    minimizable: false,
    resizable: false,
    skipTaskbar: true,
    show: false
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );
  
  return mainWindow
}

app.whenReady().then(() => {
  const mainWindow = createMainWindow()

  mainWindow.once('ready-to-show', () => {
    globalShortcut.register('Esc', () => {
      mainWindow.hide()
    })
  
    globalShortcut.register('Meta+N', () => {
      if(mainWindow.isVisible())
        mainWindow.hide()
      else
        mainWindow.show()
    })
  })
  
  ipcMain.handle('hide-window', () => {
    mainWindow.hide()
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    mainWindow.show()
  })
});