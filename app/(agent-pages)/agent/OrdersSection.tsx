"use client";

import { useState } from "react";
import OrderCard, { Order } from "./OrderCard";

interface OrdersSectionProps {
    orders: Order[];
    refetchOrders: () => void;
    setSelectedInquiryForCart: (inquiry: Order) => void;
    setCartItems: (items: any[]) => void;
    statusFilter: string;
}

export default function OrdersSection({ orders, refetchOrders, setSelectedInquiryForCart, setCartItems, statusFilter }: OrdersSectionProps) {
    const filteredOrders = orders.filter((order) => statusFilter === 'all' ? true : order.status === statusFilter);
    return (
        <div className="space-y-4">
            {filteredOrders.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No orders yet.</div>
            ) : (
                filteredOrders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        refetchOrders={refetchOrders}
                        setSelectedInquiryForCart={setSelectedInquiryForCart}
                        setCartItems={setCartItems}
                    />
                ))
            )}
        </div>
    );
} 