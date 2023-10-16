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
  const objBreacket = createBracket(bracketType);
  attributeTag.appendChild(objBreacket.bracketArrayOpenTag);
  const contentTag = createContentTag();
  attributeTag.appendChild(contentTag);
  attributeTag.appendChild(objBreacket.bracketArrayCloseTag);
}

function renderTreeView(json) {
  for (const node in json) {
    let attributeTag = null;
    if (Array.isArray(json[node])) {
      attributeTag = createAttributeTag(true);
      const keyTag = createKeyTag(node, true);
      // const collapseTag = createCollapse();
      // keyTag.prepend(collapseTag);
      attributeTag.appendChild(keyTag);
      const bracketOpenTag = createBracketOpen(bracketsTypes.ARRAY);
      keyTag.appendChild(bracketOpenTag);

      const valueTag = document.createElement("div");
      valueTag.classList.add("rf-attribute--column");

      const contentTag = createContentTag(true);
      for (const nodeArray of json[node]) {
        if (
          typeof nodeArray !== "object" &&
          Array.isArray(nodeArray) === false
        ) {
          const valueTag = createValueTag(nodeArray);
          contentTag.appendChild(valueTag);
        }
      }
      valueTag.appendChild(contentTag);
      const bracketCloseTag = createBracketClose(bracketsTypes.ARRAY);
      valueTag.appendChild(bracketCloseTag);
      attributeTag.appendChild(valueTag);
      // const scopeTag = createStructure(bracketsTypes.ARRAY, contentTag);
    } else {
      attributeTag = createAttributeTag();
      const keyTag = createKeyTag(node);
      attributeTag.appendChild(keyTag);
      const valueTag = createValueTag(json[node]);
      attributeTag.appendChild(valueTag);
    }

    document.querySelector("#json-tree > .rf-content").appendChild(attributeTag);
  }
}
