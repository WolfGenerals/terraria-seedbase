<script setup lang="ts">
import type { CachedTerrariaRandom } from '@/terraria/Random.ts'
import ConstraintCard from '@/components/ConstraintCard.vue'
import { Constraint } from '@/terraria/Constraints.ts'
import { computed } from 'vue'

interface Props {
    genRand: CachedTerrariaRandom
    constraints?: Map<number, Constraint>
    alwaysShowTopK?: number
}
const props = withDefaults(defineProps<Props>(), {
    constraints: () => new Map(),
    alwaysShowTopK: 10
})

const shows = computed(() => {
    const defaultShows = Array.from({ length: props.alwaysShowTopK }, (_, i) => i + 1)
    // 不重复，有序
    return [...new Set([...defaultShows, ...props.constraints.keys()])].sort((a, b) => a - b)
})
</script>

<template>
    <div class="random-numbers-panel min-w-80">
        <div class="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3">
            <constraint-card
                v-for="(randIndex, index) in shows"
                :key="index"
                :constraint="props.constraints.get(randIndex) ?? undefined"
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
