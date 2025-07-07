import { useMutation, useQuery } from "@tanstack/react-query"
import { getAgents } from "./api/get-agents"
import { addAgent } from "./api/add-agent"
import { deleteAgent } from "./api/delete-agent"

export const useAgents = () => {
    return useQuery({
        queryKey: ['agents'],
        queryFn: getAgents,
    })
}

export const useAddAgent = () => {
    return useMutation({
        mutationFn: addAgent,
        
    })
}

export const useDeleteAgent = () => {
    return useMutation({
        mutationFn: deleteAgent,
    })
}