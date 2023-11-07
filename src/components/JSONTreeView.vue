<template>
    <div class="json-tree">
        <h1 class="json-tree__title">{{ nameFile }}</h1>
        <div @scroll="onScroll" class="json-tree__tree">
            <span :class="{ 'json-tree__bracket': ['{', '}', '],', '},', '[', ']'].includes(objToken.value) }"
                v-for="(objToken, index) in lexer" :key="index" :style="{ marginLeft: `${objToken.scopeLevel * 24}px` }"
                style="white-space: nowrap;" class="json-tree__row">
                <template v-if="objToken?.key">
                    <span class="json-tree__key">{{ objToken.key }}:</span>
                    <span :class="{ 'json-tree__bracket': ['{', '}', '],', '},', '['].includes(objToken.value.trim()) }">
                        {{ objToken.value }}
                    </span>
                </template>
                <template v-else>
                    {{ objToken.value }}
                </template>
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    nameFile: {
        type: String,
        default: ''
    },
    contentFile: {
        type: String,
        default: ''
    }
});

let start = 0;
let end = 500;

function getString() {
    return props.contentFile;
    let result = props.contentFile.substring(start, end);
    if (result.charAt(-1) !== ',') {
        let isLoop = true;
        let index = result.length + 1;
        while (isLoop) {
            if (props.contentFile[index] === ',') {
                result = props.contentFile.substring(start, index + 1);
                isLoop = false;
                break;
            }
            index++;
        }
    }
    start += result.length;
    end += 500;
    return result;
}

function onScroll(event) {
    // Obtém a posição do elemento em relação à parte superior do documento
    const elementoTopo = event.target.offsetTop;

    // Verifica se a posição do elemento + altura do elemento é igual à altura total do documento
    if (elementoTopo + event.target.offsetHeight <= window.innerHeight + window.scrollY) {
        console.log("Você chegou ao final do elemento!");
        // Aqui você pode adicionar o código que deseja executar quando chegar ao final do elemento
    }
}

const lexer = computed(() => {
    let tokens = [];
    let index = 0;
    let scopeLevel = 0;
    const chars = getString().split("");
    while (index < chars.length) {
        // if (index === 488) {
        //     debugger
        // }
        let character = chars[index];
        if (character !== " ") {
            if (character === "}" || character === "]") {
                scopeLevel--;
                if (chars[index + 1] === ",") {
                    character += chars[index + 1];
                    index += 1;
                }
            }
            if (character === '"') {
                let value = '"';
                index += 1;
                character = chars[index];
                let upScope = false;
                while (character !== '"') {
                    character = chars[index];
                    index += 1;
                    value += character;
                }
                let key = value;
                value = "";
                const isComma = chars[index] === ":";

                if (chars[index] === ',') {
                    key += ',';
                    index += 1;
                    character = chars[index];
                }
                // if (isComma) {
                index += 1;
                character = chars[index];
                if (character.trim().length === 0) {
                    index += 1;
                    character = chars[index];
                    value += " ";
                }
                if (character === "{") {
                    value += " {";
                    index += 1;
                    character = chars[index];
                    upScope = true;
                }
                // if (character === "[") {
                //     value += " [";
                //     index += 1;
                //     character = chars[index];
                //     upScope = true;
                // }
                if (character.trim().length === 0) {
                    index += 1;
                    character = chars[index];
                    value += " ";
                }
                if (character === '"') {
                    value += character;
                    index += 1;
                    character = chars[index];
                    while (character !== '"') {
                        character = chars[index];
                        index += 1;
                        value += character;
                    }
                    if (chars[index] === ',') {
                        value += ',';
                        index += 1;
                        character = chars[index];
                    }
                }
                if (character === "[") {
                    value += character;
                    index += 1;
                    character = chars[index];
                    while (character !== ']') {
                        character = chars[index];
                        index += 1;
                        value += character;
                    }
                    // value += chars[index];
                    // index += 1;
                    // character = chars[index];
                    if (chars[index] === ',') {
                        value += ',';
                        index += 1;
                        character = chars[index];
                    }
                }
                if (
                    chars[index] === "n" &&
                    chars[index + 1] === "u" &&
                    chars[index + 2] === "l" &&
                    chars[index + 3] === "l"
                ) {
                    value += null;
                    if (chars[index + 4] === ',') {
                        value += ',';
                        index += 5;
                        character = chars[index + 5];
                    } else {
                        index += 4;
                        character = chars[index + 4];
                    }
                }
                if (
                    chars[index] === "t" &&
                    chars[index + 1] === "r" &&
                    chars[index + 2] === "u" &&
                    chars[index + 3] === "e"
                ) {
                    value += true;
                    if (chars[index + 4] === ',') {
                        value += ',';
                        index += 5;
                        character = chars[index + 5];
                    } else {
                        index += 4;
                        character = chars[index + 4];
                    }
                }
                if (
                    chars[index] === "f" &&
                    chars[index + 1] === "a" &&
                    chars[index + 2] === "l" &&
                    chars[index + 3] === "s" &&
                    chars[index + 4] === "e"
                ) {
                    value += false;
                    if (chars[index + 5] === ',') {
                        value += ',';
                        index += 6;
                        character = chars[index + 6];
                    } else {
                        index += 5;
                        character = chars[index + 5];
                    }
                }
                if (chars[index] && chars[index].match(/[0-9]/)) {
                    while (chars[index] === '-' || chars[index] === "." || chars[index].match(/[0-9]/) || chars[index] === ',') {
                        value += character;
                        index += 1;
                        character = chars[index];
                    }
                }
                // }
                tokens.push(isComma ? {
                    key,
                    value,
                    scopeLevel
                } : {
                    value: key,
                    scopeLevel
                });
                if (upScope) {
                    scopeLevel++;
                }
                value = "";
                console.log(index);
                continue;
            } else {
                tokens.push({
                    value: character,
                    scopeLevel
                });
            }
            if (character === "{" || character === '[') {
                scopeLevel++;
            }
        }
        console.log(index);
        index += 1;
    }
    return tokens;
});
</script>

<style scoped>
.json-tree {
    height: 100vh;
}

.json-tree .json-tree__title {
    font-weight: 700;
    margin-top: 24px;
    margin-bottom: 10px;
    font-size: 32px;
}

.json-tree .json-tree__tree {
    display: flex;
    flex-direction: column;
    max-height: calc(100% - 73px - 16px);
    overflow: auto;
    width: 500px;
}

.json-tree .json-tree__tree .json-tree__key {
    color: #4E9590;
}

.json-tree .json-tree__tree .json-tree__row {
    border-radius: 2px;
    padding: 4px;
    text-overflow: ellipsis;
    cursor: default;
    width: max-content;
}

.json-tree .json-tree__tree .json-tree__row:hover {
    background-color: #f2f2f2;
}

.json-tree .json-tree__tree .json-tree__bracket {
    color: #F2CAB8;
}
</style>