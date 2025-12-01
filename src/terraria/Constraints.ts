import type { CachedTerrariaRandom } from '@/terraria/Random.ts'

export class Constraint {
    public readonly max: number
    public readonly min: number
    public readonly target?: number
    constructor(min: number, max: number, target?: number) {
        this.max = max
        this.min = min
        this.target = target
    }

    static aroundTarget(target: number, delta: number) {
        return new Constraint(target - delta, target + delta, target)
    }
    static between(min: number, max: number) {
        return new Constraint(min, max)
    }

    public contains(value: number) {
        return this.min <= value && value < this.max
    }
    public diff(value: number) {
        if (!this.contains(value)) {
            return Number.POSITIVE_INFINITY
        }
        return this.target ? Math.abs(value - this.target) : 0
    }

    public static allSatisfied(
        genRand: CachedTerrariaRandom,
        constraints: Map<number, Constraint>
    ) {
        return [...constraints.keys()].every((index) =>
            constraints.get(index)!.contains(genRand.random(index))
        )
    }
    public static averageDiffs(
        genRand: CachedTerrariaRandom,
        constraints: Map<number, Constraint>
    ): number {
        if (constraints.size === 0) return 0
        return (
            [...constraints.keys()]
                .map((index) => constraints.get(index)!.diff(genRand.random(index)))
                .reduce((acc, cur) => acc + cur, 0) / constraints.size
        )
    }
}
