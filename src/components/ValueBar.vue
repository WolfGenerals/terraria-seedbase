<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    min?: number
    max?: number
    value?: number
    rangeStart?: number
    rangeEnd?: number
    startColor?: string
    endColor?: string
    height?: number //rem
    showDetail?: boolean
    showLabels?: boolean
    title?: string
    formatValue?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 1,
    startColor: '#0ea5e9', // 青色
    endColor: '#f97316', // 橙色
    showDetail: true,
    showLabels: false,
    height: 1,
    formatValue: (value: number) => value.toFixed(2),
})

// 计算值在范围内的位置百分比
const getPosition = (value: number) => {
    const range = props.max - props.min
    if (range === 0) return 0
    return ((value - props.min) / range) * 100
}
const getColor = (value: number, bright: number = 1) => {
    // 计算值在范围内的位置百分比
    const position = getPosition(value)
    // 分解颜色
    const startR = parseInt(props.startColor!.substring(1, 3), 16)
    const startG = parseInt(props.startColor!.substring(3, 5), 16)
    const startB = parseInt(props.startColor!.substring(5, 7), 16)
    const endR = parseInt(props.endColor!.substring(1, 3), 16)
    const endG = parseInt(props.endColor!.substring(3, 5), 16)
    const endB = parseInt(props.endColor!.substring(5, 7), 16)
    // 插值颜色
    let r = Math.round(startR + ((endR - startR) * position) / 100)
    let g = Math.round(startG + ((endG - startG) * position) / 100)
    let b = Math.round(startB + ((endB - startB) * position) / 100)
    // 调整亮度
    r = Math.round(Math.min(Math.max(r * bright, 0), 255))
    g = Math.round(Math.min(Math.max(g * bright, 0), 255))
    b = Math.round(Math.min(Math.max(b * bright, 0), 255))
    return `rgb(${r}, ${g}, ${b})`
}
const isValue = computed(() => props.value !== undefined)
const isRange = computed(() => props.rangeStart !== undefined && props.rangeEnd !== undefined)
const isValid = computed(
    () =>
        (props.value !== undefined &&
            props.rangeStart === undefined &&
            props.rangeEnd === undefined) ||
        (props.value === undefined &&
            props.rangeStart !== undefined &&
            props.rangeEnd !== undefined &&
            props.rangeStart <= props.rangeEnd),
)
</script>

<template>

    <div class="value-bar min-w-50 space-y-1" v-if="isValid">
        <!-- 标题 -->
        <div class="mb-2 flex items-center justify-between" v-if="props.title">
            <span class="mb-2 text-lg font-bold">{{ props.title }}</span>
            <span
                v-if="isValue && showDetail"
                class="rounded px-2 py-1 text-xs text-white"
                :style="{ backgroundColor: getColor(props.value!) }"
            >
                {{ formatValue(props.value!) }}</span
            >
            <span
                v-if="isRange && showDetail"
                class="rounded bg-gradient-to-r from-[var(--leftColor)] to-[var(--rightColor)] px-2 py-1 text-xs text-white"
                :style="{
                    '--leftColor': getColor(props.rangeStart!),
                    '--rightColor': getColor(props.rangeEnd!),
                }"
                >[{{ formatValue(props.rangeStart!) }} - {{ formatValue(props.rangeEnd!) }}]</span
            >
        </div>

        <!-- 进度条容器 -->
        <div
            class="relative overflow-hidden rounded bg-gray-700"
            :style="{ height: `${props.height}rem` }"
        >
            <!-- 背景 -->
            <div class="absolute inset-0 bg-gray-600" />

            <!-- 高亮范围  -->
            <div
                class="absolute inset-0 bg-gradient-to-r from-[var(--startColor)] to-[var(--endColor)] outline-2 outline-black transition-all duration-300"
                v-if="isRange"
                :style="{
                    left: `${getPosition(props.rangeStart!)}%`,
                    width: `${getPosition(props.rangeEnd!) - getPosition(props.rangeStart!)}%`,
                    '--startColor': getColor(props.rangeStart!),
                    '--endColor': getColor(props.rangeEnd!),
                }"
            />
            <!-- 显示值-->
            <div
                class="absolute inset-0 transition-all duration-300"
                v-if="isValue"
                :style="{
                    left: `0%`,
                    width: `${getPosition(props.value!)}%`,
                    backgroundColor: getColor(props.value!),
                }"
            />
        </div>
        <div
            v-if="props.showLabels"
            class="mb-1 flex justify-between text-xs font-bold text-gray-200"
        >
            <span>{{ formatValue(props.min) }}</span>
            <span
                v-if="isValue && showDetail && !title"
                class="rounded px-2 py-1 text-xs text-white"
                :style="{ backgroundColor: getColor(props.value!) }"
            >
                {{ formatValue(props.value!) }}</span
            >
            <span
                v-if="isRange && showDetail && !title"
                class="rounded bg-gradient-to-r from-[var(--leftColor)] to-[var(--rightColor)] px-2 py-1 text-xs text-white"
                :style="{
                    '--leftColor': getColor(props.rangeStart!),
                    '--rightColor': getColor(props.rangeEnd!),
                }"
                >[{{ formatValue(props.rangeStart!) }} - {{ formatValue(props.rangeEnd!) }}]</span
            >
            <span>{{ formatValue(props.max) }}</span>
        </div>
    </div>
    <div class="rounded-md bg-red-100 p-2 text-red-500" v-else>输入值范围错误</div>

</template>

<style scoped>
.value-bar {
    font-family: inherit;
}
</style>
