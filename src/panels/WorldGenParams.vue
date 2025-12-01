<script setup lang="ts">
import SeedInput from '../components/SeedInput.vue'
import OptionCard from '@/components/OptionCard.vue'

const props = withDefaults(defineProps<{ locked?: boolean }>(), {
    locked: false
})
const seed = defineModel<number>('seed', { default: 0 })
const worldSize = defineModel<'small' | 'medium' | 'large'>('worldSize', { default: 'small' })
const evilGenType = defineModel<'random' | 'corruption' | 'crimson'>('evilType', {
    default: 'random'
})
</script>

<template>
    <div class="world-gen-info-panel min-w-80">
        <!-- 种子输入区域 -->
        <seed-input v-model="seed" :locked="props.locked" class="mb-6" />

        <!-- 世界大小选择 -->
        <div class="world-size-section mb-6">
            <label class="mb-3 block text-sm font-medium text-gray-300">世界大小</label>
            <div class="grid grid-cols-3 gap-3">
                <option-card
                    text="小"
                    describe="4200x1200"
                    :active="worldSize === 'small'"
                    :disabled="props.locked"
                    @click="worldSize = 'small'"
                    active-style="border-amber-400 bg-amber-400/30"
                />
                <option-card
                    text="中"
                    describe="6400x1800"
                    :active="worldSize === 'medium'"
                    :disabled="props.locked"
                    @click="worldSize = 'medium'"
                    active-style="border-amber-400 bg-amber-400/30"
                />
                <option-card
                    text="大"
                    describe="8400x2400"
                    :active="worldSize === 'large'"
                    :disabled="props.locked"
                    @click="worldSize = 'large'"
                    active-style="border-amber-400 bg-amber-400/30"
                />
            </div>
        </div>

        <!-- 世界邪恶类型选择 -->
        <div class="evil-type-section">
            <label class="mb-3 block text-sm font-medium text-gray-300">世界邪恶类型</label>
            <div class="grid grid-cols-3 gap-3">
                <option-card
                    text="随机"
                    :active="evilGenType === 'random'"
                    :disabled="props.locked"
                    @click="evilGenType = 'random'"
                    active-style="border-gray-400 bg-gray-400/30"
                />
                <option-card
                    text="腐化"
                    :active="evilGenType === 'corruption'"
                    :disabled="props.locked"
                    @click="evilGenType = 'corruption'"
                    active-style="border-purple-400 bg-purple-400/30"
                    inactive-style="border-gray-600 bg-purple-600/30"
                />
                <option-card
                    text="猩红"
                    :active="evilGenType === 'crimson'"
                    :disabled="props.locked"
                    @click="evilGenType = 'crimson'"
                    active-style="border-red-400 bg-red-400/30"
                    inactive-style="border-gray-600 bg-red-600/30"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.world-gen-info-panel {
    font-family: inherit;
}
</style>
