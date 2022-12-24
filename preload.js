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

// ipcRenderer.on("port", (e) => {
//   // port received, make it globally available.
//   window.electronMessagePort = e.ports[0];

//   window.electronMessagePort.onmessage = (messageEvent) => {
//     console.log(messageEvent);
//   };
// });
