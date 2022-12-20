const { ipcRenderer } = require("electron");

const { versions } = require("./preload");

const info = document.getElementById("info");
const pages = document.getElementsByClassName("page");
const text = document.getElementsByClassName("content");

info.innerText = `本应用使用 Chrome (v${versions.node}), Node.js (v${versions.node}), Electron (v${versions.node})\n 恭喜你的电脑里面又多了一个Chrome！`;

async function openDialog() {
  const path = await ipcRenderer.invoke("dialog:open");
  // background.setAttribute("src", path);
  console.log(path);
  pages[0].style.backgroundImage = `url(./resource/background/${path})`;
  pages[0].style.backgroundRepeat = "no-repeat";
  pages[0].style.backgroundSize = "contain";
}

function textPaddings(e) {
  text[0].style[e.target.name] = e.target.value + "px";
}

function showMask(e) {
  if (e.target.checked) {
    text[0].style.backgroundColor = "rgba(58, 114, 215, 0.5)";
  } else {
    text[0].style.backgroundColor = "transparent";
  }
}

// for (let i in textMargins) {
//   textMargins[i].addEventListener("change", (e) => {
//     console.log(e.target.value);
//     const name = e.target.name;
//     text[0].style = { [name]: e.target.value };
//   });
// }

var wordSettings = {
  sizeMax: 15,
  sizeMin: 10,
};

function setWord(e) {
  wordSettings[e.target.name] = +e.target.value;
}

function handleWord() {
  let str = text[0].innerText;
  let out = "";
  for (let i in str) {
    let size = Math.round(
      Math.random() * (wordSettings.sizeMax - wordSettings.sizeMin) +
        wordSettings.sizeMin
    );
    out += `<span style="font-size: ${size}px">${str[i]}</span>`;
  }
  text[0].innerHTML = out;
}
