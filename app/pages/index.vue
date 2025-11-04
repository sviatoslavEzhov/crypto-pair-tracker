<script setup>
const selectedSymbols = ref([])
const selectedPair = ref(null)

function selectPair(pair) {
  selectedPair.value = pair.symbol
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-900 text-gray-100 transition-colors">
    <header class="flex items-center justify-between p-4 border-b border-gray-800">
      <h1 class="text-xl font-semibold">Crypto Tracker</h1>
    </header>

    <main class="flex-1 container mx-auto p-4 space-y-6">
      <section>
        <SymbolSelector v-model="selectedSymbols" />
      </section>

      <section v-if="selectedSymbols.length">
        <h2 class="text-lg font-semibold mb-3">Обрані пари</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SymbolTicker
            v-for="pair in selectedSymbols"
            :key="pair.symbol"
            :pair="pair"
            @click="selectPair(pair)"
          />
        </div>
      </section>

      <section v-if="selectedPair" class="p-4 bg-gray-800 rounded-xl border border-gray-700">
        <h3 class="text-lg font-semibold mb-2">Графік: {{ selectedPair }}</h3>
        <div class="h-80 bg-gray-700 rounded-lg flex items-center justify-center">
          <span class="text-gray-400">Candlestick Chart</span>
        </div>
      </section>
    </main>
  </div>
</template>
