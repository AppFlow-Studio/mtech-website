import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function MasterAdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRole="MASTER_ADMIN">
            {children}
        </ProtectedRoute>
    )
}