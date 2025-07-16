import { useSubmittedOrders } from "../actions/OrderStore"

export default function OrderManagementPage() {
    const { data: submittedOrders, isLoading: isSubmittedOrdersLoading } = useSubmittedOrders()
    return (
        <div>
            <h1>Order Management</h1>
        </div>
    )
}