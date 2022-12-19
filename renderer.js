const info = document.getElementById("info");
const openDialog = document.getElementById("openDialog");

// console.log(info);

info.innerText = `本应用使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), Electron (v${versions.electron()})\n 恭喜你的电脑里面又多了一个Chrome！`;

openDialog.addEventListener("click", async () => {
  const path = await electronAPI.openFile();
  console.log(path);
});
