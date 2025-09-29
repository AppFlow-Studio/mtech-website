"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteTag(id: string) {
  const supabase = await createClient();

  // First, delete associations in the product_tags junction table
  const { error: junctionError } = await supabase
    .from("product_tags")
    .delete()
    .eq("tag_id", id);
  if (junctionError) {
    console.error("Error deleting tag associations:", junctionError);
    return { success: false, error: junctionError };
  }

  // Then, delete the tag itself
  const { data, error } = await supabase.from("tags").delete().eq("id", id);

  if (error) {
    console.error("Error deleting tag:", error);
    return { success: false, error };
  }

  revalidatePath("/(master-admin)/master-admin", "layout");
  return { success: true, data };
}
