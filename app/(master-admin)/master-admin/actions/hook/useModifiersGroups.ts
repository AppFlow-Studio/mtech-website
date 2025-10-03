import { useQuery } from "@tanstack/react-query"
import { getModifierGroups } from "../order-actions/get-modifier-groups"

export const useModifierGroups = () => {
    return useQuery({
        queryKey: ['modifier-groups'],
        queryFn: getModifierGroups,
    })
}