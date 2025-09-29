import { useQuery } from "@tanstack/react-query"
import { getTags } from "../get-tags"

export const useTags = () => {
    return useQuery({
        queryKey: ['tags'],
        queryFn: getTags,
    })
}