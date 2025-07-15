"use client"
import { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import makeNewOrder from "../actions/make-new-order";
import { toast } from "sonner";
import { useProfile } from "@/lib/hooks/useProfile";

interface NewOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetchAgentOrders: () => void;
}

export default function NewOrderDialog({ open, onOpenChange, refetchAgentOrders }: NewOrderDialogProps) {
    const { profile } = useProfile();
    const [orderForm, setOrderForm] = useState({
        order_name: "",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setOrderForm({ order_name: "", notes: "" });
        setIsSubmitting(false);
        onOpenChange(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        if (!profile) {
            toast.error("Please login to create an order");
            return;
        }
        e.preventDefault();
        setIsSubmitting(true);
        const data = await makeNewOrder({ ...orderForm, agent_id: profile.id });
        if (data instanceof Error) {
            setIsSubmitting(false);
            toast.error(data.message);
            handleClose();
        } else {
            setIsSubmitting(false);
            handleClose();
            toast.success("Order created!");
            refetchAgentOrders();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>New Cart Order</DialogTitle>
                    <DialogDescription>
                        Fill out the details to create a new order.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Order Name</label>
                        <Input
                            value={orderForm.order_name}
                            onChange={e => setOrderForm(f => ({ ...f, order_name: e.target.value }))}
                            placeholder="Enter order name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <Textarea
                            value={orderForm.notes}
                            onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))}
                            placeholder="Add any notes for this order..."
                            className="min-h-[80px] resize-none"
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={isSubmitting || !orderForm.order_name}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Order
                                </>
                            )}
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-green-500 text-white hover:bg-green-600"
                            disabled={isSubmitting || !orderForm.order_name}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Shop for this order
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 