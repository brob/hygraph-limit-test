import React from 'react';
import { allProducts, getProductBySlug } from '../../utils/getProducts'
import hygraphClient, { gql } from '../../utils/hygraph-client';
import Head from 'next/head'
import pThrottle from 'p-throttle'
import { throttledFetch } from '../../utils/throttle';

export async function getStaticPaths() {
  const products = await allProducts()
  const paths = products.map((product) => ({
    params: { slug: product?.slug },
  }))
  return { paths, fallback: false }
}


export async function getStaticProps({ params }) {
  console.time()
  const query = gql`query GetSingleBike($slug: String!) {
        product(where: {slug: $slug}) {
          name
          slug
        }
      }
        `
  // const data = await getItem(params.slug, preview)  
  const product = await throttledFetch(query,{ slug: params.slug})
  console.log(product)
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