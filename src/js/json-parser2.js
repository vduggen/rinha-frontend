function validateIsBreakLine(character) {
	return character === "\n";
}

function validateIsWordOrNumber(character) {
	return new RegExp(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\/\-=|]+$/).test(character);
}

function validateIsKeyOrValue(character) {
	return (
		validateIsQuotationMarks(character) ||
		validateIsWordOrNumber(character)
	);
}

function validateIsQuotationMarks(character) {
	return character === '"' || character === "'";
}

function validateIsOpenBracket(character) {
	return character === "{" || character === "[";
}

function validateIsCloseBracket(character) {
	return character === "}" || character === "]";
}

function validateIsBracket(character) {
	return validateIsOpenBracket(character) || validateIsCloseBracket(character);
}

function tokenizacao(arrayBuffer, scopeElement) {
	let key = "";
	let value = "";
	let isValue = false;
	let scopeElementLocal = scopeElement;
	let arrScopes = [scopeElement];
	arrayBuffer.forEach((int8, index) => {
		const character = String.fromCharCode(int8);
		// debugger;
		console.log({
			character,
			'validateIsBracket(character)': validateIsBracket(character),
		});
		if (validateIsOpenBracket(character)) {
			const bracketElement = createBracketElement(character);
			scopeElementLocal.appendChild(bracketElement);
			const contentElement = createContentElement();
			scopeElementLocal.appendChild(contentElement);
			scopeElementLocal = contentElement;
			arrScopes.push(contentElement);
		}
		// if (character !== " ") {
			// if (validateIsCloseBracket(character)) {
			// 	const newArrScopes = arrScopes.slice(0, arrScopes.length - 1);
			// 	const bracketElement = createBracketElement(character);
			// 	if (newArrScopes.length > 0) {
			// 		newArrScopes.at(-1).appendChild(bracketElement);
			// 	} else {
			// 		scopeElement.appendChild(bracketElement);
			// 		scopeElementLocal = scopeElement;
			// 	}
			// 	arrScopes = newArrScopes;
			// } else if (character === ":") {
			// 	isValue = true;
			// } else if (isValue && key !== "" && character === ",") {
			// 	value += character;
			// 	isValue = false;
			// 	const rowElement = createRowElement();
			// 	const keyElement = createKeyElement(key);
			// 	rowElement.appendChild(keyElement);
			// 	const valueElement = createValueElement(value);
			// 	rowElement.appendChild(valueElement);
			// 	scopeElementLocal.appendChild(rowElement);
			// 	key = "";
			// 	value = "";
			// } else if (isValue && validateIsBracket(character) === false) {
			// 	value += character;
			// } else if (validateIsOpenBracket(character) && key !== "" && isValue) {
			// 	const rowElement = createRowElement();
			// 	const keyElement = createKeyElement(key);
			// 	rowElement.appendChild(keyElement);
			// 	const bracketElement = createBracketElement(character);
			// 	rowElement.appendChild(bracketElement);
			// 	scopeElementLocal.appendChild(rowElement);
			// 	key = "";
			// 	value = "";
			// 	isValue = false;
			// 	const contentElement = createContentElement();
			// 	scopeElementLocal.appendChild(contentElement);
			// 	scopeElementLocal = contentElement;
			// 	arrScopes.push(contentElement);
			// } else if (validateIsKeyOrValue(character)) {
			// 	key += character;
			// } else if (validateIsOpenBracket(character)) {
				// const bracketElement = createBracketElement(character);
				// scopeElementLocal.appendChild(bracketElement);
				// const contentElement = createContentElement();
				// scopeElementLocal.appendChild(contentElement);
				// scopeElementLocal = contentElement;
				// arrScopes.push(contentElement);
			// }
		// }
	});
}
