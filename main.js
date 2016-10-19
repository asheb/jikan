const { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut, dialog } = require('electron');

let tray;

function createWindow() {
  let win = new BrowserWindow({
    width: 250, height: 60,
    frame: false, resizable: false, show: false
  });
  win.loadURL(`file://${__dirname}/index.html`);
  win.once('ready-to-show', () => win.show());
  win.on('closed', () => { win = null; });
}

function createTrayIcon() {
  let win = new BrowserWindow({ show: false });
  win.loadURL(`file://${__dirname}/icon-generator.html`);
  win.on('closed', () => { win = null; });

  win.webContents.executeJavaScript('makeImage()', false, (dataURL) => {
    tray = new Tray(nativeImage.createFromDataURL(dataURL));

    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'exit', click() { app.quit() } }
    ]));

    tray.on('click', createWindow);
  });
}

function registerShortcuts() {
  globalShortcut.register("Super+;", createWindow);
  // globalShortcut.register("Super+p", () => app.quit());
  // globalShortcut.register("Super+Shift+p", () => app.quit());
  // globalShortcut.register("Super+P", () => app.quit());
  // globalShortcut.register("Super+:", () => app.quit());
  globalShortcut.register("Super+'", () => app.quit());
}

app.on('ready', () => { createTrayIcon(); registerShortcuts(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!win) createWindow(); });

