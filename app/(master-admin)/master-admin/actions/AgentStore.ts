import { useMutation, useQuery } from "@tanstack/react-query"
import { getAgents } from "./api/get-agents"
import { addAgent } from "./api/add-agent"
import { createUser } from "./api/agents/supabaseauthadmin"
import { deleteAgent } from "./api/delete-agent"
import { updateAgentAuth } from "./api/agents/supabaseauthadmin"
import { getAgentById } from "./api/agents/get-agent-by-id"
import { getAgentAndProducts } from "./api/agents/get-agent-and-products"

export const useAgents = () => {
    return useQuery({
        queryKey: ['agents'],
        queryFn: getAgents,
    })
}

export const useAddAgent = () => {
    return useMutation({
        mutationFn: createUser,
    })
}

export const useDeleteAgent = () => {
    return useMutation({
        mutationFn: deleteAgent,
    })
}

export const useUpdateAgent = () => {
    return useMutation({
        mutationFn: updateAgentAuth,
    })
}

export const useGetAgentById = (id: string) => {
    return useQuery({
        queryKey: ['agent', id],
        queryFn: () => getAgentById(id),
        enabled: !!id, // Only run the query if we have a valid ID
    })
}

export const useGetAgentProducts = (id: string) => {
    return useQuery({
        queryKey: ['agent-products', id],
        queryFn: () => getAgentAndProducts(id),
        enabled: !!id, // Only run the query if we have a valid ID
    })
}