"use server";
import { createClient } from "@/utils/supabase/server";

export const agentUpdateInquiry = async (inquiryId: string, inquiry: any) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("inquiries").update(inquiry).eq("id", inquiryId);
  if (error) {
    throw error;
  }

  return data;
};