<template>
    <div
        class="collapsible-panel w-full rounded-lg border-2 border-gray-400 p-4 transition-all duration-300 overflow-hidden"
    >
        <!-- 标题区域 -->
        <div
            class="z-100 mb-1 flex cursor-pointer items-center justify-between text-lg font-semibold text-amber-400 transition-colors duration-200 hover:text-amber-600"
            @click="togglePanel"
        >
            <span>{{ title }}</span>
            <svg
                class="h-5 w-5 transition-transform duration-300"
                :class="{ 'rotate-180': isExpanded }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </div>

        <!-- 内容区域 -->
        <div
            class="transition-all duration-300"
            :class="{ 'max-h-0': !isExpanded, 'max-h-10000': isExpanded,'opacity-0': !isExpanded, 'opacity-100': isExpanded }"
        >
                <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    title: string
    defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    defaultExpanded: false,
})

const isExpanded = ref(props.defaultExpanded)

const togglePanel = () => {
    isExpanded.value = !isExpanded.value
}

// 提供方法供外部调用
const expand = () => {
    isExpanded.value = true
}

const collapse = () => {
    isExpanded.value = false
}

// 暴露方法给父组件
defineExpose({
    expand,
    collapse,
    togglePanel,
})
</script>

<style scoped>
.collapsible-panel {
    font-family: inherit;
}
</style>
