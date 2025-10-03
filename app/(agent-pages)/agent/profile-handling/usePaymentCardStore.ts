import { useQuery } from '@tanstack/react-query'
import { getAgentCardInfo } from './get-agent-card-info'

export const usePaymentCardStore = (agentId: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['agent-card-info'],
        queryFn: () => getAgentCardInfo(agentId),
    })
}