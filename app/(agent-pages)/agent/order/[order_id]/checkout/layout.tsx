import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { GetOrderInfo } from '@/app/(master-admin)/master-admin/actions/order-actions/get-order-info';

export default async function AgentOrderCheckoutLayout({
    params,
    children
}: {
    params: Promise<{ order_id: string }>;
    children: React.ReactNode;
}) {
    const { order_id } = await params;
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['order', order_id],
        queryFn: () => GetOrderInfo(order_id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
} 