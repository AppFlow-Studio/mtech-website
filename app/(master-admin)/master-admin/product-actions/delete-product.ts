"use server";
import { createClient } from "@/utils/supabase/server";

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  // Delete associated brochure from storage
  const { error: brochureError } = await supabase.storage
    .from("brochures")
    .remove([`${productId}-brochure.pdf`]);
  if (brochureError && brochureError.message !== "The resource was not found") {
    console.error("Error deleting brochure:", brochureError);
    // Decide if you want to stop the process or just log the error
  }

  // Delete associated product image from storage
  const { error: imageError } = await supabase.storage
    .from("products")
    .remove([productId]);
  if (imageError && imageError.message !== "The resource was not found") {
    console.error("Error deleting product image:", imageError);
  }

  // Finally, delete the product record from the table
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    return new Error(error.message);
  }

  return data;
}
