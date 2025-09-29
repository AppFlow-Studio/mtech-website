"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTag(name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .insert({ name: name.toLowerCase() })
    .select()
    .single();

  if (error) {
    console.error("Error adding tag:", error);
    return { success: false, error };
  }

  revalidatePath("/(master-admin)/master-admin", "layout");
  return { success: true, data };
}
