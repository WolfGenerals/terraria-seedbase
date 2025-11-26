<script setup lang="ts">
import ValueBar from '@/components/ValueBar.vue'
import type { CachedTerrariaRandom } from '@/terraria/Random.ts'
import ValueCard from '@/components/ValueCard.vue'

interface Props {
    genRand: CachedTerrariaRandom
    show?: number[]
}
const props = withDefaults(defineProps<Props>(), {
    show: () => Array.from({ length: 10 }, (_, index) => index + 1),
})
</script>

<template>
    <div class="random-numbers-panel min-w-80">
        <div class="mb-4 flex flex-wrap items-baseline gap-3">
            <h3 class="mb-4 text-lg font-bold text-amber-400">随机数序列</h3>
            <div class="mb-4 text-sm text-gray-400">种子: {{ genRand.seed }}</div>
        </div>

        <div class="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3">

                <value-card
                    v-for="(randIndex, index) in props.show"
                    :key="index"
                    :value="genRand.random(randIndex)"
                    :title="`第${randIndex}随机数`"
                    :format-value="(v) => v.toFixed(4)"
                />
        </div>
    </div>
</template>

<style scoped>
.random-numbers-panel {
    font-family: inherit;
}
</style>
