    import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
    import { GetOrderInfo } from '@/app/(admin-pages)/admin/actions/order-actions/get-order-info';
    import OrderIDManagerPage from '@/app/(admin-pages)/admin/orders/[order_id]/page';

    export default async function OrderIDManagerLayout({params} : {params : Promise<{order_id : string}>}) {
      const {order_id} = await params;
      const queryClient = new QueryClient();
      await queryClient.prefetchQuery({
        queryKey: ['order', order_id],
        queryFn: () => GetOrderInfo(order_id),
      });

      return (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <OrderIDManagerPage params={{order_id}} />
        </HydrationBoundary>
      );
    }