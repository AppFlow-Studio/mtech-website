import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { GetOrderInfo } from '@/app/(master-admin)/master-admin/actions/order-actions/get-order-info';
import AgentOrderDetailsPage from './page';

export default async function AgentOrderLayout({ params }: { params: Promise<{ order_id: string }> }) {
    const { order_id } = await params;
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['order', order_id],
        queryFn: () => GetOrderInfo(order_id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AgentOrderDetailsPage params={{ order_id }} />
        </HydrationBoundary>
    );
} 