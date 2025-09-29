"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Mail,
  Phone,
  Building,
  Calendar,
  Search,
  X,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  LayoutGrid,
  List,
} from "lucide-react";
import { useQuoteRequests } from "../actions/hook/useQuoteRequests";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface QuoteRequestItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  notes?: string;
}

interface QuoteRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company?: string;
  customer_message?: string;
  total_items: number;
  status: "pending" | "approved" | "closed" | "rejected";
  created_at: string;
  quote_request_items: QuoteRequestItem[];
}

export function QuoteRequests() {
  const {
    data: quoteRequests,
    isLoading,
    isError,
    refetch,
  } = useQuoteRequests();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "rows">("cards");

  const filteredRequests = useMemo(() => {
    if (!quoteRequests) return [];

    return quoteRequests.filter((request: any) => {
      const matchesSearch =
        searchTerm === "" ||
        request.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.customer_email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (request.customer_company &&
          request.customer_company
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        request.id.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      const requestDate = new Date(request.created_at);
      const now = new Date();
      let matchesDate = true;
      if (dateFilter !== "all") {
        const days = parseInt(dateFilter);
        const filterDate = new Date(now.setDate(now.getDate() - days));
        matchesDate = requestDate >= filterDate;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [quoteRequests, searchTerm, statusFilter, dateFilter]);

  const getStatusBadge = (status: any) => {
    const statusConfig = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        label: "Pending",
      },
      approved: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        label: "Quoted",
      },
      closed: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
        label: "Closed",
      },
      rejected: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        label: "Rejected",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = useMemo(() => {
    if (!quoteRequests) return null;

    const total = quoteRequests.length;
    const pending = quoteRequests.filter(
      (r: any) => r.status === "pending"
    ).length;
    const approved = quoteRequests.filter(
      (r: any) => r.status === "approved"
    ).length;
    const closed = quoteRequests.filter(
      (r: any) => r.status === "closed"
    ).length;
    const rejected = quoteRequests.filter(
      (r: any) => r.status === "rejected"
    ).length;

    return { total, pending, approved, closed, rejected };
  }, [quoteRequests]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Quote Requests</h2>
        <Button onClick={async () => await refetch()} variant="outline">
          Refresh
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Closed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stats.closed}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <div className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Name, Email, Company, or ID..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1">Last 24 Hours</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
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
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quote requests found</p>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request: any) => (
            <QuoteRequestCard
              key={request.id}
              request={request}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <QuoteRequestTable
          requests={filteredRequests}
          getStatusBadge={getStatusBadge}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

function QuoteRequestCard({
  request,
  getStatusBadge,
  formatDate,
}: {
  request: any;
  getStatusBadge: any;
  formatDate: any;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {request.customer_name} {request.customer_last_name}
          </CardTitle>
          {getStatusBadge(request.status)}
        </div>
        <CardDescription>{request.customer_company}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />{" "}
            {request.customer_email}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />{" "}
            {request.customer_phone}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />{" "}
            {formatDate(request.created_at)}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <Link href={`/master-admin/quote-requests/${request.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function QuoteRequestTable({
  requests,
  getStatusBadge,
  formatDate,
}: {
  requests: any[];
  getStatusBadge: any;
  formatDate: any;
}) {
  const router = useRouter();
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              key={request.id}
              onClick={() =>
                router.push(`/master-admin/quote-requests/${request.id}`)
              }
              className="cursor-pointer"
            >
              <TableCell className="font-medium">
                {request.customer_name} {request.customer_last_name}
              </TableCell>
              <TableCell>{request.customer_company || "N/A"}</TableCell>
              <TableCell>{formatDate(request.created_at)}</TableCell>
              <TableCell>{request.quote_request_items.length}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell>
                {request.profiles
                  ? `${request.profiles.first_name} ${request.profiles.last_name}`
                  : "Unassigned"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
