<script setup>
// https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams
const props = defineProps({
  pair: { type: Object, required: true }
})

const price = ref(null)
const prevPrice = ref(null)
const change24h = ref(0)

if (import.meta.client) {
  const symbol = props.pair.symbol.toLowerCase()
  const url = `wss://stream.binance.com:9443/ws/${symbol}@ticker`

  const { data, close } = useWebSocket(url, { autoReconnect: true })

  watch(data, (msg) => {
    if (!msg) return
    const json = JSON.parse(msg)
    const current = parseFloat(json.c)
    prevPrice.value = price.value ?? current
    price.value = current
    change24h.value = parseFloat(json.P)
  })

  onBeforeUnmount(() => close())
}
</script>

<template>
  <div class="p-4 bg-gray-800 rounded-xl border border-gray-700">
    <div class="flex items-center gap-3 mb-2">
      <SymbolIcon :symbol="pair.baseAsset" />
      <span>{{ pair.symbol }}</span>
    </div>

    <div v-if="price">
      <div
        class="text-2xl font-bold"
        :class="price > prevPrice ? 'text-green-400' : 'text-red-400'"
      >
        {{ price.toFixed(2) }}
      </div>
      <div class="text-sm" :class="change24h > 0 ? 'text-green-500' : 'text-red-500'">
        {{ change24h > 0 ? '+' : '' }}{{ change24h.toFixed(2) }}%
      </div>
    </div>

    <div v-else class="text-gray-500 text-sm">Завантаження...</div>
  </div>
</template>
