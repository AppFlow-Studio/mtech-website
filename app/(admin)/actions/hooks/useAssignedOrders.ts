import { useQuery } from "@tanstack/react-query";
import { GetAssignedOrders } from "../get-assigned-orders";
import { useProfile } from "@/lib/hooks/useProfile";

export const useAssignedOrders = (adminId: string) => {
    return useQuery({
        queryKey: ['assigned-orders', adminId],
        queryFn: () => GetAssignedOrders(adminId),
    })
}