<script setup lang="ts">
import TrifoldMapIcon from './assets/Trifold_Map.png'
import RandomNumbers from '@/panels/RandomNumbers.vue'
import WorldStatePanel from '@/panels/WorldStatePanel.vue'
import { CachedTerrariaRandom } from '@/terraria/Random.ts'
import WorldGenParams from '@/panels/WorldGenParams.vue'
import { computed, ref } from 'vue'

const seed = ref(0)
const worldSize = ref<'small' | 'medium' | 'large'>('small')
const evilGenType = ref<'random' | 'corruption' | 'crimson'>('random')

const genRand = computed(() => CachedTerrariaRandom.fromSeed(seed.value))
</script>

<template>
    <!-- 深色主题容器 -->
    <div
        class="flex min-h-screen flex-col bg-radial-[at_25%_25%] from-blue-900 to-gray-950 text-white"
    >
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
            </div>
        </header>

        <!-- 主内容区域 -->
        <main class="container mx-auto flex-grow px-4 py-6">
            <div class="grid grid-cols-3 gap-6">
                <world-gen-params
                    v-model:seed="seed"
                    v-model:worldSize="worldSize"
                    v-model:evilType="evilGenType"
                />
                <world-state-panel :gen-rand="genRand" :world-size="worldSize" :evil-gen-type="evilGenType" />
                <random-numbers :gen-rand="genRand" />
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
