"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTag(id: string, name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .update({ name: name.toLowerCase() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating tag:", error);
    return { success: false, error };
  }

  revalidatePath("/(master-admin)/master-admin", "layout");
  return { success: true, data };
}
