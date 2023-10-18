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

function recursive(arrChildren = [], contentElement) {
	for (const objChildren of arrChildren) {
		if (objChildren.type === "Property") {
			const rowElement = createRowElement();
			const keyElement = createKeyElement(objChildren.key.raw);
			rowElement.appendChild(keyElement);
			contentElement.appendChild(rowElement);
			if (objChildren.value.type === "Object") {
				const bracketElement = createBracketElement("{");
				rowElement.appendChild(bracketElement);
				const contentElementChild = createContentElement();
				contentElement.appendChild(contentElementChild);
				for (const objChildren2 of objChildren.value.children) {
					renderProperty(contentElementChild, objChildren2.key.raw, objChildren2.value.raw);
				}
			}
		}
	}
	const bracketElement = createBracketElement("}");
	contentElement.appendChild(bracketElement);
}

function onLoadFileReader2() {
	changeDisplayElements();
	const jsonAst = jsonToAst(this.result);
	console.log(jsonAst);
	const scopeElement = createScopeElement();
	document.getElementById("json-tree").appendChild(scopeElement);
	if (jsonAst.type === "Object") {
		const bracketElement = createBracketElement("{");
		scopeElement.appendChild(bracketElement);
		const contentElement = createContentElement();
		scopeElement.appendChild(contentElement);
		// for (const objChildren of jsonAst.children) {
		// 	if (objChildren.type === "Property") {
		// 		const rowElement = createRowElement();
		// 		const keyElement = createKeyElement(objChildren.key.raw);
		// 		rowElement.appendChild(keyElement);
		// 		if (objChildren.value.type === "Object") {
		// 			const bracketElement = createBracketElement("{");
		// 			rowElement.appendChild(bracketElement);
		// 		}
		// 		contentElement.appendChild(rowElement);
		// 	}
		// }
		recursive(jsonAst.children, contentElement);
		const bracketElement2 = createBracketElement("}");
		scopeElement.appendChild(bracketElement2);
	}
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
