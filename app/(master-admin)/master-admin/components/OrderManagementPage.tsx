"use client";

import { useSubmittedOrders } from "../actions/OrderStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function statusBadge(status: string) {
  const config: Record<string, { color: string; label: string }> = {
    draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
    submitted: { color: "bg-blue-100 text-blue-800", label: "Submitted" },
    approved: { color: "bg-green-100 text-green-800", label: "Approved" },
    fulfilled: { color: "bg-purple-100 text-purple-800", label: "Fulfilled" },
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

export default function OrderManagementPage() {
  const { data: submittedOrders, isLoading: isSubmittedOrdersLoading } =
    useSubmittedOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [viewMode, setViewMode] = useState<"cards" | "rows">("cards");

  const filteredAndSortedOrders = useMemo(() => {
    let orders = Array.isArray(submittedOrders) ? submittedOrders : [];

    if (searchTerm) {
      orders = orders.filter(
        (order: any) =>
          order.order_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.order_items.some((item: any) =>
            item.products.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (statusFilter !== "all") {
      orders = orders.filter((order: any) => order.status === statusFilter);
    }

    orders.sort((a: any, b: any) => {
      const aDate = new Date(a.created_at).getTime();
      const bDate = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
    });

    return orders;
  }, [submittedOrders, searchTerm, statusFilter, sortOrder]);

  const stats = useMemo(() => {
    const orders = Array.isArray(submittedOrders) ? submittedOrders : [];
    return {
      totalOrders: orders.length,
      submittedCount: orders.filter((o: any) => o.status === "submitted")
        .length,
      fulfilledCount: orders.filter((o: any) => o.status === "fulfilled")
        .length,
      approvedCount: orders.filter((o: any) => o.status === "approved").length,
    };
  }, [submittedOrders]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Order Management</h1>
        <p className="text-muted-foreground mb-6">
          View and manage all submitted orders. Click on an order to view or
          fulfill it.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.submittedCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approvedCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.fulfilledCount}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order Name, ID, or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="fulfilled">Fulfilled</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as "desc" | "asc")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest to Oldest</SelectItem>
              <SelectItem value="asc">Oldest to Newest</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("cards")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "rows" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("rows")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div>
        {isSubmittedOrdersLoading ? (
          <div className="text-muted-foreground py-8 text-center">
            Loading orders...
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            No orders found.
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-6">
            {filteredAndSortedOrders.map((order: any) => (
              <OrderManagementCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <OrderManagementTable orders={filteredAndSortedOrders} />
        )}
      </div>
    </div>
  );
}

function OrderManagementCard({ order }: { order: any }) {
  const hasItems = order.order_items && order.order_items.length > 0;
  const total = hasItems
    ? order.order_items.reduce(
        (acc: number, item: any) => acc + item.price_at_order * item.quantity,
        0
      )
    : 0;
  return (
    <Link href={`/master-admin/orders/${order.id}`}>
      <Card className="border border-border rounded-lg hover:shadow-md hover:scale-105 transition-all duration-300 h-full flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground truncate">
              {order.order_name}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Created {formatDate(order.created_at)}
            </CardDescription>
          </div>
          {statusBadge(order.status)}
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
          <section className="flex-grow">
            <span className="block text-xs font-medium text-muted-foreground mb-1">
              Notes
            </span>
            <p className="text-sm text-foreground whitespace-pre-line min-h-[24px]">
              {order.notes || (
                <span className="italic text-muted-foreground">No notes</span>
              )}
            </p>
            <div className="mt-4">
              <span className="block text-xs font-medium text-muted-foreground mb-1">
                Cart Items
              </span>
              {hasItems ? (
                <ul className="space-y-2">
                  {order.order_items.slice(0, 2).map((item: any) => (
                    <li
                      key={item.product_id}
                      className="flex items-center gap-3"
                    >
                      {item.products?.imageSrc && (
                        <img
                          src={item.products.imageSrc}
                          alt={item.products.name}
                          className="w-10 h-10 object-cover rounded border"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="block font-medium text-foreground truncate">
                          {item.products?.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          Qty: {item.quantity} &bull; ${item.price_at_order}
                        </span>
                      </div>
                    </li>
                  ))}
                  {order.order_items.length > 2 && (
                    <li className="text-xs text-muted-foreground italic">
                      +{order.order_items.length - 2} more item(s)...
                    </li>
                  )}
                </ul>
              ) : (
                <div className="text-xs text-muted-foreground italic py-4">
                  No items in cart
                </div>
              )}
            </div>
          </section>
          <div className="flex mt-4">
            <Button size="sm" variant="outline">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function OrderManagementTable({ orders }: { orders: any[] }) {
  const router = useRouter();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment status</TableHead>
            <TableHead>Fulfillment status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Delivery method</TableHead>
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
                onClick={() => router.push(`/master-admin/orders/${order.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">
                  {order.order_name}
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  {order.agent?.first_name} {order.agent?.last_name}
                </TableCell>
                <TableCell>Online Store</TableCell>
                <TableCell>${total.toFixed(2)}</TableCell>
                <TableCell>
                  {statusBadge(order.payment_status || "unpaid")}
                </TableCell>
                <TableCell>{statusBadge(order.status)}</TableCell>
                <TableCell>{order.order_items.length} item(s)</TableCell>
                <TableCell>Shipping</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
