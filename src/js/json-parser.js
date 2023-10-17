function createElementWithClassname(classname) {
	const divElement = document.createElement("div");
	divElement.classList.add(classname);
	return divElement;
}

function createElementWithInnerTextAndClassname(innerText, classname) {
	const divElement = document.createElement("div");
	divElement.classList.add(classname);
	divElement.innerText = innerText;
	return divElement;
}

function createKeyElement(innerText) {
	return createElementWithInnerTextAndClassname(`${innerText}:`, "rf-key");
}

function createValueElement(innerText) {
	return createElementWithInnerTextAndClassname(innerText, "rf-value");
}

function createBracketElement(innerText) {
	return createElementWithInnerTextAndClassname(innerText, "rf-bracket");
}

function createRowElement() {
	const rowElement = createElementWithClassname("rf-row");
	rowElement.addEventListener("mouseover", (event) => {
		event.target.previousSibling?.classList?.toggle('rf-content--hover');
	});
	rowElement.addEventListener("mouseout", (event) => {
		event.target.previousSibling?.classList?.toggle('rf-content--hover');
	});
	return rowElement;
}

function getElementByValue(value) {
	const isBracket = ["[", "]", "],", "{", "}", "},"].includes(value.trim());
	if (isBracket) {
		const rowElement = createRowElement();
		const bracketElement = createBracketElement(value);
		rowElement.appendChild(bracketElement);
		return rowElement;
	}
	return createValueElement(value);
}

function createRowWithKeyValueSimple(key, value) {
	const rowElement = createRowElement();

	const keyElement = createKeyElement(key);
	rowElement.appendChild(keyElement);

	const valueElement = getElementByValue(value);
	rowElement.appendChild(valueElement);

	return rowElement;
}

function createContentElement() {
	return createElementWithClassname("rf-content");
}

function createScopeElement() {
	return createElementWithClassname("rf-scope");
}

function getElementToAppend() {}

function renderRowByRow(rows, scopeElement) {
	let arrScopes = [scopeElement];
	let scopeElementLocal = scopeElement;
	for (const row of rows) {
		console.log(row);
		if (["[", "{"].includes(row.trim()[0])) {
			const element = getElementByValue(row);
			scopeElementLocal.appendChild(element);
			const contentElement = createContentElement();
			arrScopes.push(contentElement);
			scopeElementLocal.appendChild(contentElement);
			scopeElementLocal = contentElement;
		} else if (["]", "}"].includes(row.trim()[0])) {
			const element = getElementByValue(row);
			const newArrScopes = arrScopes.slice(0, arrScopes.length - 1);
			newArrScopes.at(-1).appendChild(element);
			arrScopes = newArrScopes;
			scopeElementLocal = newArrScopes.at(-1);
		} else if (row.split(":").length > 1) {
			const [key, value] = row.split(":");
			const rowElement = createRowWithKeyValueSimple(key, value);
			scopeElementLocal.appendChild(rowElement);
			if (["[", "{"].includes(value.trim()[0])) {
				const contentElement = createContentElement();
				arrScopes.push(contentElement);
				scopeElementLocal.appendChild(contentElement);
				scopeElementLocal = contentElement;
			}
		} else {
			const element = getElementByValue(row);
			scopeElementLocal.appendChild(element);
		}
	}
}
