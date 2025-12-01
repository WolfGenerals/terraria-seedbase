<template>
    <div
        class="relative inset-0 flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-gray-400 bg-gray-600/30 p-4 duration-500 hover:scale-105 hover:transform"
    >
        <!-- 进度条 -->
        <div
            class="absolute inset-0 z-10 transition-all duration-300"
            :style="barClassStyle.style"
        />
        <span class="z-20 text-lg font-bold">{{ title }}</span>
        <span
            v-if="showValue"
            class="z-20 mt-1 rounded bg-gray-600/50 px-2 py-1 text-xs text-white"
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
    formatValue: (value: number) => value.toFixed(2)
})
const getPosition = (value: number) => {
    const range = props.max - props.min
    if (range === 0) return 0
    return ((value - props.min) / range) * 100
}
// 计算值在范围内的位置百分比
computed(() => {
    const range = props.max - props.min
    if (range === 0) return 0.5
    return (props.value - props.min) / range
})
// 使用CSS mix()函数计算颜色
const valueColor = computed(() => {
    return `color-mix(in oklch, ${props.startColor} ${getPosition(props.value)}%, ${props.endColor})`
})

const barClassStyle = computed(() => {
    const styleObj: Record<string, string> = {}
    styleObj['backgroundColor'] = valueColor.value
    switch (props.side) {
        case 'top':
            styleObj['top'] = '0%'
            styleObj['height'] = `${getPosition(props.value)}%`
            break
        case 'bottom':
            styleObj['top'] = `${getPosition(1 - props.value)}%`
            styleObj['height'] = `${getPosition(props.value)}%`
            break
        case 'left':
            styleObj['left'] = '0%'
            styleObj['width'] = `${getPosition(props.value)}%`
            break
        case 'right':
            styleObj['left'] = `${getPosition(1 - props.value)}%`
            styleObj['width'] = `${getPosition(props.value)}%`
            break
    }
    return {
        style: styleObj
    }
})
</script>
