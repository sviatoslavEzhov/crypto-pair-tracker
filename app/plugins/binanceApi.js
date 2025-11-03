import { $fetch } from 'ofetch'
import SybmolsModule from '@/repository/modules/symbols.js'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const fetchOptions = {
        baseURL: config.public.binanceApiUrl,
    }

    const clientFetcher = $fetch.create(fetchOptions)

    const modules = {
        symbols: new SybmolsModule(clientFetcher),
    }

    return {
        provide: {
            binanceApi: modules,
        },
    }
})
