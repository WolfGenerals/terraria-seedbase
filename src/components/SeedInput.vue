<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
    defineProps<{
        locked?: boolean
    }>(),
    {
        locked: false
    }
)

const seed = defineModel<number>()
const seedInput = ref(seed.value?.toString() ?? '0')

const seedTextIsNumber = computed(
    () =>
        /^-?\d+$/.test(seedInput.value) &&
        parseInt(seedInput.value) >= -(2 ** 31) &&
        parseInt(seedInput.value) <= 2 ** 31 - 1
)

const seedFromInput = computed(() => convertTextToSeed(seedInput.value.trim()))

// 监听外部传入的seed值变化
watch(seed, (newSeed) => {
    if (newSeed !== seedFromInput.value) {
        seedInput.value = newSeed?.toString() ?? '0'
    }
})

const convertTextToSeed = (seedText: string): number =>
    processSeedValue(seedTextIsNumber.value ? parseInt(seedText) | 0 : calculateCRC32(seedText))

const processSeedValue = (seed: number) => (seed === -(2 ** 31) ? 2 ** 31 - 1 : Math.abs(seed))

const calculateCRC32 = (input: string): number => {
    const polynomial = 0xedb88320
    let crc = 0xffffffff
    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i)
        crc ^= charCode
        for (let j = 0; j < 8; j++) {
            const mask = -(crc & 1)
            crc = (crc >>> 1) ^ (polynomial & mask)
        }
    }
    return (crc ^ 0xffffffff) | 0
}

// 点击非常规种子转换为标准种子
const convertToStandardSeed = () => {
    seedInput.value = seedFromInput.value.toString()
}
</script>

<template>
    <div class="seed-input-section">
        <label class="mb-2 block text-sm font-medium text-gray-300"> 世界种子 </label>
        <div class="relative">
            <input
                type="text"
                v-model="seedInput"
                @input="seed = seedFromInput"
                :disabled="props.locked"
                class="focus:border-gary-400 focus:gray-amber-400/20 w-full rounded-lg border-2 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 transition-all focus:ring-2 focus:outline-none"
                :class="
                    props.locked
                        ? 'cursor-not-allowed border-gray-600 opacity-60'
                        : 'border-gray-600 hover:border-gray-500'
                "
            />
            <div v-if="props.locked" class="absolute inset-0 rounded-lg bg-gray-900/50"></div>
        </div>
        <span
            v-if="!seedTextIsNumber"
            class="cursor-pointer align-baseline text-xs text-yellow-800"
            @click="convertToStandardSeed"
        >
            非常规种子，点击转化为标准种子
        </span>
        <p class="mt-1 text-xs text-gray-400" v-else>输入数字作为世界生成种子</p>
    </div>
</template>

<style scoped>
.seed-input-section {
    font-family: inherit;
}
</style>
