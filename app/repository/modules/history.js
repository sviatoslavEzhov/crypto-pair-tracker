import FetchFactory from '../factory'

class HistoryModule extends FetchFactory {
  constructor(fetcher) {
    super(fetcher)
    this.RESOURCE = 'klines'
  }

  async read(symbol, asyncDataOptions) {
    return useAsyncData(
      () => this.call('GET', `${this.RESOURCE}?symbol=${symbol}&interval=1m&limit=100`),
      asyncDataOptions
    )
  }
}

export default HistoryModule
