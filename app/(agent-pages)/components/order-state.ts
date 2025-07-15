import { useQuery } from "@tanstack/react-query";
import getAgentOrders from "../actions/get-agent-orders";

const useOrderState = (agentId: string) => {
    return useQuery({
        queryKey: ["order-state", agentId],
        queryFn: () => getAgentOrders(agentId),
    });
};

export default useOrderState;