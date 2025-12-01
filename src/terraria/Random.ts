import { asInt32, asNumber, i32Abs, i32Add, i32Mod, i32Sub, INT32_MAX } from './Int32'

export class UnifiedRandom {
    private SeedArray: bigint[] = new Array(56).fill(0n)
    private readonly MBIG = INT32_MAX // 2147483647
    private readonly MSEED = 161803398n // 0x9A4EC86n
    private inext = 0
    private inextp = 0

    constructor()
    constructor(seed: number | bigint)
    constructor(seed?: number | bigint) {
        if (seed === undefined) {
            // 使用当前时间作为种子，模拟 Environment.TickCount
            seed = UnifiedRandom.getSeed()
        }

        const seedValue = asInt32(seed)
        const seedAbs = i32Abs(seedValue) // 自动处理INT32_MIN的情况

        let num1 = i32Sub(this.MSEED, seedAbs)
        this.SeedArray[55] = num1

        let num2 = 1n
        for (let i = 1; i < 55; i++) {
            const index = (21 * i) % 55
            this.SeedArray[index] = num2
            num2 = i32Sub(num1, num2)
            if (num2 < 0n) {
                num2 = i32Add(num2, this.MBIG)
            }
            num1 = this.SeedArray[index]
        }

        for (let i = 1; i < 5; i++) {
            for (let j = 1; j < 56; j++) {
                const index = 1 + ((j + 30) % 55)
                this.SeedArray[j] = i32Sub(this.SeedArray[j]!, this.SeedArray[index]!)
                if (this.SeedArray[j]! < 0n) {
                    this.SeedArray[j] = i32Add(this.SeedArray[j]!, this.MBIG)
                }
            }
        }

        this.inext = 0
        this.inextp = 21
    }

    static getSeed() {
        return BigInt(Date.now() & 0x7fffffff)
    }

    protected sample(): number {
        return asNumber(this.internalSample()) * 4.6566128752458e-10
    }

    private internalSample(): bigint {
        let inext = this.inext
        let inextp = this.inextp

        if (++inext >= 56) inext = 1
        if (++inextp >= 56) inextp = 1

        let num = i32Sub(this.SeedArray[inext]!, this.SeedArray[inextp]!)

        if (num === this.MBIG) {
            num = i32Sub(num, 1n)
        }

        if (num < 0n) {
            num = i32Add(num, this.MBIG)
        }

        this.SeedArray[inext] = num
        this.inext = inext
        this.inextp = inextp

        return num
    }

    public next(): number
    public next(maxValue: number): number
    public next(minValue: number, maxValue: number): number
    public next(minValue?: number, maxValue?: number): number {
        if (minValue === undefined) {
            // 无参数版本：返回0到INT32_MAX之间的随机数
            return asNumber(this.internalSample())
        } else if (maxValue === undefined) {
            // 一个参数版本：返回0到maxValue-1之间的随机数
            if (minValue < 0) {
                throw new RangeError('maxValue must be positive.')
            }
            return Math.floor(this.sample() * minValue)
        } else {
            // 两个参数版本：返回minValue到maxValue-1之间的随机数
            if (minValue > maxValue) {
                throw new RangeError('minValue must be less than maxValue')
            }

            const range = BigInt(maxValue - minValue)

            if (range <= this.MBIG) {
                return Math.floor(this.sample() * Number(range)) + minValue
            } else {
                return asNumber(
                    i32Add(
                        BigInt(Math.floor(this.getSampleForLargeRange() * Number(range))),
                        BigInt(minValue)
                    )
                )
            }
        }
    }

    private getSampleForLargeRange(): number {
        let num = this.internalSample()

        // 随机决定正负
        if (asNumber(i32Mod(this.internalSample(), 2n)) === 0) {
            num = i32Sub(0n, num) // 取负
        }

        return (asNumber(num) + 2147483646.0) / 4294967293.0
    }

    public nextDouble(): number {
        return this.sample()
    }

    public nextBytes(buffer: Uint8Array): void {
        if (!buffer) {
            throw new Error('buffer cannot be null')
        }

        for (let i = 0; i < buffer.length; i++) {
            buffer[i] = asNumber(i32Mod(this.internalSample(), 256n))
        }
    }

    // 额外辅助方法：生成随机布尔值
    public nextBoolean(): boolean {
        return asNumber(i32Mod(this.internalSample(), 2n)) === 0
    }

    // 额外辅助方法：生成指定范围内的随机浮点数
    public nextDoubleRange(min: number, max: number): number {
        return min + (max - min) * this.nextDouble()
    }
}

export class CachedTerrariaRandom {
    readonly generator: UnifiedRandom
    readonly cachedValues: number[] = []

    constructor(generator: UnifiedRandom) {
        this.generator = generator
        this.cachedValues = []
    }

    public static fromSeed(seed: number): CachedTerrariaRandom {
        return new CachedTerrariaRandom(new UnifiedRandom(seed))
    }

    random(index: number): number {
        // i type: int, i>=1
        index = Math.floor(index)
        if (index <= 0) throw new Error('i must be greater than 0')
        while (this.cachedValues.length < index) {
            this.cachedValues.push(this.generator.nextDouble())
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
        if (selectedIndex >= list.length) return list[list.length - 1]! // 浮点数误差可能导致索引超出范围
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
