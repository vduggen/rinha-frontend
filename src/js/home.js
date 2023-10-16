window.addEventListener("DOMContentLoaded", () => {
  getInputUpload().addEventListener("change", (event) => changeInputUpload(event));
});

function getInputUpload() {
  return document.getElementById("rf-upload");
}

function openUpload() {
  getInputUpload().click();
}

function changeTab() {
  document.getElementById("home").style.display = "none";
  document.getElementById("json-tree").style.display = "flex";
}

function loadFileReader(fileReader) {
  let jsonParsed = {};
  try {
    jsonParsed = JSON.parse(fileReader.result);
  } catch (e) {
    console.log(e);
    document.getElementById("rf-error").classList.remove("rf-error--hidden");
    return false;
  }
  changeTab(fileReader.result);
  const objStructure = createStructure(document.getElementById("json-tree"));
  renderJsonTree(jsonParsed, objStructure.contentTag);
}

function setTitle(nameFile) {
  document.querySelector(".rf-main #json-tree .rf-title").innerText = nameFile;
}

function changeInputUpload(event) {
  const fileReader = new FileReader();
  fileReader.onload = function () {
    loadFileReader(fileReader);
  };
  const arrFiles = event.target.files;
  if (arrFiles && arrFiles.length > 0) {
    const objFirstFile = arrFiles[0];
    setTitle(objFirstFile.name);
    fileReader.readAsText(objFirstFile);
  }
}