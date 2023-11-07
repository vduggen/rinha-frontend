<template>
    <JSONTreeView
      :name-file="fileName"
      :content-file="fileContent"
      v-if="fileContent"
    />
    <HomeView v-else @setFile="setFile" />
</template>

<script setup>
import { ref } from 'vue';
import HomeView from './components/HomeView.vue';
import JSONTreeView from './components/JSONTreeView.vue';

const fileName = ref(null);
const fileContent = ref("");

const fileReader = new FileReader();

function onload() {
  fileContent.value = this.result
    .replaceAll('\n', '')
    .replaceAll('\r', '')
    .replaceAll(' ', '')
    .replaceAll('\t', '');
}

function setFile(newFile) {
  fileName.value = newFile.name;
  fileReader.onload = onload;
  fileReader.readAsText(newFile);
}
</script>

<style>
html,
body,
#app {
  font-family: 'Inter', sans-serif;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>