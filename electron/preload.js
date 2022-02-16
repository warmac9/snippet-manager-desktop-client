const { contextBridge, clipboard } = require('electron')

contextBridge.exposeInMainWorld('systemClipboard', {
  write: (text) => {
    clipboard.writeText(text)
  }
})