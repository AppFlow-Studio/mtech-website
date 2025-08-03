export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
            {children}
        </div>
    )
} 