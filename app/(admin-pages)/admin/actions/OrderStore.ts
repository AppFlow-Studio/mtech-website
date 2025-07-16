import { useQuery } from "@tanstack/react-query"
import { getSubmittedOrders } from "./order-actions/get-submitted-orders"

export const useSubmittedOrders = () => {
    return useQuery({
        queryKey: ['submitted-orders'],
        queryFn: getSubmittedOrders,
    })
}