'use client'

import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../get-products'
import { getProductInfo } from '../get-product-info'

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    })
}

export const useProductInfo = (slug: string) => {
    return useQuery({
        queryKey: ['product-info', slug],
        queryFn: () => getProductInfo(slug),
    })
}