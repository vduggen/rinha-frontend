function createAttributeTag(isColumn = false) {
  const attributeTag = document.createElement("div");
  let classname = "rf-attribute";
  attributeTag.classList.add(classname);
  if (isColumn === true) {
    classname += "--column";
  }
  attributeTag.classList.add(classname);
  return attributeTag;
}

function createCollapse() {
  const collapseTag = document.createElement("div");
  collapseTag.classList.add("rf-collapse");
  collapseTag.innerHTML = "&#9656";
  return collapseTag;
}

function createKeyTag(text, isRow = false) {
  const keyTag = document.createElement("span");
  let classname = "rf-key";
  if (isRow === true) {
    classname += "--row";
  }
  keyTag.classList.add(classname);
  keyTag.innerText = `${text}:`;
  return keyTag;
}

function createValueTag(text) {
  const valueTag = document.createElement("span");
  valueTag.classList.add("rf-value");
  let textFormatted = text;
  if (typeof text === "string") {
    textFormatted = `"${text}"`;
  }
  valueTag.innerText = `${textFormatted},`;
  return valueTag;
}

let beforeElement = null;

const bracketsTypes = {
  ARRAY: {
    open: "[",
    close: "]",
  },
  JSON: {
    open: "{",
    close: "}",
  },
};

function createBracketOpen(bracketType = bracketsTypes.JSON) {
  const bracketArrayOpenTag = document.createElement("div");
  bracketArrayOpenTag.innerText = bracketType.open;
  bracketArrayOpenTag.classList.add("rf-bracket");
  return bracketArrayOpenTag;
}

function createBracketClose(bracketType = bracketsTypes.JSON) {
  const bracketArrayCloseTag = document.createElement("div");
  bracketArrayCloseTag.innerText = bracketType.close;
  bracketArrayCloseTag.classList.add("rf-bracket");
  return bracketArrayCloseTag;
}

function createBracket(bracketType = bracketsTypes.JSON) {
  const bracketArrayOpenTag = createBracketOpen();
  const bracketArrayCloseTag = createBracketClose();
  return {
    bracketArrayOpenTag,
    bracketArrayCloseTag,
  };
}

function createContentTag(isColumn = false) {
  const contentTag = document.createElement("div");
  let classname = "rf-content";
  contentTag.classList.add(classname);
  if (isColumn === true) {
    classname += "--column";
  }
  contentTag.classList.add(classname);
  return contentTag;
}

function createScopeTag() {
  const scopeTag = document.createElement("div");
  scopeTag.classList.add("rf-scope");
  return scopeTag;
}

function createStructure(attributeTag, bracketType = bracketsTypes.JSON) {
  const scopeTag = createScopeTag();
  const objBreacket = createBracket(bracketType);
  scopeTag.appendChild(objBreacket.bracketArrayOpenTag);
  const contentTag = createContentTag();
  scopeTag.appendChild(contentTag);
  scopeTag.appendChild(objBreacket.bracketArrayCloseTag);
  attributeTag.appendChild(scopeTag);
  return {
    contentTag
  }
}

function createRowTag() {
  const rowTag = document.createElement('div');
  rowTag.classList.add('rf-row')
  return rowTag;
}

function createColumnTag() {
  const rowTag = document.createElement('div');
  rowTag.classList.add('rf-column')
  return rowTag;
}

function structureBase(key, value) {
  const rowTag = createRowTag();
  const keyTag = createKeyTag(key);
  rowTag.appendChild(keyTag);
  const valueTag = createValueTag(value);
  rowTag.appendChild(valueTag);
  return rowTag;
}

function structureJSON(key, value) {
  const columnTag = createColumnTag();
  const keyTag = createKeyTag(key);
  const bracketOpenTag = createBracketOpen();
  keyTag.appendChild(bracketOpenTag);
  keyTag.classList.add('rf-row');
  columnTag.appendChild(keyTag);
  return columnTag;
}

function structureArray(key, value) {
  const columnTag = createColumnTag();
  const keyTag = createKeyTag(key);
  const bracketOpenTag = createBracketOpen(bracketsTypes.ARRAY);
  keyTag.appendChild(bracketOpenTag);
  keyTag.classList.add('rf-row');
  columnTag.appendChild(keyTag);
  return columnTag;
}

function renderJsonTree(json, contentTag) {
  for (const key in json) {
    let value = json[key];
    let rowTag = null;
    if (Array.isArray(value) === true) {
      rowTag = structureArray(key);
      const contentTag = createContentTag();
      renderJsonTree(value, contentTag);
      rowTag.appendChild(contentTag);
      const bracketCloseTag = createBracketClose(bracketsTypes.ARRAY);
      rowTag.appendChild(bracketCloseTag);
    } else if (typeof value === 'object' && value !== null) {
      rowTag = structureJSON(key);
      const contentTag = createContentTag();
      renderJsonTree(value, contentTag);
      rowTag.appendChild(contentTag);
      const bracketCloseTag = createBracketClose();
      rowTag.appendChild(bracketCloseTag);
    } else {
      rowTag = structureBase(key, value);
    }
    contentTag.appendChild(rowTag);
  }
}
