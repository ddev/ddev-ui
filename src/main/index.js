import { app, BrowserWindow, Menu, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import * as path from 'path';
import { format as formatUrl } from 'url';
import defaultMenu from 'electron-default-menu';

if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}

const isDevelopment = process.env.NODE_ENV !== 'production';

//-------------------------------------------------------------------
// Logging
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

//-------------------------------------------------------------------
// Define the menu
//-------------------------------------------------------------------
const template = [];
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: `About ${name}`,
        role: 'about',
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        },
      },
    ],
  });
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

const sendStatusToWindow = text => {
  log.info(text);
  window.webContents.send('message', text);
};

const createMainWindow = () => {
  const window = new BrowserWindow({
    titleBarStyle: 'hidden',
  });

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      })
    );
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
};

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', info => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', info => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', err => {
  sendStatusToWindow(`Error in auto-updater. ${err}`);
});
autoUpdater.on('download-progress', progressObj => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
  logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
  logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
  sendStatusToWindow(logMessage);
});
autoUpdater.on('update-downloaded', info => {
  sendStatusToWindow('Update downloaded');
});

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  const menu = defaultMenu(app, shell);
  // Set top-level application menu, using modified template
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  mainWindow = createMainWindow();
  if (isDevelopment) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err));
  }
});

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});
