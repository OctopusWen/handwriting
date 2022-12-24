const { ipcRenderer } = require("electron");

const { versions } = require("./preload");

const info = document.getElementById("info");
// const pages = document.getElementsByClassName("page");
// const text = document.getElementsByClassName("content");
const input = document.getElementById("text");

info.innerText = `本应用使用 Chrome (v${versions.node}), Node.js (v${versions.node}), Electron (v${versions.node})\n 恭喜你的电脑里面又多了一个Chrome！`;

(async function getPrint() {
  let id = await ipcRenderer.invoke("get:print");
  window.printID = id;
})();

var wordSettings = {
  sizeMax: 15,
  sizeMin: 10,
  lineHeight: 0,
  marginRight: 0,
};

var textSettings = {
  rotateY: 0,
  rotateX: 0,
  bgPath: "",
  fontPath: "",
  extractedFileName: "",
  paddingTop: 0,
  paddingRight: 0,
  paddingLeft: 0,
  paddingBottom: 0,
};

async function openBackgroundDialog() {
  const path = await ipcRenderer.invoke("dialog:background:open");
  // background.setAttribute("src", path);
  console.log(path);
  // pages[0].style.backgroundImage = `url(./resource/background/${path})`;
  // pages[0].style.backgroundRepeat = "no-repeat";
  // pages[0].style.backgroundSize = "contain";
  ipcRenderer.sendTo(
    printID,
    "background:change",
    `./resource/background/${path}`
  );
  textSettings.bgPath = path;
}

const regex = /([^/]*)\.ttf/;

async function openTTFDialog() {
  const path = await ipcRenderer.invoke("dialog:TTF:open");
  console.log(path);
  if (path) {
    let match = path.match(regex);
    let extractedFileName = "f" + match[1];
    console.log(extractedFileName);
    ipcRenderer.sendTo(printID, "font:change", extractedFileName, path);
    textSettings.extractedFileName = extractedFileName;
    textSettings.fontPath = path;
    // const font = new FontFace(
    //   extractedFileName,
    //   `url(./resource/font/${path})`
    // );
    // document.fonts.add(font);
    // text[0].style.fontFamily = extractedFileName;
  }
}

function textPaddings(e) {
  ipcRenderer.sendTo(printID, "text:padding", e.target.name, e.target.value);
  textSettings[e.target.name] = e.target.value;
  // text[0].style[e.target.name] = e.target.value + "px";
}

function showMask(e) {
  ipcRenderer.sendTo(printID, "mask:show", e.target.checked);
  // if (e.target.checked) {
  //   text[0].style.backgroundColor = "rgba(58, 114, 215, 0.5)";
  // } else {
  //   text[0].style.backgroundColor = "transparent";
  // }
}

// for (let i in textMargins) {
//   textMargins[i].addEventListener("change", (e) => {
//     console.log(e.target.value);
//     const name = e.target.name;
//     text[0].style = { [name]: e.target.value };
//   });
// }

function setWord(e) {
  wordSettings[e.target.name] = +e.target.value;
  console.log(wordSettings);
}

function handleWord() {
  let str = input.value.substring(0, 400);
  let out = "";
  for (let i in str) {
    let size = Math.round(
      Math.random() * (wordSettings.sizeMax - wordSettings.sizeMin) +
        wordSettings.sizeMin
    );
    out += `<span style="font-size: ${size}px; margin-right:${wordSettings.marginRight}px; line-height:${wordSettings.lineHeight}px ">${str[i]}</span>`;
  }
  // text[0].innerHTML = out;
  ipcRenderer.sendTo(printID, "word:content", out);
}

function setRotate(e) {
  textSettings[e.target.name] = +e.target.value;
  // text[0].style.transform =
  //   "rotateX(" +
  //   textSettings.rotateX +
  //   "deg)" +
  //   " rotateY(" +
  //   textSettings.rotateY +
  //   "deg)";
  ipcRenderer.sendTo(printID, "text:rotate", textSettings);
}

function sendPrint() {
  ipcRenderer.sendTo(printID, "print", textSettings, wordSettings, input.value);
}
