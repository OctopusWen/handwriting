const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  MessageChannelMain,
} = require("electron");
const { copyFile, constants } = require("node:fs/promises");
const path = require("path");

if (process.env.dev === "true") {
  try {
    require("electron-reloader")(module);
  } catch {}
}
var windowID = {};

const createWindow = () => {
  // const { port1, port2 } = new MessageChannelMain();
  const win = new BrowserWindow({
    name: "panel",
    width: 580,
    height: 470,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  const print = new BrowserWindow({
    name: "print",
    width: 570,
    height: 730,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preloadPrint.js"),
    },
  });

  windowID["print"] = print.id;
  console.log(BrowserWindow.getAllWindows());
  print.loadFile("print.html");
  ipcMain.handle("print", () => {
    print.webContents.print({ printBackground: true });
  });
  if (process.env.dev === "true") {
    print.webContents.openDevTools({ mode: "detach" });

    win.webContents.openDevTools({ mode: "detach" });
  }
  // win.once("ready-to-show", () => {
  //   win.webContents.postMessage("port", null, [port1]);
  // });
  // print.once("ready-to-show", () => {
  //   win.webContents.postMessage("port", null, [port2]);
  // });
};

async function handleChooseFont() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: "选择字体文件",
    filters: [{ name: "Font", extensions: ["ttf"] }],
    properties: ["openFile"],
  });
  if (canceled) {
    return;
  }

  if (path.dirname(filePaths[0]) === path.join(__dirname, "resource", "font")) {
    console.log(path.basename(filePaths[0]));
    return path.basename(filePaths[0]);
  }

  let newName = new Date().getTime() + ".ttf";
  const newPath = path.join(__dirname, "resource", "font", newName);
  try {
    await copyFile(filePaths[0], newPath, constants.COPYFILE_EXCL);
    console.log(newName);
  } catch {
    console.log("复制字体失败");
    newName = "";
  } finally {
    return newName;
  }
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: "选择背景图片",
    filters: [{ name: "Images", extensions: ["jpg"] }],
    properties: ["openFile"],
  });
  if (canceled) {
    return;
  }

  if (
    path.dirname(filePaths[0]) ===
    path.join(__dirname, "resource", "background")
  ) {
    console.log(path.basename(filePaths[0]));
    return path.basename(filePaths[0]);
  }

  let newName = new Date().getTime() + ".jpg";
  const newPath = path.join(__dirname, "resource", "background", newName);
  try {
    await copyFile(filePaths[0], newPath, constants.COPYFILE_EXCL);
    console.log(newName);
  } catch {
    console.log("复制图片失败");
    newName = "";
  } finally {
    return newName;
  }
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:background:open", handleFileOpen);
  ipcMain.handle("dialog:TTF:open", handleChooseFont);
  ipcMain.handle("get:print", () => windowID.print);

  createWindow();

  // MacOS 实现未打开窗口时正确运行
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
