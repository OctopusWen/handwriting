const { ipcRenderer } = require("electron");

const pages = document.getElementsByClassName("page");
const text = document.getElementsByClassName("content");

ipcRenderer.on("background:change", (e, path) => {
  pages[0].style.backgroundImage = `url(${path})`;
});

ipcRenderer.on("font:change", (e, fileName, path) => {
  const font = new FontFace(fileName, `url(./resource/font/${path})`);
  document.fonts.add(font);
  text[0].style.fontFamily = fileName;
});

ipcRenderer.on("mask:show", (e, show) => {
  if (show) {
    text[0].style.backgroundColor = "rgba(58, 114, 215, 0.5)";
  } else {
    text[0].style.backgroundColor = "transparent";
  }
});

ipcRenderer.on("text:padding", (e, propName, value) => {
  text[0].style[propName] = value + "px";
});

ipcRenderer.on("text:rotate", (e, textSettings) => {
  text[0].style.transform =
    "rotateX(" +
    textSettings.rotateX +
    "deg)" +
    " rotateY(" +
    textSettings.rotateY +
    "deg)";
});

ipcRenderer.on("word:content", (e, content) => {
  text[0].innerHTML = content;
});
