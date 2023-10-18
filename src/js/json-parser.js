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
		event.target.previousSibling?.classList?.toggle("rf-content--hover");
	});
	rowElement.addEventListener("mouseout", (event) => {
		event.target.previousSibling?.classList?.toggle("rf-content--hover");
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

// let isExecuting = false;
let isFirst = true;
let arrScopes = [];
let scopeElementLocal = null;
let lastAttributeCorrect = null;
let numberRow = 1;
let nextCorrect = false;
let isScope = false;

function renderRowByRow(rows, scopeElement) {
	const copiaRows = [...rows];
	scopeElementLocal = scopeElement;
	copiaRows.forEach((row, index) => {
		// numberRow = index;
		console.log(row);
		if (nextCorrect === true || isFirst === true) {
			if (row.trim() === "[{") {
				copiaRows.splice(index + 1, 0, "[");
				copiaRows.splice(index + 2, 0, "{");
			} else if (["[", "{"].includes(row.trim()[0])) {
				const element = getElementByValue(row);
				scopeElementLocal.appendChild(element);
				const contentElement = createContentElement();
				arrScopes.push(contentElement);
				scopeElementLocal.appendChild(contentElement);
				scopeElementLocal = contentElement;
			} else if (["]", "}"].includes(row.trim()[0])) {
				const element = getElementByValue(row);
				const newArrScopes = arrScopes.slice(0, arrScopes.length - 1);
				if (newArrScopes.length >= 1) {
					newArrScopes.at(-1).appendChild(element);
				}
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
				lastAttributeCorrect = row;
			} else if (
				new RegExp(/^"[^"\n]*"/g).test(row.trim()) ||
				["number", "boolean", "bigint", "symbol", "function", "object", "undefined"].includes(typeof row)
			) {
				const element = getElementByValue(row);
				scopeElementLocal.appendChild(element);
			}
		}

		if (isFirst === false) {
			if (row === lastAttributeCorrect) {
				nextCorrect = true;
			}
		}
	});
	// const rfScopeElement = document.querySelector('.rf-scope');
	// if (rfScopeElement.scrollHeight < 602) {
	// 	renderRowByRow(getRows(), rfScopeElement);
	// }
	if (isFirst === true) {
		isFirst = false;
		const rfScopeElement = document.querySelector(".rf-scope");
		rfScopeElement.addEventListener("scroll", (event) => {
			const lastContentElement = document.querySelector(
				".rf-scope > .rf-content > .rf-content > .rf-content:last-child"
			);
			const lastContentElementHeight = lastContentElement?.clientHeight;
			if (
				rfScopeElement.scrollTop + rfScopeElement?.clientHeight >=
				rfScopeElement.scrollHeight - (lastContentElementHeight + 20)
			) {
				nextCorrect = false;
				renderRowByRow(getRows(), scopeElementLocal);
				console.log('lastAttributeCorrect', lastAttributeCorrect);
			}
		});
	}
}
