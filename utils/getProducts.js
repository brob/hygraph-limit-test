import hygraphClient, { gql } from './hygraph-client.js'

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

export async function getProductBySlug(slug, preview=false) {
    const query = gql`query GetSingleBike($slug: String!, $stage: Stage!) {
      product(where: {slug: $slug}, stage: $stage) {
        name
        slug
        
      }
    }
      `
        try {
                hygraphClient.setHeader('Authorization', `Bearer ${process.env.HYGRAPH_DEV_AUTH_TOKEN}`)

                let {product} = await hygraphClient.request(query, {slug, stage: preview ? 'DRAFT' : 'PUBLISHED'})
    
                console.log({product})
                return product

        } catch (error) {
            console.log(error)
        }
}
  

export async function getPreviewProductBySlug(slug) {
  const data = getProductBySlug(slug, true)

  return data
}
