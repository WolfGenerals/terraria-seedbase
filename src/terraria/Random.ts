export class TerrariaRandom {
    readonly MAX_INT: number = 0x7fffffff
    readonly SEED_MULTIPLIER: number = 0x9a4ec86
    currentIndex: number = 0
    previousIndex: number = 0
    seedArray: number[] = []
    readonly seed: number = 0

    constructor(seed: number) {
        // seed should be int
        seed = Math.floor(seed % (2 ** 31-1))
        this.initialize(seed)
        this.seed = seed
    }

    initialize(seed: number): boolean {
        this.seedArray = new Array(56)
        let currentSeed =
            this.SEED_MULTIPLIER - (seed === -2147483648 ? this.MAX_INT : Math.abs(seed))
        this.seedArray[55] = currentSeed
        let previousSeed = 1

        for (let i = 1; i < 55; i++) {
            const index = (21 * i) % 55
            this.seedArray[index] = previousSeed
            previousSeed = currentSeed - previousSeed
            if (previousSeed < 0) {
                previousSeed += this.MAX_INT
            }
            currentSeed = this.seedArray[index]!
        }

        for (let iteration = 1; iteration < 5; iteration++) {
            for (let index = 1; index < 56; index++) {
                let seedValue = this.seedArray[index]!
                seedValue -= this.seedArray[1 + ((index + 30) % 55)]!
                if (seedValue < 0) {
                    seedValue += this.MAX_INT
                }
                this.seedArray[index] = seedValue
            }
        }

        this.currentIndex = 0
        this.previousIndex = 21
        return true
    }

    generateInternalSample(): number {
        if (++this.currentIndex >= 56) {
            this.currentIndex = 1
        }
        if (++this.previousIndex >= 56) {
            this.previousIndex = 1
        }

        let sample = this.seedArray[this.currentIndex]! - this.seedArray[this.previousIndex]!
        if (sample === this.MAX_INT) {
            sample--
        }
        if (sample < 0) {
            sample += this.MAX_INT
        }

        this.seedArray[this.currentIndex] = sample
        return sample
    }

    next(): number {
        return this.generateInternalSample() / this.MAX_INT
    }
}

export class CachedTerrariaRandom {
    readonly generator: TerrariaRandom
    readonly cachedValues: number[] = []

    constructor(generator: TerrariaRandom) {
        this.generator = generator
        this.cachedValues = []
    }
    public get seed(): number {
        return this.generator.seed
    }

    public static fromSeed(seed: number): CachedTerrariaRandom {
        return new CachedTerrariaRandom(new TerrariaRandom(seed))
    }

    random(index: number): number {
        // i type: int, i>=1
        index = Math.floor(index)
        if (index <= 0) throw new Error('i must be greater than 0')
        while (this.cachedValues.length < index) {
            this.cachedValues.push(this.generator.next())
        }
        return this.cachedValues[index - 1]!
    }
    randInt(index: number, min: number, max: number): number {
        // [min, max)
        return Math.floor(this.random(index) * (max - min)) + min
    }

    select<T>(index: number, list: T[]): T {
        if (list.length === 0) {
            throw new Error('List cannot be empty')
        }
        const selectedIndex = Math.floor(this.random(index) * list.length)
        return list[selectedIndex]!
    }

    // 预生成一定数量的随机数
    preGenerate(count: number): void {
        if (count <= 0) {
            throw new Error('Count must be greater than 0')
        }
        while (this.cachedValues.length < count) {
            this.cachedValues.push(this.generator.next())
        }
    }
}
