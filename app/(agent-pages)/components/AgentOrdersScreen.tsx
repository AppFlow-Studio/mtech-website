"use client";
import { useProfile } from "@/lib/hooks/useProfile";
import useOrderState from "./order-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowRight,
  Clock,
  Filter,
  DollarSign,
  Package,
  CheckCircle,
  List,
  LayoutGrid,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

function statusBadge(status: string) {
  const config: Record<string, { color: string; label: string }> = {
    draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
    submitted: { color: "bg-blue-100 text-blue-800", label: "Submitted" },
    approved: { color: "bg-green-100 text-green-800", label: "Approved" },
    fulfilled: { color: "bg-purple-100 text-purple-800", label: "Fulfilled" },
    completed: { color: "bg-purple-100 text-purple-800", label: "Completed" },
  };
  const c = config[status] || config.draft;
  return <Badge className={`${c.color} font-medium`}>{c.label}</Badge>;
}
function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AgentOrdersScreen({
  searchTerm,
  viewMode,
}: {
  searchTerm: string;
  viewMode: "cards" | "rows";
}) {
  const { profile } = useProfile();
  const { data: orders, isLoading, isError } = useOrderState(profile?.id || "");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    let filtered = orders;
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.order_items.some((item: any) =>
            item.products.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    return filtered;
  }, [orders, statusFilter, searchTerm]);

  const insights = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return null;
    const totalOrders = orders.length;
    const totalValue = orders.reduce((sum, order) => {
      const orderTotal =
        order.order_items?.reduce(
          (acc: number, item: any) =>
            acc + item.price_at_order * Number(item.quantity),
          0
        ) || 0;
      return sum + orderTotal;
    }, 0);
    const pendingOrders = orders.filter(
      (order) => order.status === "submitted"
    ).length;
    const completedOrders = orders.filter(
      (order) => order.status === "fulfilled" || order.status === "completed"
    ).length;
    return { totalOrders, totalValue, pendingOrders, completedOrders };
  }, [orders]);

  if (isLoading)
    return (
      <div className="text-center py-10">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  if (isError)
    return (
      <div className="text-center py-10 text-destructive">
        Failed to load orders.
      </div>
    );

  return (
    <div className="space-y-6">
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{insights.totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${insights.totalValue.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{insights.pendingOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{insights.completedOrders}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Filter by status:
          </span>
        </div>
        <Badge variant="secondary">
          {filteredOrders.length} of {Array.isArray(orders) ? orders.length : 0}
          orders
        </Badge>
      </div>

      <div className="flex space-x-2">
        {[
          "all",
          "draft",
          "submitted",
          "approved",
          "fulfilled",
          "completed",
        ].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No orders match your filters.
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <OrderTable orders={filteredOrders} />
      )}
    </div>
  );
}

function OrderCard({ order }: { order: any }) {
  const router = useRouter();
  const total =
    order.order_items?.reduce(
      (acc: number, item: any) =>
        acc + item.price_at_order * Number(item.quantity),
      0
    ) || 0;
  return (
    <Card
      onClick={() => router.push(`/agent/order/${order.id}`)}
      className="cursor-pointer hover:shadow-lg transition-shadow"
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.order_name}</CardTitle>
            <CardDescription>{formatDate(order.created_at)}</CardDescription>
          </div>
          {statusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p>Items: {order.order_items.length}</p>
        <p className="font-semibold">Total: ${total.toFixed(2)}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            View details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderTable({ orders }: { orders: any[] }) {
  const router = useRouter();
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fulfillment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const total = order.order_items.reduce(
              (acc: number, item: any) =>
                acc + item.price_at_order * item.quantity,
              0
            );
            return (
              <TableRow
                key={order.id}
                onClick={() => router.push(`/agent/order/${order.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">
                  {order.order_name}
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>{order.order_items.length}</TableCell>
                <TableCell>${total.toFixed(2)}</TableCell>
                <TableCell>{statusBadge(order.status)}</TableCell>
                <TableCell>{order.fulfillment_status || "N/A"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
