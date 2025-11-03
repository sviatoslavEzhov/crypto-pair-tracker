/*
 The FetchFactory acts as a wrapper around an HTTP client.
 It encapsulates the functionality for making API requests asynchronously
 through the call function, utilizing the provided HTTP client.
*/

class FetchFactory {
    constructor(fetcher) {
        this.$fetch = fetcher
    }

    /**
     * The HTTP client is utilized to control the process of making API requests.
     * @param method the HTTP method (GET, POST, ...)
     * @param url the endpoint url
     * @param data the body data
     * @param query query parameters
     * @param fetchOptions fetch options
     * @returns
     */
    async call(method, url, data = null, query = {}, fetchOptions = {}) {
        return this.$fetch(url, {
            method,
            body: data,
            query,
            ...fetchOptions,
        })
    }
}

export default FetchFactory
