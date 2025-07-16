"use client";

import { useState } from "react";
import OrderCard, { Order } from "./OrderCard";

interface OrdersSectionProps {
    orders: Order[];
    refetchOrders: () => void;
    setSelectedInquiryForCart: (inquiry: Order) => void;
    setCartItems: (items: any[]) => void;
}

export default function OrdersSection({ orders, refetchOrders, setSelectedInquiryForCart, setCartItems }: OrdersSectionProps) {
    return (
        <div className="space-y-4">
            {orders.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No orders yet.</div>
            ) : (
                orders.map((order) => (
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