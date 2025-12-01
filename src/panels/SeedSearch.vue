<script setup lang="ts">
import { Constraint } from '@/terraria/Constraints.ts'
import { reactive, ref } from 'vue'
import { CachedTerrariaRandom } from '@/terraria/Random.ts'
import OptionCard from '@/components/OptionCard.vue'

const emit = defineEmits<{
    (e: 'on-seed-change', seed: number): void
    (e: 'on-best-seed-update', seed: number): void
    (e: 'set-seed', seed: number): void
}>()
interface Props {
    constraints?: Map<number, Constraint>
    topK?: number
}
const props = withDefaults(defineProps<Props>(), {
    constraints: () => new Map(),
    topK: 10
})

const searchedSeeds = reactive<{ seed: number; diff: number }[]>([])
const searchedCount = ref(0)
const searchRunning = ref(false)

// 0到2^31-1的随机数
const getRandomSeed = () => Math.floor(Math.random() * 2 ** 31)

const testSeed = (seed: number) => {
    emit('on-seed-change', seed)
    const genRand = CachedTerrariaRandom.fromSeed(seed)
    if (!Constraint.allSatisfied(genRand, props.constraints)) return
    const diff = Constraint.averageDiffs(genRand, props.constraints)
    const bestSeed = searchedSeeds[0]?.seed
    // searchedSeeds.push({ seed, diff })
    // 在前面插入
    searchedSeeds.unshift({ seed, diff })
    searchedSeeds.sort((a, b) => a.diff - b.diff)
    if (searchedSeeds.length > props.topK) {
        searchedSeeds.pop()
    }
    if (bestSeed !== searchedSeeds[0]!.seed) {
        emit('on-best-seed-update', searchedSeeds[0]!.seed)
    }
}
const startSearch = () => {
    searchRunning.value = true
    const stepsPerFrame = 1000 // 每帧执行1000次
    const loop = () => {
        if (!searchRunning.value) return
        for (let i = 0; i < stepsPerFrame; i++) {
            const seed = getRandomSeed()
            testSeed(seed)
            searchedCount.value++
        }
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
}
</script>

<template>
    <div class="seed-search flex flex-col justify-center gap-4">
        <div class="grid grid-cols-2 gap-4">
            <option-card
                :text="`${searchRunning ? '停止' : '开始'}搜索`"
                @click="
                    () => {
                        searchRunning = !searchRunning
                        if (searchRunning) startSearch()
                    }
                "
                :active="searchRunning"
                :describe="`已经搜索${searchedCount}个种子`"
                active-style="border-amber-400 bg-amber-400/30"
                inactive-style="border-gray-400 bg-gray-400/30"
            />
            <option-card
                :text="`重置搜索`"
                @click="
                    () => {
                        searchedSeeds.length = 0
                        searchedCount = 0
                        if (searchRunning) searchRunning = false
                    }
                "
                :active="searchedSeeds.length > 0 || searchedCount > 0"
                :describe="`重置搜索记录`"
            />
        </div>
        <!-- 搜索结果列表 -->
        <div class="grid grid-cols-1 gap-2">
            <option-card
                v-for="({ seed, diff }, index) in searchedSeeds"
                :key="index"
                :text="`种子；${seed}`"
                :describe="`差异；${diff.toFixed(2)}`"
                @click="emit('set-seed', seed)"
            />
        </div>
    </div>
</template>

<style scoped></style>
