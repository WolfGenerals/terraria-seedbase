<template>
    <div
        class="relative inset-0 flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-gray-400 bg-gray-600/30 p-4 duration-500 hover:scale-105 hover:transform"
    >
        <!-- 进度条 -->
        <div
            class="absolute inset-0 z-10 transition-all duration-300"
            :class="barClassStyle.class"
            :style="barClassStyle.style"
        />
        <span class="z-20 text-lg font-bold">{{ title }}</span>
        <span
            v-if="showValue"
            class="z-20 mt-1 rounded px-2 py-1 text-xs text-white bg-gray-600/50"
        >
            {{ formatValue(value) }}
        </span>
        <span v-if="description" class="z-20 mt-1 text-xs text-gray-400">{{ description }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    title: string
    description?: string
    value: number
    min?: number
    max?: number
    side?: 'top' | 'bottom' | 'left' | 'right'
    startColor?: string
    endColor?: string
    showValue?: boolean
    formatValue?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
    description: '',
    min: 0,
    max: 1,
    side: 'left',
    startColor: '#0ea5e9', // 青色
    endColor: '#f97316', // 橙色
    showValue: true,
    formatValue: (value: number) => value.toFixed(2),
})

// 计算值在范围内的位置百分比
const ratio = computed(() => {
    const range = props.max - props.min
    if (range === 0) return 0.5
    return (props.value - props.min) / range
})

// 使用CSS mix()函数计算颜色
const computedColor = computed(() => {
    return `color-mix(in srgb, ${props.startColor} ${ratio.value * 100}%, ${props.endColor})`
})

const barClassStyle = computed(() => {
    const classes: string[] = []
    const styleObj: Record<string, string> = {}
    styleObj['backgroundColor'] = computedColor.value
    // if (['top', 'bottom'].includes(props.side)) {
    //     // classes.push("w-full")
    //     // classes.push(props.side === 'top' ? 'top-0' : 'bottom-0')
    //     styleObj['top'] = props.side === 'top' ? '0%' : `${100 - ratio.value * 100}%`
    //     styleObj['height'] = `${ratio.value * 100}%`
    // } else if (['left', 'right'].includes(props.side)) {
    //     // classes.push("h-full")
    //     // classes.push(props.side === 'left' ? 'left-0' : 'right-0')
    //     styleObj['left'] = props.side === 'left' ? '0%' : `${100 - ratio.value * 100}%`
    //     styleObj['width'] = `${ratio.value * 100}%`
    // }
    switch (props.side) {
        case 'top':
            styleObj['top'] = '0%'
            styleObj['height'] = `${ratio.value * 100}%`
            break
        case 'bottom':
            styleObj['top'] = `${(1-ratio.value) * 100}%`
            styleObj['height'] = `100%`
            break
        case 'left':
            styleObj['left'] = '0%'
            styleObj['width'] = `${ratio.value * 100}%`
            break
        case 'right':
            styleObj['left'] = `${(1-ratio.value) * 100}%`
            styleObj['width'] = `100%`
            break
    }
    return {
        class: classes,
        style: styleObj,
    }
})
</script>

<style scoped>
/* 确保CSS变量在组件内生效 */
:root {
    --start-color: #0ea5e9;
    --end-color: #f97316;
    --ratio: 0.5;
}
</style>
