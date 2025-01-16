const { app, BrowserWindow, screen } = require("electron");

if (require("electron-squirrel-startup")) app.quit();

const createWindow = () => {
  const { height, width } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      devTools: false,
    },
  });
  mainWindow.loadFile("./dist/browser/index.html");
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
