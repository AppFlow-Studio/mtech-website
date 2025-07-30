import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import QuoteRequestDetailPage from "./[id]/page";
import { GetQuoteInfo } from "../actions/get-quote-info";

export default function QuoteRequestsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    )
} 