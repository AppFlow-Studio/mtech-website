"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Loader2, User, Clock } from "lucide-react";
import { getOrderAuditLog } from "../actions/get-order-audit-log";

interface AuditLogEntry {
    id: string;
    action: string;
    details: string;
    created_at: string;
    profiles?: {
        id: string;
        first_name: string;
        last_name: string;
        role: string;
    };
}

interface OrderAuditLogProps {
    orderId: string;
}

export default function OrderAuditLog({ orderId }: OrderAuditLogProps) {
    const { data: auditLog, isLoading } = useQuery({
        queryKey: ["order-audit-log", orderId],
        queryFn: () => getOrderAuditLog(orderId),
    });

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getActionIcon = (action: string) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes("status")) return "🔄";
        if (actionLower.includes("note")) return "📝";
        if (actionLower.includes("return")) return "↩️";
        if (actionLower.includes("price")) return "💰";
        if (actionLower.includes("assigned")) return "👤";
        if (actionLower.includes("created")) return "✨";
        if (actionLower.includes("deleted")) return "🗑️";
        return "📋";
    };

    const getActionColor = (action: string) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes("status")) return "bg-blue-100 text-blue-800";
        if (actionLower.includes("note")) return "bg-green-100 text-green-800";
        if (actionLower.includes("return")) return "bg-orange-100 text-orange-800";
        if (actionLower.includes("price")) return "bg-purple-100 text-purple-800";
        if (actionLower.includes("assigned")) return "bg-indigo-100 text-indigo-800";
        if (actionLower.includes("created")) return "bg-emerald-100 text-emerald-800";
        if (actionLower.includes("deleted")) return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-800";
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Order History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Order History
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {auditLog && auditLog.length > 0 ? (
                        <div className="space-y-3">
                            {auditLog.map((entry: AuditLogEntry, index: number) => (
                                <div
                                    key={entry.id}
                                    className="flex items-start gap-3 p-3 bg-background border rounded-lg"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <span className="text-lg">
                                            {getActionIcon(entry.action)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`text-xs ${getActionColor(entry.action)}`}>
                                                    {entry.action}
                                                </Badge>
                                                {entry.profiles && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <User className="h-3 w-3" />
                                                        <span>
                                                            {entry.profiles.first_name} {entry.profiles.last_name}
                                                        </span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {entry.profiles.role}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>{formatDate(entry.created_at)}</span>
                                            </div>
                                        </div>
                                        {entry.details && (
                                            <p className="text-sm text-foreground">
                                                {entry.details}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No history yet</p>
                            <p className="text-xs">Actions taken on this order will appear here</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 