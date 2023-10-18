const bracketTypes = {
	ARRAY: {
		open: "[",
		close: "]",
	},
	JSON: {
		open: "{",
		close: "}",
	},
};

const nodeTypes = {
	OBJECT: "Object",
	ARRAY: "Array",
	PROPERTY: "Property",
	LITERAL: "Literal",
};

function isObject(type) {
	return type === nodeTypes.OBJECT;
}

function isArray(type) {
	return type === nodeTypes.ARRAY;
}

function renderScopeElement() {
	const scopeElement = createScopeElement();
	document.getElementById("json-tree").appendChild(scopeElement);
	return scopeElement;
}

function renderChildren(children = [], contentElement) {
	children.forEach((child, index) => {
		if (child.type === nodeTypes.PROPERTY) {
			const rowElement = createRowElement();
			const keyElement = createKeyElement(child.key.raw);
			rowElement.appendChild(keyElement);
			if (child.value.type === nodeTypes.ARRAY) {
				contentElement.appendChild(rowElement);
				const bracketElement = createBracketElement(
					bracketTypes.ARRAY.open
				);
				rowElement.appendChild(bracketElement);
				const contentElementChild = createContentElement();
				contentElement.appendChild(contentElementChild);
				renderChildren(child.value.children, contentElementChild);
			} else if (child.value.type === nodeTypes.OBJECT) {
				contentElement.appendChild(rowElement);
				const bracketElement = createBracketElement(
					bracketTypes.JSON.open
				);
				rowElement.appendChild(bracketElement);
				const contentElementChild = createContentElement();
				contentElement.appendChild(contentElementChild);
				renderChildren(child.value.children, contentElementChild);
				const rowElement2 = createRowElement();
				const bracketElement2 = createBracketElement(
					`${bracketTypes.JSON.close}${
						index === children.length - 1 ? "" : ","
					}`
				);
				rowElement2.appendChild(bracketElement2);
				contentElement.appendChild(rowElement2);
			} else {
				const valueElement = createValueElement(
					`${child.value.raw}${
						index === children.length - 1 ? "" : ","
					}`
				);
				rowElement.appendChild(valueElement);
				contentElement.appendChild(rowElement);
			}
		}
		if (child.type === nodeTypes.OBJECT) {
			const rowElement = createRowElement();
			const bracketElement = createBracketElement(bracketTypes.JSON.open);
			rowElement.appendChild(bracketElement);
			contentElement.appendChild(rowElement);
			const contentElementChild = createContentElement();
			contentElement.appendChild(contentElementChild);
			renderChildren(child.children, contentElementChild);
			const rowElement2 = createRowElement();
			const bracketElement2 = createBracketElement(
				`${bracketTypes.JSON.close}${
					index === children.length - 1 ? "" : ","
				}`
			);
			rowElement2.appendChild(bracketElement2);
			contentElement.appendChild(rowElement2);
		}
		if (
			child?.value?.type === nodeTypes.ARRAY ||
			child?.type === nodeTypes.ARRAY
		) {
			const rowElement = createRowElement();
			contentElement.appendChild(rowElement);
			const contentElementChild = createContentElement();
			contentElement.appendChild(contentElementChild);
			renderChildren(child.children, contentElementChild);
			const bracketElement2 = createBracketElement(
				bracketTypes.ARRAY.close
			);
			rowElement.appendChild(bracketElement2);
		}
		if (child?.type === nodeTypes.LITERAL) {
			const rowElement = createRowElement();
			const valueElement = createValueElement(
				`${child.raw}${index === children.length - 1 ? "" : ","}`
			);
			rowElement.appendChild(valueElement);
			contentElement.appendChild(rowElement);
		}
	});
}

function bootstrap(jsonAst = {}) {
	const scopeElement = renderScopeElement();
	if (isObject(jsonAst.type)) {
		const rowElement = createRowElement();
		const bracketElement = createBracketElement(bracketTypes.JSON.open);
		rowElement.appendChild(bracketElement);
		scopeElement.appendChild(rowElement);
		const contentElement = createContentElement();
		scopeElement.appendChild(contentElement);
		renderChildren(jsonAst.children, contentElement);
		const rowElement2 = createRowElement();
		const bracketElement2 = createBracketElement(bracketTypes.JSON.close);
		rowElement2.appendChild(bracketElement2);
		scopeElement.appendChild(rowElement2);
	}
	if (isArray(jsonAst.type)) {
		const rowElement = createRowElement();
		const bracketElement = createBracketElement(bracketTypes.ARRAY.open);
		rowElement.appendChild(bracketElement);
		scopeElement.appendChild(rowElement);
		const contentElement = createContentElement();
		scopeElement.appendChild(contentElement);
		renderChildren(jsonAst.children, contentElement);
		const rowElement2 = createRowElement();
		const bracketElement2 = createBracketElement(bracketTypes.ARRAY.close);
		rowElement2.appendChild(bracketElement2);
		scopeElement.appendChild(rowElement2);
	}
}
