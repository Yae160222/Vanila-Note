const { app, BrowserWindow } = require("electron");

let win = null;

app.setUserTasks([
  {
    program: process.execPath,
    arguments: "--new-window",
    iconPath: process.execPath,
    iconIndex: 0,
    title: "New Window",
    description: "Create a new window",
  },
]);
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "./yae.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      titleBarStyle: "hidden",
      /* titleBarOverlay: true, */ // Required if nodeIntegration is true
    },
  });
  win.setMenuBarVisibility(false);

  win.loadFile("../frontend/index.html"); // Adjust path if needed
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
