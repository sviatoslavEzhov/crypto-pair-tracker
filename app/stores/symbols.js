import { SUCCESS } from '@/constants'

export const useSymbolsStore = defineStore('symbols', () => {
    const { $binanceApi } = useNuxtApp()

    const rawData = ref({})
    const symbols = ref([])
    const loaded = ref(false)
    const loading = ref(false)

    const getSymbols = async () => {
        loading.value = true

        try {
            const { data } = await $binanceApi.symbols.read()

            if (data.value === SUCCESS) {
                rawData.value = data.value
                symbols.value = data.value.symbols
                loaded.value = true
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    return {
        symbols,
        getSymbols
    }
})
