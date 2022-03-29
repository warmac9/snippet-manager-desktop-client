const { contextBridge, clipboard, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('systemClipboard', {
  write: (text) => {
    clipboard.writeText(text)
    ipcRenderer.invoke('hide-window')
  }
})

contextBridge.exposeInMainWorld('openBrowser', {
  manager: () => {
    ipcRenderer.invoke('open-browser', `https://google.com`)
  }
})