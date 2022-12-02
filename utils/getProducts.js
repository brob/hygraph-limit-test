import hygraphClient, { gql } from './hygraph-client.js'
import pThrottle from 'p-throttle'
// TODO: get this from hygraph instead
// Average review.rating for a product
function averageRating(reviews) {
  const total = reviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.floor(total / reviews.length)
}

export async function getSomeProducts(count = 4) {

  const query = gql`
  query GetSomeBikes($count: Int!) {
  bikes(first: $count) {
    bikeName
    id
    slug
    bcBikeData {
      data {
        name
        price
        availability
        images {
          is_thumbnail
          url_zoom
        }
      }
    }
  }
}
`

try {
  const {bikes} = await hygraphClient.request(query, {count})
  
  return bikes
} catch (error) {
  console.log(error)
}

}

export async function allProducts() {
    const query = gql`query GetAllSlugs {
      products
      {
        name
        id
        slug
        
      }
    }
      `

        try {
            const {products} = await hygraphClient.request(query)
            
            return products
        } catch (error) {
            console.log(error)
        }


}
const throttle = pThrottle({limit: 5,
	interval: 1000})
const throttledFetch = throttle(async (...args) => {
    const [query, vars] = args

    const data = await hygraphClient.request(query, vars)

    return data
})
export async function getThrottledProductBySlug(slug) {
    const query = gql`query GetSingleBike($slug: String!) {
      product(where: {slug: $slug}) {
        name
        slug
        
      }
    }
      `
        try {
                hygraphClient.setHeader('Authorization', `Bearer ${process.env.HYGRAPH_DEV_AUTH_TOKEN}`)

                let {product} = await throttledFetch(query, {slug})
    
                return product

        } catch (error) {
            console.log(error)
        }
}
  

export async function getProductBySlug(slug) {
    const query = gql`query GetSingleBike($slug: String!) {
      product(where: {slug: $slug}) {
        name
        slug
        
      }
    }
      `
        try {
                hygraphClient.setHeader('Authorization', `Bearer ${process.env.HYGRAPH_DEV_AUTH_TOKEN}`)

                let {product} = await hygraphClient.request(query, {slug})

    
                return product

        } catch (error) {
            console.log(error)
        }
}

export async function getPreviewProductBySlug(slug) {
  const data = getProductBySlug(slug, true)

  return data
}
