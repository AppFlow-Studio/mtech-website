"use server";
import { createClient } from "@/utils/supabase/server";

export const getInquiries = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("inquiries").select(`
    *,
    profiles ( id, first_name, last_name )
    `);

  if (error) {
    throw error;
  }

  return data;
};