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

ipcRenderer.on("print", (e, textSettings, wordSettings, input) => {
  let str = input;
  var strArr = [];
  let cnt = 0;
  document.getElementsByTagName("body")[0].innerHTML = "";

  for (let i = 0; i < str.length; i += 400, cnt++) {
    strArr.push(str.slice(i, i + 400));
  }
  console.log(cnt);
  var pages = [];
  for (let i = 0; i < cnt; i++) {
    let page = document.createElement("div");
    page.className = "page";
    let text = document.createElement("div");
    text.className = "content";
    page.style.backgroundImage = `url(./resource/background/${textSettings.bgPath})`;
    text.style.fontFamily = textSettings.extractedFileName;
    text.style.paddingTop = textSettings.paddingTop;
    text.style.paddingRight = textSettings.paddingRight;
    text.style.paddingLeft = textSettings.paddingLeft;
    text.style.paddingBottom = textSettings.paddingBottom;
    let out = "";
    for (let j in strArr[i]) {
      let size = Math.round(
        Math.random() * (wordSettings.sizeMax - wordSettings.sizeMin) +
          wordSettings.sizeMin
      );
      out += `<span style="font-size: ${size}px; margin-right:${wordSettings.marginRight}px; line-height:${wordSettings.lineHeight}px ">${str[j]}</span>`;
    }
    text.innerHTML = out;
    text.style.transform =
      "rotateX(" +
      textSettings.rotateX +
      "deg)" +
      " rotateY(" +
      textSettings.rotateY +
      "deg)";
    page.appendChild(text);
    pages.push(page);
    document.getElementsByTagName("body")[0].appendChild(page);
  }
  console.log(pages);
  // document.getElementsByTagName("body")[0].appendChild(pages);
});
