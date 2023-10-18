window.addEventListener("DOMContentLoaded", () => {
  getInputUpload().addEventListener("change", (event) =>
    changeInputUpload(event)
  );
});

function getInputUpload() {
  return document.getElementById("rf-upload");
}

function openUpload() {
  getInputUpload().click();
}

function changeDisplayElements() {
  document.getElementById("home").style.display = "none";
  document.getElementById("json-tree").style.display = "flex";
}

function setTitle(nameFile) {
  document.querySelector(".rf-main #json-tree .rf-title").innerText = nameFile;
}

let arrayBuffer = null;
let startIndex = 0;
let endIndex = 500;

function changeInputUpload(event) {
  const fileReader = new FileReader();
  fileReader.onload = function () {
	arrayBuffer = fileReader.result;
	const scopeElement = createScopeElement();
	document.getElementById("json-tree").appendChild(scopeElement);
    changeDisplayElements();
	const arraySliced = [];
	new Int8Array(arrayBuffer).forEach((element, index) => {
		if (index >= startIndex && index <= endIndex) {
			arraySliced[index] = element;
		}
	});
	tokenizacao(arraySliced, scopeElement);
  };
  const arrFiles = event.target.files;
  if (arrFiles && arrFiles.length > 0) {
    const objFirstFile = arrFiles[0];
    setTitle(objFirstFile.name);
    fileReader.readAsArrayBuffer(objFirstFile);
  }
}
