<script setup>
import { ref, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import debounce from 'lodash.debounce'
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const modelValue = defineModel({ type: Array, default: [] })

const symbolsStore = useSymbolsStore()
await symbolsStore.getSymbols()
const { symbols } = storeToRefs(symbolsStore)

const isOpen = ref(false)
const searchQuery = ref('')
const debouncedQuery = ref('')
const selectRef = ref(null)

const updateQuery = debounce((val) => {
  debouncedQuery.value = val
}, 300)
watch(searchQuery, (val) => updateQuery(val))

const filteredSymbols = computed(() => {
  if (!debouncedQuery.value) return symbols.value
  const query = debouncedQuery.value.toLowerCase()
  return symbols.value.filter((s) => s.symbol.toLowerCase().includes(query))
})

function toggleSymbol(symbol) {
  const idx = modelValue.value.findIndex((s) => s.symbol === symbol.symbol)
  if (idx > -1) {
    modelValue.value.splice(idx, 1)
  } else {
    modelValue.value.push(symbol)
  }
}

function isSelected(symbol) {
  return modelValue.value.some((s) => s.symbol === symbol.symbol)
}

function clearAll() {
  modelValue.value = []
}

onClickOutside(selectRef, () => (isOpen.value = false))
</script>

<template>
  <div ref="selectRef" class="relative w-full">
    <div
      class="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 cursor-pointer hover:border-indigo-500 transition"
      @click="isOpen = !isOpen"
    >
      <div class="flex flex-wrap items-center gap-2 flex-1 min-w-0">
        <template v-if="modelValue.length">
          <div
            v-for="s in modelValue"
            :key="s.symbol"
            class="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded text-sm"
          >
            <SymbolIcon :symbol="s.baseAsset" />
            <span>{{ s.symbol }}</span>
            <XMarkIcon
              class="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-400"
              @click.stop="toggleSymbol(s)"
            />
          </div>

          <button
            class="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 shrink-0"
            @click.stop="clearAll"
          >
            <TrashIcon class="w-4 h-4" />
            Очистити всі
          </button>
        </template>

        <span v-else class="text-gray-400">Вибрати символ</span>
      </div>

      <div class="flex items-center justify-center shrink-0">
        <ChevronDownIcon
          class="w-5 h-5 text-gray-400 transition-transform"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-2 border border-gray-700 rounded-md bg-gray-900 shadow-lg p-4"
    >
      <div class="relative mb-4">
        <MagnifyingGlassIcon
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Пошук..."
          class="w-full pl-10 pr-3 py-2 rounded-sm bg-gray-800 text-gray-100 placeholder-gray-500 border-b border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <client-only>
        <RecycleScroller
          v-slot="{ item }"
          class="max-h-65 overflow-auto"
          :items="filteredSymbols"
          :item-size="45"
          key-field="symbol"
        >
          <div
            class="flex items-center gap-2 px-2 py-2 hover:bg-gray-700 cursor-pointer transition"
            :class="{ 'bg-indigo-700/40': isSelected(item) }"
            @click="toggleSymbol(item)"
          >
            <SymbolIcon :symbol="item.baseAsset" />
            <span>{{ item.symbol }}</span>
          </div>
        </RecycleScroller>
      </client-only>
    </div>
  </div>
</template>
