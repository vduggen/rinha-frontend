<template>
    <div class="home">
        <h1 class="home__title">JSON Tree Viewer</h1>
        <h4 class="home__subtitle">Simple JSON Viewer that runs completely on-client. No data exchange </h4>
        <button>Load JSON</button>
        <input @change="upload" type="file" accept="json">
    </div>
</template>

<script setup>
const emit = defineEmits(['setFile']);

function upload(event) {
    const file = event.target.files[0];
    emit('setFile', file);
}
</script>

<style scoped>
.home {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.home .home__title {
    margin: 0;
    font-size: 48px;
    font-weight: 700;
}

.home .home__subtitle {
    margin: 24px 0;
    font-weight: 400;
    font-size: 24px;
}
</style>