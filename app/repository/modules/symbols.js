import FetchFactory from '../factory'

class SymbolsModule extends FetchFactory {
    constructor(fetcher) {
        super(fetcher)
        this.RESOURCE = '/exchangeInfo'
    }

    async read(asyncDataOptions) {
        return useAsyncData(
            () => this.call('GET', this.RESOURCE),
            asyncDataOptions
        )
    }
}

export default SymbolsModule
