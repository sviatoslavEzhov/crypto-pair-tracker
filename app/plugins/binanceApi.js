import { $fetch } from 'ofetch'
import SybmolsModule from '@/repository/modules/symbols.js'
import HistoryModule from '@/repository/modules/history.js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const fetchOptions = {
    baseURL: config.public.binanceApiUrl
  }

  const clientFetcher = $fetch.create(fetchOptions)

  const modules = {
    symbols: new SybmolsModule(clientFetcher),
    history: new HistoryModule(clientFetcher)
  }

  return {
    provide: {
      binanceApi: modules
    }
  }
})
