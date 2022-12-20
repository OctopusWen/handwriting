const { ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("versions", {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
// });

// contextBridge.exposeInMainWorld("electronAPI", {
//   openFile: () => ipcRenderer.invoke("dialog:open"),
// });

// console.log(process.versions.node);

module.exports = {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
};
