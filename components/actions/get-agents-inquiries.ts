"use server";
import { createClient } from "@/utils/supabase/server";

export const getAgentsInquiries = async (agentId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("inquiries").select(`
    *,
    profiles ( id, first_name, last_name )
  `).eq("assigned_to", agentId).order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};