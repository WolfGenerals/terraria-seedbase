<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Constraint } from '@/terraria/Constraints.ts'
import OptionCard from '@/components/OptionCard.vue'
import type { CachedTerrariaRandom } from '@/terraria/Random.ts'

const model = defineModel<Map<number, Constraint>>({
    default: () => new Map()
})

interface Props {
    genRand: CachedTerrariaRandom
}
const props = defineProps<Props>()

const constraintInputs = reactive({
    index: 1,
    minInput: '0',
    maxInput: '1',
    targetInput: '0.5',
    enableTargetInput: true
})
const mirrorSeedInput = reactive({
    maxRandIndex: 3,
    useMaxDiff: true,
    maxDiffInput: '0.02'
})
const constraintInputsValid = computed(() => {
    const min = parseFloat(constraintInputs.minInput)
    const max = parseFloat(constraintInputs.maxInput)
    const target = parseFloat(constraintInputs.targetInput)
    const minValid = !isNaN(min)
    const maxValid = !isNaN(max)
    const rangeValid = minValid && maxValid && min < max && min >= 0 && max <= 1
    const targetValid =
        !constraintInputs.enableTargetInput || (!isNaN(target) && target >= min && target <= max)
    return rangeValid && targetValid
})
const mirrorSeedValid = computed(() => {
    const maxDiff = parseFloat(mirrorSeedInput.maxDiffInput)
    return !isNaN(maxDiff) && maxDiff >= 0 && maxDiff <= 1
})
const onSetConstraint = () => {
    if (!constraintInputsValid.value) return
    const min = parseFloat(constraintInputs.minInput)
    const max = parseFloat(constraintInputs.maxInput)
    const enableTarget = constraintInputs.enableTargetInput
    const target = parseFloat(constraintInputs.targetInput)

    model.value.set(
        constraintInputs.index,
        new Constraint(min, max, enableTarget ? target : undefined)
    )
}
const onRemoveConstraint = () => {
    model.value.delete(constraintInputs.index)
}

const onResetAllConstraints = () => {
    model.value.clear()
}
const onSetCurrentSeedAsConstraints = () => {
    if (!mirrorSeedValid.value) return
    model.value.clear()
    const maxDiff = parseFloat(mirrorSeedInput.maxDiffInput)
    for (let i = 1; i <= mirrorSeedInput.maxRandIndex; i++) {
        const random = props.genRand.random(i)
        if (mirrorSeedInput.useMaxDiff) {
            const min = Math.max(random - maxDiff, 0)
            const max = Math.min(random + maxDiff, 1)
            model.value.set(i, new Constraint(min, max, random))
        } else model.value.set(i, new Constraint(0, 1, random))
    }
}
</script>
<template>
    <div class="constraint-input flex flex-col gap-4">
        <!-- 输入区域 -->
        <div class="grid grid-cols-2 gap-4">
            <!-- 索引输入 -->
            <div>
                <label class="mb-1 block text-sm font-medium text-gray-300">约束索引</label>
                <input
                    type="number"
                    v-model="constraintInputs.index"
                    min="1"
                    @input="constraintInputs.index = Math.floor(constraintInputs.index)"
                    class="w-full rounded border border-gray-500 bg-gray-700 px-3 py-2 text-white transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
            </div>
            <option-card text="重置全部" @click="onResetAllConstraints" />

            <!-- 最小值输入 -->
            <div>
                <label class="mb-1 block text-sm font-medium text-gray-300">最小值</label>
                <input
                    type="text"
                    v-model="constraintInputs.minInput"
                    placeholder="0"
                    class="w-full rounded border border-gray-500 bg-gray-700 px-3 py-2 text-white transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
            </div>

            <!-- 最大值输入 -->
            <div>
                <label class="mb-1 block text-sm font-medium text-gray-300">最大值</label>
                <input
                    type="text"
                    v-model="constraintInputs.maxInput"
                    placeholder="1"
                    class="w-full rounded border border-gray-500 bg-gray-700 px-3 py-2 text-white transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
            </div>

            <!-- 目标值输入 -->
            <div>
                <label class="mb-1 block text-sm font-medium text-gray-300">目标值</label>
                <input
                    type="text"
                    v-model="constraintInputs.targetInput"
                    placeholder="0.5"
                    :disabled="!constraintInputs.enableTargetInput"
                    class="w-full rounded border border-gray-500 bg-gray-700 px-3 py-2 text-white transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none disabled:opacity-50"
                />
            </div>

            <!-- 启用目标值开关 -->
            <div class="flex items-end">
                <option-card
                    :text="`${constraintInputs.enableTargetInput ? '✓' : '✘'}使用目标值`"
                    @click="
                        constraintInputs.enableTargetInput = !constraintInputs.enableTargetInput
                    "
                    :active="constraintInputs.enableTargetInput"
                    active-style="border-amber-400 bg-amber-400/30"
                    inactive-style="border-gray-600 bg-gray-600/30"
                />
            </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="grid grid-cols-2 gap-3">
            <option-card
                text="设置约束"
                @click="onSetConstraint"
                :disabled="!constraintInputsValid"
                :describe="constraintInputsValid ? '点击应用约束' : '请填写有效范围'"
            />
            <option-card text="删除约束" @click="onRemoveConstraint" />
        </div>

        <!-- 设定相似 -->
        <div class="grid grid-cols-2 gap-3">
            <div>
                <span>对第1到第{{ mirrorSeedInput.maxRandIndex }}随机数</span>
                <input
                    type="number"
                    v-model="mirrorSeedInput.maxRandIndex"
                    min="1"
                    @input="mirrorSeedInput.maxRandIndex = Math.floor(mirrorSeedInput.maxRandIndex)"
                    class="w-full rounded border border-gray-500 bg-gray-700 px-3 py-2 text-white transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
            </div>
            <div>
                <span>最大差异</span>
                <input
                    type="text"
                    v-model="mirrorSeedInput.maxDiffInput"
                    placeholder="0.1"
                    class="w-full rounded border border-gray-500 bg-gray-700 px-3 py-2 text-white transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
            </div>
            <option-card
                :text="`${mirrorSeedInput.useMaxDiff ? '✓' : '✘'}使用最大差异`"
                describe="规定与当前随机数的最大差异"
                @click="mirrorSeedInput.useMaxDiff = !mirrorSeedInput.useMaxDiff"
                :active="mirrorSeedInput.useMaxDiff"
                active-style="border-amber-400 bg-amber-400/30"
                inactive-style="border-gray-600 bg-gray-600/30"
            />
            <option-card
                text="以当前种子为约束"
                @click="onSetCurrentSeedAsConstraints"
                :disabled="!mirrorSeedValid"
                :describe="mirrorSeedInput ? '点击应用约束' : '请填写有效范围'"
            />
        </div>
    </div>
</template>
