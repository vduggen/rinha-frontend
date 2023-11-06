<template>
    <div class="json-tree">
        <h1 class="json-tree__title">{{ nameFile }}</h1>
        <div class="json-tree__tree">
            <span
                :class="{ 'json-tree__bracket': ['{', '}', '],', '},'].includes(objToken.value) }"
                v-for="(objToken, index) in lexer"
                :key="index"
                :style="{ marginLeft: `${objToken.scopeLevel * 24}px` }"
            >
                <template v-if="objToken?.key">
                    <span class="json-tree__key">{{ objToken.key }}:</span>
                    <span :class="{ 'json-tree__bracket': ['{', '}', '],', '},'].includes(objToken.value.trim()) }">
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

const lexer = computed(() => {
    let tokens = [];
    let index = 0;
    let scopeLevel = 0;
    const chars = props.contentFile.split("");
    console.log(chars);
    while (index < chars.length) {
        let character = chars[index];
        if (character !== " ") {
            if (character === "}") {
                scopeLevel--;
                if (chars[index + 1] === ",") {
                    character += chars[index + 1];
                    index += 1;
                    // character = chars[index];
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
                const key = value;
                value = "";
                if (chars[index] === ":") {
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
                    if (character === "[") {
                        value += " [";
                        index += 1;
                        character = chars[index];
                        upScope = true;
                    }
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
                        value += chars[index];
                        index += 1;
                        character = chars[index];
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
                        value += chars[index];
                        index += 1;
                        character = chars[index];
                    }
                }
                tokens.push({
                    key,
                    value,
                    scopeLevel
                });
                if (upScope) {
                    scopeLevel++;
                }
                value = "";
            } else {
                tokens.push({
                    value: character,
                    scopeLevel
                });
            }
            if (character === "{") {
                scopeLevel++;
            }

        }
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
    max-width: 500px;
}

.json-tree .json-tree__tree .json-tree__key {
    color: #4E9590;
}

.json-tree .json-tree__tree .json-tree__bracket {
    color: #F2CAB8;
}
</style>