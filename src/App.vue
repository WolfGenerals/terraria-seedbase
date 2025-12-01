<script setup lang="ts">
import TrifoldMapIcon from '@/assets/Trifold_Map.png'
import ShareIcon from '@/assets/share-icon.svg'
import RandomNumbers from '@/panels/RandomNumbers.vue'
import WorldStatePanel from '@/panels/WorldStatePanel.vue'
import { CachedTerrariaRandom } from '@/terraria/Random.ts'
import WorldGenParams from '@/panels/WorldGenParams.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { Constraint } from '@/terraria/Constraints.ts'
import ConstraintInput from '@/panels/ConstraintInput.vue'
import SeedSearch from '@/panels/SeedSearch.vue'
import CollapsiblePanel from '@/components/CollapsiblePanel.vue'
import { asNumber, INT32_MAX } from '@/terraria/Int32.ts'
import { useToast } from 'vue-toastification'

const toast = useToast()

const seed = ref(asNumber(Math.random() * asNumber(INT32_MAX)))
const worldSize = ref<'small' | 'medium' | 'large'>('small')
const evilGenType = ref<'random' | 'corruption' | 'crimson'>('random')
const constraints = reactive<Map<number, Constraint>>(new Map())
const genRand = computed(() => CachedTerrariaRandom.fromSeed(seed.value))

onMounted(() => {
    seed.value = getSeedFromURL()
})

const getSeedFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const seedParam = urlParams.get('seed')
    return seedParam ? asNumber(parseInt(seedParam)) : seed.value
}

const getUrlWithSeed = (seed: number) => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('seed', seed.toString())
    return `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`
}
const setClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
}
</script>

<template>
    <!-- 深色主题容器 -->
    <div class="flex min-h-screen flex-col bg-blue-950 text-white">
        <!-- 顶部标题栏 -->
        <header class="border-b border-gray-700 bg-gray-800 shadow-lg">
            <div class="container mx-auto flex items-center justify-between px-4 py-3">
                <div class="flex items-center space-x-3">
                    <img :src="TrifoldMapIcon" alt="Terraria Icon" class="h-10 w-10" />
                    <h1 class="text-xl font-bold text-amber-400">Terraria Seedbase</h1>
                </div>
                <nav class="hidden md:block">
                    <ul class="flex space-x-6"></ul>
                </nav>
                <div class="flex items-center space-x-10">
                    <!-- 分享种子 -->
                    <div
                        class="flex items-center space-x-2 transition-transform duration-500 hover:scale-105"
                        @click="
                            () => {
                                setClipboard(getUrlWithSeed(seed))
                                toast.success(`已复制种子链接: ${seed}`)
                            }
                        "
                    >
                        <img :src="ShareIcon" alt="分享种子" class="h-6 w-6 cursor-pointer" />
                        <span class="text-6 cursor-pointer text-white">分享种子</span>
                    </div>
                    <!-- github 链接 -->
                    <a
                        href="https://github.com/WolfGenerals/terraria-seedbase"
                        target="_blank"
                        class="flex items-center space-x-2 transition-transform duration-500 hover:scale-105"
                    >
                        <!-- icon -->
                        <img
                            src="https://img.icons8.com/ios-filled/50/ffffff/github.png"
                            alt="github"
                            class="h-6 w-6"
                        />
                        <span class="text-6 text-white">Github</span>
                    </a>
                </div>
            </div>
        </header>

        <!-- 主内容区域 -->
        <main class="container mx-auto max-w-[95%] flex-grow px-4 py-6">
            <div class="grid grid-cols-3 gap-4">
                <!-- 第一列：种子生成与控制 -->
                <div class="space-y-6 rounded-lg bg-gray-800/75 p-6 shadow-md">
                    <collapsible-panel :title="`世界生成参数 (当前种子: ${seed})`" default-expanded>
                        <world-gen-params
                            v-model:seed="seed"
                            v-model:world-size="worldSize"
                            v-model:evil-type="evilGenType"
                        />
                    </collapsible-panel>

                    <collapsible-panel title="约束条件设置">
                        <constraint-input v-model="constraints" :gen-rand="genRand" />
                    </collapsible-panel>

                    <collapsible-panel title="种子搜索">
                        <seed-search
                            :constraints="constraints"
                            @set-seed="(_seed) => (seed = _seed)"
                            @on-best-seed-update="(_seed) => (seed = _seed)"
                        />
                    </collapsible-panel>
                </div>

                <!-- 第二列：世界状态信息 -->
                <div class="space-y-6 rounded-lg bg-gray-800/75 p-6 shadow-md">
                    <world-state-panel
                        :gen-rand="genRand"
                        :world-size="worldSize"
                        :evil-gen-type="evilGenType"
                    />
                </div>

                <!-- 第三列：随机数分析 -->
                <div class="space-y-6 rounded-lg bg-gray-800/75 p-6 shadow-md">
                    <span class="text-xl font-bold text-amber-400">随机数分析</span>
                    <random-numbers :gen-rand="genRand" :constraints="constraints" />
                </div>
            </div>
        </main>

        <!-- 底部信息栏 -->
        <footer class="border-t border-gray-700 bg-gray-800 py-4">
            <div class="container mx-auto px-4 text-center text-gray-400">
                <p>Terraria Seedbase - 用于探索泰拉瑞亚世界种子</p>
                <p class="mt-1 text-sm">非官方工具，与Re-Logic无关，仅用于社区交流</p>
            </div>
        </footer>
    </div>
</template>
