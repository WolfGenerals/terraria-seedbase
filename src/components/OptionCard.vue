<template>
    <button
        :disabled="disabled"
        class="flex flex-col items-center w-full justify-center rounded-lg border-2 p-4 transition-all duration-500"
        :class="computedClasses"
        @click="handleClick"
    >
        <span class="text-lg font-bold">{{ text }}</span>
        <span v-if="describe" class="text-xs text-gray-400">{{ describe }}</span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    text: string
    describe?: string
    active?: boolean
    disabled?: boolean
    activeStyle?: string
    inactiveStyle?: string
    disabledStyle?: string
    enabledStyle?: string
}

const props = withDefaults(defineProps<Props>(), {
    describe: '',
    active: true,
    disabled: false,
    activeStyle: 'border-gray-400 bg-gray-400/30',
    inactiveStyle: 'border-gray-600 bg-gray-600/30',
    disabledStyle: 'cursor-not-allowed opacity-60',
    enabledStyle: 'cursor-pointer hover:transform hover:scale-105',
})

const emit = defineEmits<{
    click: []
}>()

const computedClasses = computed(() => {
    let classes = ''
    classes += props.disabled ? props.disabledStyle : props.enabledStyle
    classes += ' '
    classes += props.active ? props.activeStyle : props.inactiveStyle
    return classes
})

const handleClick = () => {
    if (!props.disabled) {
        emit('click')
    }
}
</script>
