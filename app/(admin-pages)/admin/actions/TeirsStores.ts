import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTiers } from "./api/get-tiers";
import { getTierAndProducts } from "../pricing-tier-actions/get-tier-and-products";

export const useTiers = () => {
    return useQuery({
        queryKey: ['tiers'],
        queryFn: getTiers,
    })
}

export const useTierAndProducts = (tierId: string) => {
    return useQuery({
        queryKey: ['tier-and-products', tierId],
        queryFn: () => getTierAndProducts(tierId),
    })
}
