const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { copyFile, constants } = require("node:fs/promises");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.webContents.openDevTools({ mode: "detach" });
  win.loadFile("index.html");
};

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: "选择背景图片",
    filters: [{ name: "Images", extensions: ["jpg"] }],
    properties: ["openFile"],
  });
  if (canceled) {
    return;
  }
  // return filePaths[0];
  const newName = new Date().getTime() + ".jpg";
  try {
    await copyFile(
      filePaths[0],
      path.join(__dirname, "resource", "background", newName),
      constants.COPYFILE_EXCL
    );
    console.log(newName);
  } catch {
    console.log("失败");
    newName = "";
  } finally {
    return newName;
  }
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:open", handleFileOpen);

  createWindow();

  // MacOS 实现未打开窗口时正确运行
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
