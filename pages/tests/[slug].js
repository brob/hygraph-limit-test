import { allProducts } from '../../utils/getProducts'
import hygraphClient, { gql } from '../../utils/hygraph-client';
import pThrottle from 'p-throttle'

export async function getStaticPaths() {
  const products = await allProducts()
  const paths = products.map((product) => ({
    params: { slug: product?.slug },
  }))
  return { paths, fallback: false }
}

const throttle = pThrottle({ limit: 2, interval: 1000 })
const throttledFetch = throttle(async (query, slug,) => {
  const product = await hygraphClient.request(query, { slug })

  return product
})

export async function getStaticProps({ params }) {
  console.time()
  const query = gql`query GetSingleBike($slug: String!) {
        product(where: {slug: $slug}) {
          name
          slug
        }
      }
        `
  const product = await throttledFetch(query, params.slug)
  console.timeEnd()
  return {
    props: product
  }
}

export default function Page({product}) {
  return (<>
    <h1>{product.name}</h1>
  </>)
}