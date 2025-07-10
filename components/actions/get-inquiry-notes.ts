"use server";
import { createClient } from "@/utils/supabase/server";

export const getInquiryNotes = async (inquiryId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase.from("inquery_notes").select(`
    *,
    profiles ( id, first_name, last_name )
  `).eq("inquery_id", inquiryId).order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}; 