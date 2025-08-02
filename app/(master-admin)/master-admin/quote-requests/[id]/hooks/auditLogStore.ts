'use client'

import { useQuery } from "@tanstack/react-query"
import { getAuditLog } from "../actions/get-audit-log"

export const useAuditLog = (quoteRequestId: string) => {
    const { data: auditLog, isLoading, error } = useQuery({
        queryKey: ['audit-log', quoteRequestId],
        queryFn: () => getAuditLog(quoteRequestId)
    })

    return { auditLog, isLoading, error }
}