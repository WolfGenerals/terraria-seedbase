<template>
    <div
        class="relative flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-gray-400 bg-gray-600/30 p-4 duration-500 hover:scale-105 hover:transform"
    >
        <!-- 当前值指示器 -->
        <div
            v-if="value"
            class="absolute inset-0 z-0 transition-all duration-300"
            :style="valueStyle"
        />
        <!-- 约束范围背景 -->
        <div
            v-if="constraint"
            class="bg-slash-pattern absolute inset-0 z-10 opacity-20 transition-all duration-300"
            :style="constraintRangeStyle"
        />

        <!-- 目标值指示线 -->
        <div
            v-if="!value && constraint && constraint.target !== undefined"
            class="absolute top-0 bottom-0 z-20 w-0.5 bg-white/80 transition-all duration-300"
            :style="{ left: `${getPosition(constraint.target)}%` }"
        />

        <!-- 标题和值显示 -->
        <span class="z-40 text-lg font-bold text-white">{{ title }}</span>
        <div class="z-40 mt-1 rounded bg-gray-600/50 px-2 py-1 text-xs text-white">
            {{ displayText }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Constraint } from '@/terraria/Constraints.ts'

interface Props {
    title: string
    constraint?: Constraint
    value?: number
    min?: number
    max?: number
    startColor?: string
    endColor?: string
    formatValue?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 1,
    startColor: '#0ea5e9',
    endColor: '#f97316',
    formatValue: (value: number) => value.toFixed(2)
})

// 计算值在范围内的位置百分比
const getPosition = (value: number) => {
    const range = props.max - props.min
    if (range === 0) return 0
    return ((value - props.min) / range) * 100
}

// 使用CSS mix()函数计算颜色
const valueColor = computed(() => {
    return `color-mix(in oklch, ${props.startColor} ${getPosition(props.value || props.min)}%, ${props.endColor})`
})

// 当前值显示样式
const valueStyle = computed(() => {
    if (!props.value) return {}
    if (!props.constraint || !props.constraint.target)
        return {
            backgroundColor: valueColor.value,
            left: `0%`,
            width: `${getPosition(props.value)}%`
        }
    if (props.value < props.constraint.target)
        return {
            backgroundColor: valueColor.value,
            left: `${getPosition(props.value)}%`,
            width: `${getPosition(props.constraint.target) - getPosition(props.value)}%`
        }
    return {
        backgroundColor: valueColor.value,
        left: `${getPosition(props.constraint.target)}%`,
        width: `${getPosition(props.value) - getPosition(props.constraint.target)}%`
    }
})
const constraintRangeStyle = computed(() => {
    if (!props.constraint) return {}
    return {
        left: `${getPosition(props.constraint.min)}%`,
        width: `${getPosition(props.constraint.max) - getPosition(props.constraint.min)}%`
    }
})
const displayText = computed(() => {
    const { value, constraint, formatValue } = props

    if (value === undefined) {
        if (constraint && constraint.target !== undefined) {
            return `[${formatValue(constraint.min)}↔${formatValue(constraint.max)}]|${formatValue(constraint.target)}`
        }
        if (constraint) {
            return `[${formatValue(constraint.min)}↔${formatValue(constraint.max)}]`
        }
        return ''
    }

    if (constraint === undefined) {
        return formatValue(value)
    }

    if (constraint.target === undefined) {
        if (constraint.contains(value))
            return `[${formatValue(constraint.min)}↔${formatValue(constraint.max)}] ●${formatValue(value)}`
        if (value < constraint.min)
            return `[${formatValue(constraint.min)}↔${formatValue(constraint.max)}] ▼${formatValue(value)}`
        if (value >= constraint.max)
            return `[${formatValue(constraint.min)}↔${formatValue(constraint.max)}] ▲${formatValue(value)}`
    } else {
        // const diff = Math.abs(value - constraint.target)
        const sign = constraint.target < value ? '▲' : '▼'

        return `[${formatValue(constraint.min)}↔${formatValue(constraint.max)}]|${formatValue(constraint.target)} ${sign}${formatValue(value)}`
    }

    return ''
})
</script>

<style scoped>
.bg-slash-pattern {
    background-image: linear-gradient(
        45deg,
        white 25%,
        black 25%,
        black 50%,
        white 50%,
        white 75%,
        black 75%
    );
    background-size: 10px 10px;
}
</style>
