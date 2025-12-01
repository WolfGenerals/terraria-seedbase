<script setup lang="ts">
import CoordinatePoint from '@/components/CoordinatePoint.vue'
import type { CachedTerrariaRandom } from '@/terraria/Random.ts'
import { SimulatedWorldGeneration } from '@/terraria/SimulatedWorldGeneration.ts'
import { computed } from 'vue'
import OptionCard from '@/components/OptionCard.vue'
import CollapsiblePanel from '@/components/CollapsiblePanel.vue'
import ValueCard from '@/components/ValueCard.vue'

interface Props {
    genRand: CachedTerrariaRandom
    worldSize: 'small' | 'medium' | 'large'
    evilGenType: 'random' | 'corruption' | 'crimson'
}
const props = defineProps<Props>()

// 创建世界生成模拟器
const worldGen = computed(() => {
    const simulator = new SimulatedWorldGeneration(
        props.genRand,
        props.worldSize,
        props.evilGenType
    )
    simulator.simulateAll()
    simulator.simulateFromVideo()
    return simulator
})
const world = computed(() => worldGen.value.world)
// 格式化深度显示
const formatDepth = (value: number) => {
    const depth = world.value.yToDepth(value)
    return depth >= 0 ? `${depth}英尺以上` : `${Math.abs(depth)}英尺以下`
}

// 格式化位置显示
const formatPosition = (value: number) => {
    const position = world.value.xToPositionWithDirection(value)
    return `${position.value}英尺${position.direction === 'west' ? '西' : '东'}`
}
</script>

<template>
    <div style="font-family: inherit" class="flex flex-col gap-2">
        <collapsible-panel title="基本信息">
            <span class="m-2 text-sm text-gray-400">坐标均为估算，可能与实际位置有偏差。</span>
            <div class="m-2 grid grid-cols-2 gap-2">
                <option-card text="世界宽度" :describe="`${world.maxTilesX}格`" />
                <option-card text="世界高度" :describe="`${world.maxTilesY}格`" />
                <value-card
                    title="地表/地下分界线"
                    :value="world.worldSurface"
                    :min="0"
                    :max="world.maxTilesY"
                    side="top"
                    :format-value="(value) => `${value}格/${formatDepth(value)}`"
                />
                <value-card
                    title="地下/洞穴分界线"
                    :value="world.rockLayer"
                    :min="0"
                    :max="world.maxTilesY"
                    side="top"
                    :format-value="(value) => `${value}格/${formatDepth(value)}`"
                />
            </div>
        </collapsible-panel>
        <collapsible-panel title="步骤'Reset'" default-expanded>
            <div class="m-2 grid grid-cols-2 gap-2">
                <option-card
                    :text="{ corruption: '腐化', crimson: '猩红' }[worldGen.resetInfo!.evilType]"
                    describe="邪恶类型"
                />
                <option-card
                    :text="{ left: '左侧', right: '右侧' }[worldGen.resetInfo!.evilLocation]"
                    describe="邪恶位置"
                />
            </div>
            <div class="m-2 grid grid-cols-2 gap-2">
                <option-card
                    :text="
                        { left: '向左飘', right: '向右飘' }[worldGen.resetInfo!.cloudBGDirection]
                    "
                    describe="初始云层运动方向"
                />
                <option-card
                    :text="
                        { left: '地牢↞|↠丛林', right: '丛林↞|↠地牢' }[
                            worldGen.resetInfo!.dungeonSide
                        ]
                    "
                    describe="地牢/丛林方位"
                />
            </div>
            <div class="m-2 grid grid-cols-4 gap-2">
                <option-card
                    :text="{ copper: '铜', tin: '锡' }[worldGen.resetInfo!.copper]"
                    describe="铜/锡矿"
                />
                <option-card
                    :text="{ iron: '铁', lead: '铅' }[worldGen.resetInfo!.iron]"
                    describe="铁/铅矿"
                />
                <option-card
                    :text="{ silver: '银', tungsten: '钨' }[worldGen.resetInfo!.silver]"
                    describe="银/钨矿"
                />
                <option-card
                    :text="{ gold: '金', platinum: '铂金' }[worldGen.resetInfo!.gold]"
                    describe="金/铂金矿"
                />
            </div>
        </collapsible-panel>
        <collapsible-panel title="步骤'Shimmer'" default-expanded>
            <div class="m-2 grid grid-cols-2 gap-2">
                <value-card
                    title="位置"
                    :value="worldGen.shimmerInfo!.x"
                    :min="0"
                    :max="worldGen.world.maxTilesX"
                    :format-value="formatPosition"
                    side="left"
                />
                <value-card
                    title="高度"
                    :value="worldGen.shimmerInfo!.y"
                    :min="0"
                    :max="worldGen.world.maxTilesY"
                    :format-value="formatDepth"
                    side="top"
                />
            </div>
            <coordinate-point
                class="m-2"
                :x-min="41"
                :x-max="worldGen.world.maxTilesX - 42"
                :y-min="41"
                :y-max="worldGen.world.maxTilesY - 42"
                :points="[{ x: worldGen.shimmerInfo!.x, y: worldGen.shimmerInfo!.y }]"
                title="微光位置"
                color="#00ffff"
                :show-detail="true"
                :show-labels="true"
            />
        </collapsible-panel>
        <collapsible-panel title="其他世界信息">
            <div class="m-2 grid grid-cols-4 gap-2">
                <!-- otherInfoFromVideo -->
                <option-card
                    :text="
                        { argon: '氩苔藓', xenon: '氙苔藓', krypton: '氪苔藓', neon: '氖苔藓' }[
                            worldGen.otherInfoFromVideo!.mossType
                        ]
                    "
                    describe="苔藓类型"
                />
                <option-card
                    :text="
                        { blue: '蓝砖', green: '绿砖', pink: '粉砖' }[
                            worldGen.otherInfoFromVideo!.dungeonColor
                        ]
                    "
                    describe="地牢颜色"
                />
                <option-card
                    :text="
                        {
                            iridescent_brick: '荧光砖',
                            mudstone_brick: '泥石砖',
                            rich_mahogany: '红木',
                            tin_brick: '锡砖',
                            gold_brick: '金砖'
                        }[worldGen.otherInfoFromVideo!.shrinesType]
                    "
                    describe="神龛类型"
                />
                <option-card :text="worldGen.otherInfoFromVideo!.guideName" describe="向导名称" />
            </div>
            <div class="m-2 grid grid-cols-2 gap-2">
                <value-card
                    title="地牢高度"
                    :value="worldGen.otherInfoFromVideo!.dungeonY"
                    :min="0"
                    :max="worldGen.world.maxTilesY"
                    :format-value="formatDepth"
                    side="top"
                />
                <value-card
                    title="第一个宝箱相对高度"
                    :value="worldGen.otherInfoFromVideo!.dungeonFirstChestRelativeY"
                    side="top"
                />
            </div>
            <div class="m-2 grid grid-cols-2 gap-2">
                <value-card
                    title="第一个浮空岛X坐标"
                    :value="worldGen.otherInfoFromVideo!.firstFloatIslandX"
                    :min="0"
                    :max="worldGen.world.maxTilesX"
                    :format-value="formatPosition"
                    side="left"
                />
                <option-card
                    :text="
                        worldGen.otherInfoFromVideo!.firstFloatIslandContainFledglingWings
                            ? '有雏翼'
                            : '无雏翼'
                    "
                    describe="第一个浮空岛是否包含雏翼"
                />
            </div>
            <div class="m-2 grid grid-cols-3 gap-2">
                <option-card
                    :text="worldGen.otherInfoFromVideo!.oceanFloridaStyle ? '有' : '无'"
                    describe="佛罗里达风格海洋"
                />
                <option-card
                    :text="
                        worldGen.otherInfoFromVideo!.oceanFloridaStyle
                            ? { left: '左侧', right: '右侧' }[
                                  worldGen.otherInfoFromVideo!.oceanFloridaStyleSide
                              ]
                            : '无'
                    "
                    describe="佛罗里达风格海洋位置"
                />
                <option-card
                    :text="
                        !worldGen.otherInfoFromVideo!.oceanCaveOnDungeonSide
                            ? '无'
                            : worldGen.resetInfo!.dungeonSide === 'left'
                              ? '左侧海洋'
                              : '右侧海洋'
                    "
                    describe="地牢侧海洋洞穴"
                />
            </div>
            <div class="m-2 grid grid-cols-1 gap-2">
                <option-card
                    :text="
                        worldGen.otherInfoFromVideo!.evilHallowVeinType === 'evilLeft'
                            ? '邪恶↞|↠神圣'
                            : '神圣↞|↠邪恶'
                    "
                    describe="邪恶/神圣V型条带类型"
                />
            </div>
            <div class="m-2 grid grid-cols-2 gap-2">
                <value-card
                    title="湖泊数量"
                    :value="worldGen.otherInfoFromVideo!.baseCounts.lakes"
                    :min="world.baseCounts.lakes.min"
                    :max="world.baseCounts.lakes.max"
                />
                <value-card
                    title="生命树数量"
                    :value="worldGen.otherInfoFromVideo!.baseCounts.livingTrees"
                    :min="world.baseCounts.livingTrees.min"
                    :max="world.baseCounts.livingTrees.max"
                />
                <value-card
                    title="蜂巢数量"
                    :value="worldGen.otherInfoFromVideo!.baseCounts.hives"
                    :min="world.baseCounts.hives.min"
                    :max="world.baseCounts.hives.max"
                />
                <value-card
                    title="丛林神龛数量"
                    :value="worldGen.otherInfoFromVideo!.baseCounts.shrines"
                    :min="world.baseCounts.shrines.min"
                    :max="world.baseCounts.shrines.max"
                />
                <value-card
                    title="花岗岩数量"
                    :value="worldGen.otherInfoFromVideo!.baseCounts.granite"
                    :min="world.baseCounts.granite.min"
                    :max="world.baseCounts.granite.max"
                />
                <value-card
                    title="大理石数量"
                    :value="worldGen.otherInfoFromVideo!.baseCounts.marble"
                    :min="world.baseCounts.marble.min"
                    :max="world.baseCounts.marble.max"
                />
                <value-card
                    title="沙丘数量"
                    :value="worldGen.otherInfoFromVideo!.baseCounts.dunes"
                    :min="world.baseCounts.dunes.min"
                    :max="world.baseCounts.dunes.max"
                />
                <value-card
                    title="地下小屋数量"
                    :value="worldGen.otherInfoFromVideo!.baseCounts.undergroundCabins"
                    :min="world.baseCounts.undergroundCabins.min"
                    :max="world.baseCounts.undergroundCabins.max"
                />
                <value-card
                    title="地下宝箱数量"
                    :value="worldGen.otherInfoFromVideo!.baseCounts.undergroundChests"
                    :min="world.baseCounts.undergroundChests.min"
                    :max="world.baseCounts.undergroundChests.max"
                />
                <value-card
                    title="暗影箱子数量"
                    :value="worldGen.otherInfoFromVideo!.baseCounts.shadowChests"
                    :min="world.baseCounts.shadowChests.min"
                    :max="world.baseCounts.shadowChests.max"
                />
            </div>
        </collapsible-panel>
    </div>
</template>

<style scoped></style>
