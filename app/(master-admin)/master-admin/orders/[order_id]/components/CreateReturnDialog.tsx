"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/lib/hooks/useProfile";
import { createReturn } from "../actions/create-return";

interface OrderItem {
    id: string;
    products: {
        name: string;
        description?: string;
    };
    quantity: number;
    price_at_order: number;
}

interface CreateReturnDialogProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    orderItems: OrderItem[];
    orderName: string;
}

export default function CreateReturnDialog({
    isOpen,
    onClose,
    orderId,
    orderItems,
    orderName,
}: CreateReturnDialogProps) {
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1);
    const [returnReason, setReturnReason] = useState("");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isConfirming, setIsConfirming] = useState(false);

    const createReturnMutation = useMutation({
        mutationFn: (data: { returnReason: string; itemsToReturn: any[] }) =>
            createReturn(orderId, profile?.id!, data.returnReason, data.itemsToReturn),
        onSuccess: (data) => {
            toast.success(`Return ${data.return_number} created successfully`);
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            onClose();
            resetForm();
        },
        onError: (error) => {
            toast.error("Failed to create return");
            console.error(error);
        },
    });

    const resetForm = () => {
        setStep(1);
        setReturnReason("");
        setSelectedItems([]);
        setIsConfirming(false);
    };

    const handleNext = () => {
        if (step === 1 && !returnReason.trim()) {
            toast.error("Please provide a return reason");
            return;
        }
        if (step === 2 && selectedItems.length === 0) {
            toast.error("Please select at least one item to return");
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleCreateReturn = () => {
        const itemsToReturn = orderItems.filter(item => selectedItems.includes(item.id));
        createReturnMutation.mutate({
            returnReason,
            itemsToReturn: itemsToReturn.map(item => ({
                item_id: item.id,
                product_name: item.products.name,
                quantity: item.quantity,
                price: item.price_at_order,
            })),
        });
    };

    const toggleItemSelection = (itemId: string) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const selectedItemsData = orderItems.filter(item => selectedItems.includes(item.id));
    const totalReturnValue = selectedItemsData.reduce((sum, item) => sum + (item.price_at_order * item.quantity), 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Create Return for Order: {orderName}
                    </DialogTitle>
                    <DialogDescription>
                        Follow the steps below to create a return for this order
                    </DialogDescription>
                </DialogHeader>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3].map((stepNumber) => (
                            <div key={stepNumber} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNumber
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {stepNumber}
                                </div>
                                {stepNumber < 3 && (
                                    <div
                                        className={`w-12 h-0.5 mx-2 ${step > stepNumber ? "bg-primary" : "bg-muted"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 1: Return Reason */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="returnReason" className="text-sm font-medium">
                                Return Reason *
                            </Label>
                            <Textarea
                                id="returnReason"
                                placeholder="Please describe the reason for this return..."
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                className="min-h-[120px] mt-2"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleNext} disabled={!returnReason.trim()}>
                                Next Step
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Select Items */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium">
                                Select Items to Return *
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                                Choose which items from this order should be returned
                            </p>
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {orderItems.map((item) => (
                                <Card
                                    key={item.id}
                                    className={`cursor-pointer transition-colors ${selectedItems.includes(item.id)
                                            ? "border-primary bg-primary/5"
                                            : "hover:border-muted-foreground/50"
                                        }`}
                                    onClick={() => toggleItemSelection(item.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleItemSelection(item.id)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium">{item.products.name}</h4>
                                                {item.products.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {item.products.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 mt-2 text-sm">
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>Price: ${item.price_at_order}</span>
                                                    <span className="font-medium">
                                                        Total: ${(item.price_at_order * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back
                            </Button>
                            <Button onClick={handleNext} disabled={selectedItems.length === 0}>
                                Next Step
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Return Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">Reason:</span> {returnReason}
                                </div>
                                <div>
                                    <span className="font-medium">Items:</span> {selectedItemsData.length} item(s)
                                </div>
                                <div>
                                    <span className="font-medium">Total Value:</span> ${totalReturnValue.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium">Items Being Returned:</h4>
                            {selectedItemsData.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-background border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{item.products.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Qty: {item.quantity} × ${item.price_at_order}
                                        </p>
                                    </div>
                                    <Badge variant="secondary">
                                        ${(item.price_at_order * item.quantity).toFixed(2)}
                                    </Badge>
                                </div>
                            ))}
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div>
                                    <h5 className="font-medium text-amber-800">Important Information</h5>
                                    <p className="text-sm text-amber-700 mt-1">
                                        Once you create this return, a unique Return Number (RMA) will be generated.
                                        The return will be marked as pending and can be processed by the admin team.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back
                            </Button>
                            <Button
                                onClick={handleCreateReturn}
                                disabled={createReturnMutation.isPending}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                {createReturnMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                    <Package className="h-4 w-4 mr-1" />
                                )}
                                Create Return
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
} 