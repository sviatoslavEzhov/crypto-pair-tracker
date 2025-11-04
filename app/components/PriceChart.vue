<script setup>
import { createChart, CandlestickSeries } from 'lightweight-charts'

const { $binanceApi } = useNuxtApp()

const props = defineProps({
  symbol: { type: String, required: true }
})

let chart, candlestickSeries, ws

const fetchHistory = async (symbol) => {
  const { data: chartData } = await $binanceApi.history.read(symbol.toUpperCase())

  return chartData.value.map((k) => ({
    time: k[0] / 1000,
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4])
  }))
}

const connectSocket = (symbol) => {
  ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1m`)

  ws.onmessage = (event) => {
    const { k } = JSON.parse(event.data)
    const candle = {
      time: k.t / 1000,
      open: parseFloat(k.o),
      high: parseFloat(k.h),
      low: parseFloat(k.l),
      close: parseFloat(k.c)
    }
    candlestickSeries.update(candle)
  }
}

const initChart = async (symbol) => {
  const container = document.getElementById('container')
  container.innerHTML = ''

  chart = createChart(container, {
    layout: { textColor: 'white', background: { type: 'solid', color: 'black' } },
    grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } }
  })

  candlestickSeries = chart.addSeries(CandlestickSeries, {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350'
  })

  const history = await fetchHistory(symbol)
  candlestickSeries.setData(history)
  chart.timeScale().fitContent()

  connectSocket(symbol)
}

watch(
  () => props.symbol,
  (newSymbol) => {
    if (!newSymbol) return
    if (ws) ws.close()
    initChart(newSymbol)
  }
)

onMounted(() => {
  if (props.symbol) initChart(props.symbol)
})

onUnmounted(() => {
  if (ws) ws.close()
})
</script>

<template>
  <div id="container" style="width: 100%; height: 400px"></div>
</template>
