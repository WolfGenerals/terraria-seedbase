<script setup lang="ts">
interface Point {
    x: number
    y: number
    icon?: string // 图标URL或路径
    color?: string // 点的颜色
    label?: string // 点的标签
}

interface Props {
    xMin?: number
    xMax?: number
    yMin?: number
    yMax?: number
    points: Point[] // 多点显示
    width?: number // rem
    showLegend?: boolean
    color?: string // 点的颜色
    title?: string
    formatX?: (value: number) => string
    formatY?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
    xMin: 0,
    xMax: 1,
    yMin: 0,
    yMax: 1,
    showLegend: false,
    color: 'red',
    formatX: (value: number) => value.toFixed(2),
    formatY: (value: number) => value.toFixed(2),
})

// 计算值在范围内的位置百分比
const getXPosition = (value: number) => {
    const range = props.xMax - props.xMin
    if (range === 0) return 0
    return ((value - props.xMin) / range) * 100
}

const getYPosition = (value: number) => {
    const range = props.yMax - props.yMin
    if (range === 0) return 0
    return ((value - props.yMin) / range) * 100
}

// 计算点的位置样式
const getPointStyle = (point: Point) => {
    const style: Record<string, string> = {
        left: `${getXPosition(point.x)}%`,
        top: `${getYPosition(point.y)}%`,
        width: `1rem`,
        height: `1rem`,
    }

    // 如果有图标，设置背景图片
    if (point.icon) {
        style.backgroundImage = `url(${point.icon})`
        style.backgroundSize = 'contain'
        style.backgroundRepeat = 'no-repeat'
        style.backgroundPosition = 'center'
    } else if (point.color) {
        style.backgroundColor = point.color
    } else {
        style.backgroundColor = props.color
    }

    return style
}

// 获取点的类名
const getPointClass = (point: Point) => {
    const classes = [
        'absolute',
        'transition-all',
        'duration-300',
        'shadow-lg',
        'top-[50%]',
        'left-[50%]',
        'transform',
        'translate-x-[-50%]',
        'translate-y-[-50%]',
    ]

    // 如果有图标，使用方形；否则使用圆形
    if (point.icon) {
        classes.push('rounded')
    } else {
        classes.push('rounded-full')
    }

    return classes.join(' ')
}
</script>

<template>
    <div class="coordinate-point min-w-50 space-y-2 w-full">
        <!-- 标题 -->
        <div class="mb-2 flex items-center justify-between" v-if="props.title">
            <span class="text-lg font-bold">{{ props.title }}</span>
        </div>

        <!-- 坐标平面容器 -->
        <div
            class="relative overflow-hidden rounded border-2 border-gray-600 bg-gray-800"
            :style="{
                width: props.width ? `${props.width}rem` : 'w-full',
                aspectRatio: `${props.xMax - props.xMin}/${props.yMax - props.yMin}`,
            }"
        >
            <!-- 网格背景 -->
            <div class="bg-grid-pattern absolute inset-0 opacity-20"></div>

            <!-- 坐标轴 -->
            <!--            <div class="absolute left-0 top-1/2 w-full h-px bg-gray-500"></div>-->
            <!--            <div class="absolute left-1/2 top-0 h-full w-px bg-gray-500"></div>-->

            <!-- 多点显示 -->
            <div
                v-for="(point, index) in props.points"
                :key="index"
                :class="getPointClass(point)"
                :style="getPointStyle(point)"
                :title="point.label || `(${formatX(point.x)}, ${formatY(point.y)})`"
            />
        </div>
    </div>
</template>

<style scoped>
.coordinate-point {
    font-family: inherit;
}

.bg-grid-pattern {
    background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
}
</style>
