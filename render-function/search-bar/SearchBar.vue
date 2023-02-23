<template>
    <div id="searchBarWrapper" ref="searchBarWrapper" class="search-bar">
        <div class="input-box">
            <input ref="inputRef" v-model="inputValue" type="text" placeholder="全局搜索框">
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted, ref, nextTick } from "vue";
import { openSearchBar, closeSearchBar } from "./useSearch";

const inputRef = ref(null);
const inputValue = ref("");

const cleanSearchKeyword = () => inputValue.value = ""

// 监听 ctrl+k 按键
onMounted(() => {
    window.addEventListener("keydown", (e) => {
        if (e.metaKey && e.key === "k") {
            openSearchBar();
        }
    })
})

// 搜索框自动获取焦点
nextTick(() => {
    cleanSearchKeyword();
    inputRef.value?.focus();
})
</script>

<style scoped>
.search-bar {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 120px;
    left: calc(50% - 310px);
    z-index: 999;
    width: 720px;
    cursor: pointer;
    background-color: #2d97b8;
}

@keyframes searchInput {
    form {
        transform: translateY(50px);
    }
    to {
        transform: translateY(0);
    }
}

.searchInput {
    animation: searchInput 1s;
}
</style>