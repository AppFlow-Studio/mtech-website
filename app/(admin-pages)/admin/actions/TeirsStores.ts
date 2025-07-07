import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTiers } from "./api/get-tiers";

export const useTiers = () => {
    return useQuery({
        queryKey: ['tiers'],
        queryFn: getTiers,
    })
}