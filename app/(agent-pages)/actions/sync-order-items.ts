"use server"
import { createClient } from "@/utils/supabase/server"

// Define the type for a single order item for clarity
type OrderItem = {
    order_id: string,
    product_id: string,
    quantity: number,
    price_at_order: number
};

export async function syncOrderItems(order_id: string, newItems: OrderItem[]) {
    const supabase = await createClient();

    // 1. Delete all current items for this order
    const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', order_id);

    if (deleteError) {
        console.error('Error deleting old order items:', deleteError);
        throw new Error('Could not update cart. Failed to delete old items.');
    }

    // If there are no new items, we're done.
    if (newItems.length === 0) {
        return [];
    }

    // 2. Insert the new list of items
    const { data, error: insertError } = await supabase
        .from('order_items')
        .insert(newItems)
        .select(); // .select() returns the newly created rows

    if (insertError) {
        console.error('Error inserting new order items:', insertError);
        // This is a problem, as we've already deleted the old items.
        // See the note on transactions below.
        throw new Error('Could not update cart. Failed to insert new items.');
    }

    return data;
}