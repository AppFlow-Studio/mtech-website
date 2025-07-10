"use server";
import { createClient } from "@/utils/supabase/server";

export const addInquiryNote = async (inquiryId: string, agentId: string, agent_name: string, note: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase.from("inquery_notes").insert({
        inquery_id: inquiryId,
        agent_id: agentId,
        agent_name: agent_name,
        note: note
    }).select();

    if (error) {
        throw error;
    }

    return data;
}; 