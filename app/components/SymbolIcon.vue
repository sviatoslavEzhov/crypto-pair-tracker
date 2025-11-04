<script setup>
const props = defineProps({
  symbol: {
    type: String,
    required: true
  }
})

const getIconUrl = (symbol) =>
  `https://raw.githubusercontent.com/VadimMalykhin/binance-icons/master/crypto/${symbol.toLowerCase()}.svg`
</script>

<template>
  <img class="w-6 h-6" :src="getIconUrl(props.symbol)" :alt="props.symbol" loading="lazy" />
</template>
