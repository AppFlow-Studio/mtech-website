import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInquiryNotes } from "../actions/get-inquiry-notes";
import { addInquiryNote } from "../actions/add-inquiry-note";

export const useInquiryNotes = (inquiryId: string) => {
    return useQuery({
        queryKey: ["inquiry-notes", inquiryId],
        queryFn: () => getInquiryNotes(inquiryId),
        enabled: !!inquiryId,
    });
};

export const useAddInquiryNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ inquiryId, agentId, agent_name, note }: { inquiryId: string; agentId: string; agent_name : string; note: string }) =>
            addInquiryNote(inquiryId, agentId, agent_name, note),
        onSuccess: (data, variables) => {
            // Invalidate and refetch the notes for this inquiry
            queryClient.invalidateQueries({ queryKey: ["inquiry-notes", variables.inquiryId] });
        },
    });
}; 