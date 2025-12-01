import type { CachedTerrariaRandom } from '@/terraria/Random.ts'
import {
    LARGE_WORLD_BASIC_INFO,
    MEDIUM_WORLD_BASIC_INFO,
    SMALL_WORLD_BASIC_INFO,
    type WorldBasicInfo
} from '@/terraria/World.ts'

const DAY_TIME = 24 * 60 * 60 /* 86400frame */

export class SimulatedWorldGeneration {
    public readonly world: WorldBasicInfo
    constructor(
        public readonly genRand: CachedTerrariaRandom,
        worldSize: 'small' | 'medium' | 'large',
        public readonly evilGenMethod: 'random' | 'corruption' | 'crimson'
    ) {
        switch (worldSize) {
            case 'small':
                this.world = SMALL_WORLD_BASIC_INFO
                break
            case 'medium':
                this.world = MEDIUM_WORLD_BASIC_INFO
                break
            case 'large':
                this.world = LARGE_WORLD_BASIC_INFO
                break
        }
    }

    public simulateAll() {
        this.simulateReset()
        this.simulateShimmer()
    }
    public resetInfo?: {
        evilLocation: 'left' | 'right' /*crimsonLeft*/
        slimeRainTime: number
        cloudBGActive: number
        cloudBGDirection: 'left' | 'right' /*cloudBGActive*/
        copper: 'copper' | 'tin'
        iron: 'iron' | 'lead'
        silver: 'silver' | 'tungsten'
        gold: 'gold' | 'platinum'
        evilType: 'corruption' | 'crimson'
        dungeonSide: 'left' | 'right'
    }
    public simulateReset() {
        const evilLocation = this.genRand.select(1, ['left', 'right'] as const)
        const slimeRainTime = -this.genRand.randInt(2, DAY_TIME * 2, DAY_TIME * 3)
        const cloudBGActive = this.genRand.randInt(3, DAY_TIME / 10, DAY_TIME)
        const cloudBGDirection = this.genRand.select(3, ['left', 'right'] as const)
        const copper = this.genRand.select(4, ['copper', 'tin'] as const)
        const iron = this.genRand.select(5, ['iron', 'lead'] as const)
        const silver = this.genRand.select(6, ['silver', 'tungsten'] as const)
        const gold = this.genRand.select(7, ['gold', 'platinum'] as const)
        const evilType =
            this.evilGenMethod === 'random'
                ? this.genRand.select(8, ['corruption', 'crimson'] as const)
                : this.evilGenMethod
        const dungeonSide = this.genRand.select(9, ['left', 'right'] as const)
        this.resetInfo = {
            evilLocation,
            slimeRainTime,
            cloudBGActive,
            cloudBGDirection,
            copper,
            iron,
            silver,
            gold,
            evilType,
            dungeonSide
        }
    }

    public shimmerInfo?: {
        x: number
        y: number
    }
    public simulateShimmer() {
        const maxTilesX = this.world.maxTilesX
        const maxTilesY = this.world.maxTilesY
        const worldSurface = this.world.worldSurface
        const rockLayer = this.world.rockLayer

        const minY = Math.floor((worldSurface + rockLayer) / 2 + 50)
        const maxY = Math.floor(Math.min(((maxTilesY - 250) * 2 + rockLayer) / 3, maxTilesY - 460))
        const minX = Math.floor(this.resetInfo!.dungeonSide === 'left' ? maxTilesX * 0.89 : 200)
        const maxX = Math.floor(
            this.resetInfo!.dungeonSide === 'left' ? maxTilesX - 200 : maxTilesX * 0.11
        )

        this.shimmerInfo = {
            y: this.genRand.randInt(1, minY, maxY),
            x: this.genRand.randInt(2, minX, maxX)
        }
    }

    // 以下信息来自视频【泄露天机！藏在泰拉瑞亚种子里的秘密：随机数】 https://www.bilibili.com/video/BV14zYkzaEUD，仅供参考
    public otherInfoFromVideo?: {
        mossType: 'argon' | 'xenon' | 'krypton' | 'neon'
        dungeonY: number
        dungeonColor: 'blue' | 'green' | 'pink'
        dungeonFirstChestRelativeY: number
        firstFloatIslandX: number
        firstFloatIslandContainFledglingWings: boolean
        oceanFloridaStyle: boolean
        oceanFloridaStyleSide: 'left' | 'right'
        oceanCaveOnDungeonSide: boolean
        evilHallowVeinType: 'evilLeft' | 'hallowLeft'
        guideName: string
        shrinesType:
            | 'iridescent_brick'
            | 'mudstone_brick'
            | 'rich_mahogany'
            | 'tin_brick'
            | 'gold_brick'
        baseCounts: {
            // 湖的数量
            lakes: number
            // 生命树的数量
            livingTrees: number
            // 蜂巢的数量
            hives: number
            // 丛林神龛的数量
            shrines: number
            // 花岗岩、大理石的数量
            granite: number
            marble: number
            // 沙丘的数量
            dunes: number
            // 地下小屋的数量
            undergroundCabins: number
            // 地下宝箱的数量
            undergroundChests: number
            // 暗影箱子的数量
            shadowChests: number
        }
    }
    public simulateFromVideo() {
        const maxTilesX = this.world.maxTilesX
        const worldSurface = this.world.worldSurface
        const rockLayer = this.world.rockLayer

        const mossType = this.genRand.select(1, ['argon', 'xenon', 'krypton', 'neon'] as const)
        const dungeonY = Math.floor(
            (worldSurface + rockLayer) / 2 + this.genRand.randInt(1, -200, 200)
        )
        const dungeonColor = this.genRand.select(2, ['blue', 'green', 'pink'] as const)
        const dungeonFirstChestRelativeY = this.genRand.random(1)
        const firstFloatIslandX = this.genRand.randInt(1, maxTilesX * 0.1, maxTilesX * 0.9)
        const firstFloatIslandContainFledglingWings = this.genRand.random(9) < 0.025
        const oceanFloridaStyle = this.genRand.random(1) < 0.25
        const oceanFloridaStyleSide = this.genRand.select(2, ['left', 'right'] as const)
        const oceanCaveOnDungeonSide = this.genRand.random(1) < 0.33
        const evilHallowVeinType = this.genRand.select(3, ['evilLeft', 'hallowLeft'] as const)
        const guideName = this.genRand.select(2, [
            'Joe',
            'Connor',
            'Tanner',
            'Wyatt',
            'Cody',
            'Levi',
            'Luke',
            'Jack',
            'Scott',
            'Logan',
            'Cole',
            'Asher',
            'Bradley',
            'Jacob',
            'Garrett',
            'Dylan',
            'Maxwell',
            'Steve',
            'Brett',
            'Andrew',
            'Harley',
            'Kyle',
            'Jake',
            'Ryan',
            'Jeffrey',
            'Seth',
            'Marty',
            'Brandon',
            'Zach',
            'Jeff',
            'Daniel',
            'Trent',
            'Kevin',
            'Brian',
            'Colin',
            'Jan'
        ] as const)
        const shrinesType = this.genRand.select(1, [
            'iridescent_brick',
            'mudstone_brick',
            'rich_mahogany',
            'tin_brick',
            'gold_brick'
        ] as const)
        const baseCounts = {
            lakes: this.genRand.randInt(
                this.world.baseCounts.lakes.randIndex,
                this.world.baseCounts.lakes.min,
                this.world.baseCounts.lakes.max + 1
            ),
            livingTrees: this.genRand.randInt(
                this.world.baseCounts.livingTrees.randIndex,
                this.world.baseCounts.livingTrees.min,
                this.world.baseCounts.livingTrees.max + 1
            ),
            hives: this.genRand.randInt(
                this.world.baseCounts.hives.randIndex,
                this.world.baseCounts.hives.min,
                this.world.baseCounts.hives.max + 1
            ),
            shrines: this.genRand.randInt(
                this.world.baseCounts.shrines.randIndex,
                this.world.baseCounts.shrines.min,
                this.world.baseCounts.shrines.max + 1
            ),
            granite: this.genRand.randInt(
                this.world.baseCounts.granite.randIndex,
                this.world.baseCounts.granite.min,
                this.world.baseCounts.granite.max + 1
            ),
            marble: this.genRand.randInt(
                this.world.baseCounts.marble.randIndex,
                this.world.baseCounts.marble.min,
                this.world.baseCounts.marble.max + 1
            ),
            dunes: this.genRand.randInt(
                this.world.baseCounts.dunes.randIndex,
                this.world.baseCounts.dunes.min,
                this.world.baseCounts.dunes.max + 1
            ),
            undergroundCabins: this.genRand.randInt(
                this.world.baseCounts.undergroundCabins.randIndex,
                this.world.baseCounts.undergroundCabins.min,
                this.world.baseCounts.undergroundCabins.max + 1
            ),
            undergroundChests: this.genRand.randInt(
                this.world.baseCounts.undergroundChests.randIndex,
                this.world.baseCounts.undergroundChests.min,
                this.world.baseCounts.undergroundChests.max + 1
            ),
            shadowChests: this.genRand.randInt(
                this.world.baseCounts.shadowChests.randIndex,
                this.world.baseCounts.shadowChests.min,
                this.world.baseCounts.shadowChests.max + 1
            )
        }
        if (baseCounts.livingTrees == 0 && this.genRand.random(2) < 0.5) baseCounts.livingTrees = 1

        this.otherInfoFromVideo = {
            mossType,
            dungeonY,
            dungeonColor,
            dungeonFirstChestRelativeY: dungeonFirstChestRelativeY,
            firstFloatIslandX,
            firstFloatIslandContainFledglingWings,
            oceanFloridaStyle,
            oceanFloridaStyleSide,
            oceanCaveOnDungeonSide,
            evilHallowVeinType,
            guideName,
            shrinesType,
            baseCounts
        }
    }
}
