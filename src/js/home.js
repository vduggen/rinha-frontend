window.addEventListener("DOMContentLoaded", () => {
	getInputUpload().addEventListener("change", (event) =>
		changeInputUpload(event)
	);
	document.querySelector('.rf-button').addEventListener('click', openUpload);
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
	document.querySelector(".rf-main #json-tree .rf-title").innerText =
		nameFile;
}

let arrayBuffer = null;
let startIndex = 0;
let endIndex = 500;

function webWorkerGetPartArray(arrayBuffer) {
	const worker = new Worker("src/js/getPartArray.js");
	worker.onmessage = (event) => {
		console.log('event.data', event.data);
	};
	worker.postMessage({
		array: arrayBuffer,
		startIndex,
		endIndex
	});
}

function onLoadFileReader() {
	arrayBuffer = this.result;
	changeDisplayElements();
	const int8Array = new Int8Array(arrayBuffer);
	webWorkerGetPartArray(int8Array);
}

import jsonToAst from 'https://cdn.jsdelivr.net/npm/json-to-ast@2.1.0/+esm'

function renderProperty(contentElement, key, value) {
	const rowElement = createRowElement();
	const keyElement = createKeyElement(key);
	rowElement.appendChild(keyElement);
	const valueElement = createValueElement(value);
	rowElement.appendChild(valueElement);
	contentElement.appendChild(rowElement);
}

function onLoadFileReader2() {
	changeDisplayElements();
	const jsonAst = jsonToAst(this.result, {
		loc: false,
	});
	console.log(jsonAst);
	// if (jsonAst.type === nodeTypes.OBJECT) {
	// 	const bracketElement = createBracketElement("{");
		// scopeElement.appendChild(bracketElement);
		// const contentElement = createContentElement();
		// scopeElement.appendChild(contentElement);
		// recursive(jsonAst.children, contentElement);
		// const bracketElement2 = createBracketElement("}");
		// scopeElement.appendChild(bracketElement2);
	// }
	bootstrap(jsonAst);
}

function changeInputUpload(event) {
	const fileReader = new FileReader();
	fileReader.onload = onLoadFileReader2;
	const arrFiles = event.target.files;
	if (arrFiles && arrFiles.length > 0) {
		const objFirstFile = arrFiles[0];
		setTitle(objFirstFile.name);
		// fileReader.readAsArrayBuffer(objFirstFile);
		fileReader.readAsText(objFirstFile);
	}
}
