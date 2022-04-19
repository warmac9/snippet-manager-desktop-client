const { contextBridge, clipboard, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('systemClipboard', {
  write: (text) => {
    clipboard.writeText(text)
    ipcRenderer.invoke('hide-window')
  }
})

contextBridge.exposeInMainWorld('openBrowser', {
  manager: () => {
    store.set('google', 'https://google.com')
    ipcRenderer.invoke('open-browser', store.get('google'))
  }
})

contextBridge.exposeInMainWorld('userCredentials', {
  getToken() {
    ipcRenderer.invoke('storage-get', { key: 'token' }).then(res => {
      return res
    })
  },
  setToken(token) {
    ipcRenderer.invoke('storage-set', { key: 'token', value: token })
  }
  // getEmail() {
  //   return storage.get('creds.email')
  // },
  // setEmail(email) {
  //   storage.set('creds.email', email)
  // }
})