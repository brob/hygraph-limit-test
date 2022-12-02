import pThrottle from 'p-throttle'
import hygraphClient from './hygraph-client'

const throttle = pThrottle({limit: 5,
	interval: 1000})
export const throttledFetch = throttle(async (...args) => {
    const [query, vars] = args

    const data = await hygraphClient.request(query, vars)

    return data
})

