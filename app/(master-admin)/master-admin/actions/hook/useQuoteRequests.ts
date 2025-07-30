import { useQuery } from "@tanstack/react-query"
import { GetQuoteRequests } from "../get-quote-requests"

export function useQuoteRequests() {
    return useQuery({
        queryKey: ['quote-requests'],
        queryFn: GetQuoteRequests,
    })
}