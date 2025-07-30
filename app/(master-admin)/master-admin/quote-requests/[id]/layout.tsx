import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { GetQuoteInfo } from "../../actions/get-quote-info";
import QuoteRequestDetailPage from "./page";

export default async function QuoteRequestLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['quote-request', id],
        queryFn: () => GetQuoteInfo(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
           <QuoteRequestDetailPage params={{ id }} />
        </HydrationBoundary>
    );
} 