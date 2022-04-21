const { contextBridge, clipboard, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('systemClipboard', {
  write: (text) => {
    clipboard.writeText(text)
    ipcRenderer.invoke('hide-window')
  }
})

contextBridge.exposeInMainWorld('systemBrowser', {
  openManager: () => {
    ipcRenderer.invoke('open-browser', 'https://google.com')
  }
})

contextBridge.exposeInMainWorld('systemStorage', {
  async getArticles() {
    return await ipcRenderer.invoke('storage-get', { key: 'articles' })
  },
  setArticles(articles) {
    ipcRenderer.invoke('storage-set', { key: 'articles', value: articles })
  },
  
  async getToken() {
    return await ipcRenderer.invoke('storage-get', { key: 'auth.token' })
  },
  setToken(token) {
    ipcRenderer.invoke('storage-set', { key: 'auth.token', value: token })
  },

  async getEmail() {
    return await ipcRenderer.invoke('storage-get', { key: 'auth.email' })
  },
  setEmail(email) {
    ipcRenderer.invoke('storage-set', { key: 'auth.email', value: email })
  },

  async getPassword() {
    return await ipcRenderer.invoke('storage-get', { key: 'auth.password' })
  },
  setPassword(password) {
    ipcRenderer.invoke('storage-set', { key: 'auth.password', value: password })
  }
})