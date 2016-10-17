const { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut, dialog } = require('electron');

let win, tray;

function createWindow() {
  win = new BrowserWindow({ show: false });
  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', () => { win = null; });
}

function createTrayIcon() {
  win.webContents.executeJavaScript('makeImage()', false, (dataURL) => {
    tray = new Tray(nativeImage.createFromDataURL(dataURL));

    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'exit', click() { app.quit() } }
    ]));

    tray.on('click', () => dialog.showMessageBox({ message: "oke", buttons: [] }));
    // tray.on('double-click', () => timer.start(20));
  })
}

// function updateIcon() {
//   let json = JSON.stringify({ secondsLeft: timer.secondsLeft, started: timer.started });
//   win.webContents.executeJavaScript(`makeImage(${json})`, false, (dataURL) => {
//     tray.setImage(nativeImage.createFromDataURL(dataURL));
//   });
// }

function registerShortcuts() {
  globalShortcut.register("Super+;", () => dialog.showMessageBox({ message: "oke", buttons: [] }));
}

app.on('ready', () => { createWindow(); createTrayIcon(); registerShortcuts(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!win) createWindow(); });

