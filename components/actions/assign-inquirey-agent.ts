"use server";
import { createClient } from "@/utils/supabase/server";

export const assignInquiryAgent = async (inquiryId: string, agentId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("inquiries").update({ assigned_to: agentId, status: "assigned" }).eq("id", inquiryId);

  if (error) {
    throw error;
  }

  return data;
};