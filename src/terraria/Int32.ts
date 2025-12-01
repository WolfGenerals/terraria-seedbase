// 32位有符号整数数学工具

export const INT32_MAX = 0x7fffffffn // 2147483647
export const INT32_MIN = -0x80000000n // -2147483648
export const UINT32_MAX = 0xffffffffn // 4294967295

/**
 * 将任意数字转换为32位有符号整数BigInt
 */
export function asInt32(value: number | bigint): bigint {
    const bigValue = typeof value === 'number' ? BigInt(Math.floor(value)) : value
    // 先取低32位（无符号）
    const unsigned = bigValue & UINT32_MAX
    // 如果有符号位（第32位为1），则转换为负数
    if ((unsigned & 0x80000000n) !== 0n) {
        // 通过符号扩展得到负数
        return unsigned | ~UINT32_MAX
    }
    return unsigned
}
/**
 * 将BigInt转换为Number
 */
export function asNumber(value: number | bigint): number {
    return Number(asInt32(value))
}

/**
 * 32位有符号整数加法，处理溢出
 */
export function i32Add(a: bigint, b: bigint): bigint {
    return asInt32(a + b)
}

/**
 * 32位有符号整数减法，处理溢出
 */
export function i32Sub(a: bigint, b: bigint): bigint {
    return asInt32(a - b)
}

/**
 * 32位有符号整数乘法，处理溢出
 */
export function i32Mul(a: bigint, b: bigint): bigint {
    return asInt32(a * b)
}

/**
 * 32位有符号整数取模，处理负数情况
 */
export function i32Mod(a: bigint, b: bigint): bigint {
    return asInt32(a % b)
}

/**
 * 32位整数绝对值
 */
export function i32Abs(value: bigint): bigint {
    if (i32Equals(value, INT32_MIN)) {
        return INT32_MAX // 处理边界情况：-2147483648的绝对值是2147483647
    }
    return value < 0n ? -value : value
}

/**
 * 安全的32位整数比较
 */
export function i32Equals(a: bigint, b: bigint): boolean {
    return asInt32(a) === asInt32(b)
}
