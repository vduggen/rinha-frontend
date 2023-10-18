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

function changeTab() {
  document.getElementById("home").style.display = "none";
  document.getElementById("json-tree").style.display = "flex";
}

let toRender = null;

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
  let bracketType = bracketsTypes.JSON;
  if (Array.isArray(jsonParsed)) {
    bracketType = bracketsTypes.ARRAY;
    toRender = JSON.stringify(jsonParsed.slice(10));
    jsonParsed = jsonParsed.slice(0, 10);
  }
  const objStructure = createStructure(
    document.getElementById("json-tree"),
    bracketType
  );
  renderJsonTree(jsonParsed, objStructure.contentTag);
  var meuElemento = document.querySelector(".rf-scope");

  meuElemento.addEventListener("scroll", function () {
    // Verifica se o usuário está perto do final do elemento
    const height = document.querySelector(
      ".rf-scope > .rf-content > .rf-column:last-child"
    ).clientHeight;
    const metade = height / 2;
    const height2 = height + metade;
    if (
      meuElemento.scrollTop + meuElemento.clientHeight >=
      meuElemento.scrollHeight - height2
    ) {
      let json = null;
      const toRenderParsed = JSON.parse(toRender);
      if (Array.isArray(toRenderParsed)) {
        const copia1 = [...toRenderParsed];
        const copia2 = [...toRenderParsed];
        json = copia1.slice(0, 10);
        toRender = JSON.stringify(copia2.slice(10));
      }
      renderJsonTree(json, objStructure.contentTag);
    }
  });
}

function setTitle(nameFile) {
  document.querySelector(".rf-main #json-tree .rf-title").innerText = nameFile;
}

let arrayBuffer = null;
let startIndex = 0;
let endIndex = 500;

function getRows() {
	console.log(arrayBuffer);
	const rows = String.fromCharCode
      .apply(null, new Int8Array(arrayBuffer.slice(startIndex, endIndex)))
      .replaceAll("\t", " ")
      .split("\n");
	startIndex += 500 - 50;
	endIndex += 500;
	return arrayBuffer;
}

function changeInputUpload(event) {
  const fileReader = new FileReader();
  fileReader.onload = function () {
	arrayBuffer = fileReader.result;
    // const rows = getRows();
	const scopeElement = createScopeElement();
	document.getElementById("json-tree").appendChild(scopeElement);
    // renderRowByRow(rows, scopeElement);
    // loadFileReader(fileReader);
    changeTab();
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
