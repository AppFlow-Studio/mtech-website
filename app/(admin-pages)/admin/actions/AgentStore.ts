import { useQuery } from "@tanstack/react-query"
import { getAgents } from "./api/get-agents"

export const useAgents = () => {
    return useQuery({
        queryKey: ['agents'],
        queryFn: getAgents,
    })
}