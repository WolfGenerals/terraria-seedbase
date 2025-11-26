export class Range {
    public readonly min: number
    public readonly max: number
    constructor(min: number, max: number) {
        // may invalid, but it's a possible case to use
        // Range.of(1,2).intersect(Range.of(2,3)) => Range.of(2,2)
        this.min = min
        this.max = max
    }
    public static of(min: number, max: number): Range {
        return new Range(min, max)
    }

    public get valid(): boolean {
        return this.min < this.max
    }
    public get center(): number {
        return (this.min + this.max) / 2
    }
    public get length(): number {
        return this.max - this.min + 1
    }
    public contains(value: number): boolean {
        return this.min <= value && value < this.max
    }
    public intersect(other: Range): Range {
        return this.intersectOf(other.min, other.max)
    }
    public intersectOf(min: number, max: number): Range {
        return Range.of(Math.max(this.min, min), Math.min(this.max, max))
    }
    public conflictsWith(other: Range): boolean {
        return !this.intersect(other).valid
    }
    public conflictsWithRange(min: number, max: number): boolean {
        return !this.intersectOf(min, max).valid
    }
    public toString(): string {
        return `Range[${this.min},${this.max}]`
    }
}

export class RandomConstraints {
    private readonly constraints: Map<number, Range> = new Map()
    constructor(constraints: Map<number, Range>) {
        // this.constraints = constraints
        //  deep copy
        this.constraints = new Map(constraints)
    }

    public hasConstraint(index: number): boolean {
        return this.constraints.has(index)
    }
    public getConstraint(index: number): Range {
        return this.constraints.get(index)!
    }
    public withConstraint(index: number, range: Range): RandomConstraints {
        return new RandomConstraints({
            ...this.constraints,
            [index]: this.hasConstraint(index)
                ? this.constraints.get(index)!.intersect(range)
                : range,
        })
    }
    public merge(other: RandomConstraints): RandomConstraints {
        const keys = [...this.constraints.keys(), ...other.constraints.keys()]
        const mergedRanges = new Map<number, Range>()
        for (const key of keys) {
            let range = this.hasConstraint(key)
                ? this.getConstraint(key)!
                : other.getConstraint(key)!
            if (this.hasConstraint(key) && other.hasConstraint(key)) {
                range = this.getConstraint(key)!.intersect(other.getConstraint(key)!)
            }
            mergedRanges.set(key, range)
        }
        return new RandomConstraints(mergedRanges)
    }
}
