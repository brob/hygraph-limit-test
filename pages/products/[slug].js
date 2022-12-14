// Product detail pages generated from utils/getProducts.js
// Path: /pages/products/[slug].js
import React from 'react';
import { allProducts, getThrottledProductBySlug } from '../../utils/getProducts'
import Head from 'next/head'

export async function getStaticPaths() {
    const products = await allProducts()
    const paths = products.map((product) => ({
        params: { slug: product?.slug },
    }))
    return { paths, fallback: false }
}

export async function getStaticProps({ params, preview = false }) {
    console.time()
    // const data = await getItem(params.slug, preview)  
    const data = await getThrottledProductBySlug(params.slug, preview)
    console.timeEnd()
    return {
        props: {data, preview}
    }
}

export default function Page({ product, reviews, preview }) {

    return (<>
        <Head>
            <title>{product?.name}</title>
        </Head>
        
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product?.name}</h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">${product?.price}</p>
                {/* Reviews */}

                <button
                    type="submit"
                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Add to bag
                </button>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
                {/* Description and details */}
                <div>
                    <h3 className="sr-only">Description</h3>
                    <div className="mb-10" dangerouslySetInnerHTML={{__html: product?.description}}></div>              
                </div>
            </div>
        </div>
       
    </>)
}