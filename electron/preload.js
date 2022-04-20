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
  getToken() {
    ipcRenderer.invoke('storage-get', { key: 'auth.token' }).then(res => {
      return res
    })
  },
  setToken(token) {
    ipcRenderer.invoke('storage-set', { key: 'auth.token', value: token })
  },

  getEmail() {
    ipcRenderer.invoke('storage-get', { key: 'auth.email' }).then(res => {
      return res
    })
  },
  setEmail(email) {
    storage.set('auth.email', email)
  },

  getPassword() {
    ipcRenderer.invoke('storage-get', { key: 'auth.password' }).then(res => {
      return res
    })
  },
  setPassword(password) {
    storage.set('auth.password', password)
  },

  getArticles() {
    ipcRenderer.invoke('storage-get', { key: 'articles' }).then(res => {
      return res
    })
  },
  setArticles(articles) {
    storage.set('articles', articles)
  }
})