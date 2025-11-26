interface FeatureCount {
    max: number
    min: number
    randIndex: number
}

export class WorldBasicInfo {
    constructor(
        public maxTilesX: number,
        public maxTilesY: number,
        public baseCounts: {
            // 湖的数量
            lakes: FeatureCount
            // 生命树的数量
            livingTrees: FeatureCount
            // 蜂巢的数量
            hives: FeatureCount
            // 丛林神龛的数量
            shrines: FeatureCount
            // 花岗岩、大理石的数量
            granite: FeatureCount
            marble: FeatureCount
            // 沙丘的数量
            dunes: FeatureCount
            // 地下小屋的数量
            undergroundCabins: FeatureCount
            // 地下宝箱的数量
            undergroundChests: FeatureCount
            // 暗影箱子的数量
            shadowChests: FeatureCount
        },
    ) {}
    get height(): number {
        return this.maxTilesY
    }
    get width(): number {
        return this.maxTilesX
    }
    get area(): number {
        return this.width * this.height
    }

    get worldSurface(): number {
        return Math.round(this.maxTilesY * 0.25)+25
    }
    get rockLayer(): number {
        return Math.round(this.worldSurface + this.maxTilesY * 0.1)
    }

    xToPosition(x:number): number {
        return Math.round((x-this.maxTilesX/2)*2)
    }
    yToDepth(y:number): number {
        return Math.round((this.worldSurface-y)*2)
    }
    xToPositionWithDirection(x:number):{value:number,direction:'west'|'east'} {
        return {
            value: Math.abs(this.xToPosition(x)),
            direction: x < this.maxTilesX / 2 ? 'west' : 'east',
        }
    }
    yToPositionWithDirection(y:number):{value:number,direction:'up'|'down'} {
        return {
            value: Math.abs(this.yToDepth(y)),
            direction: y < this.worldSurface ? 'up' : 'down',
        }
    }
}

export const SMALL_WORLD_BASIC_INFO = new WorldBasicInfo(4200, 1200, {
    lakes: { min: 3, max: 5, randIndex: 1 },
    livingTrees: { min: 0, max: 2, randIndex: 1 },
    hives: { min: 6, max: 8, randIndex: 1 },
    shrines: { min: 7, max: 12, randIndex: 3 },
    granite: { min: 4, max: 8, randIndex: 1 },
    marble: { min: 4, max: 8, randIndex: 1 },
    dunes: { min: 1, max: 2, randIndex: 1 },
    undergroundCabins: { min: 35, max: 40, randIndex: 1 },
    shadowChests: { min: 10, max: 15, randIndex: 2 },
    undergroundChests: { min: 35, max: 40, randIndex: 3 },
})
export const MEDIUM_WORLD_BASIC_INFO = new WorldBasicInfo(6400, 1800, {
    lakes: { min: 4, max: 8, randIndex: 1 },
    livingTrees: { min: 0, max: 3, randIndex: 1 },
    hives: { min: 8, max: 12, randIndex: 1 },
    shrines: { min: 10, max: 18, randIndex: 3 },
    granite: { min: 6, max: 12, randIndex: 1 },
    marble: { min: 9, max: 18, randIndex: 1 },
    dunes: { min: 1, max: 3, randIndex: 1 },
    undergroundCabins: { min: 80, max: 92, randIndex: 1 },
    shadowChests: { min: 15, max: 22, randIndex: 2 },
    undergroundChests: { min: 80, max: 92, randIndex: 3 },
})
export const LARGE_WORLD_BASIC_INFO = new WorldBasicInfo(8400, 2400, {
    lakes: { min: 6, max: 11, randIndex: 1 },
    livingTrees: { min: 0, max: 4, randIndex: 1 },
    hives: { min: 11, max: 16, randIndex: 1 },
    shrines: { min: 14, max: 24, randIndex: 3 },
    granite: { min: 8, max: 16, randIndex: 1 },
    marble: { min: 16, max: 32, randIndex: 1 },
    dunes: { min: 2, max: 4, randIndex: 1 },
    undergroundCabins: { min: 140, max: 160, randIndex: 1 },
    shadowChests: { min: 20, max: 30, randIndex: 2 },
    undergroundChests: { min: 140, max: 160, randIndex: 3 },
})
