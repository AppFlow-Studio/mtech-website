import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function AgentLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRole="AGENT">
            {children}
        </ProtectedRoute>
    )
}