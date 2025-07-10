import { useQuery } from "@tanstack/react-query";
import { getInquiries } from "../actions/get-inquiries";
import { getAgentsInquiries } from "../actions/get-agents-inquiries";

export const useInquiries = () => {
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: getInquiries,
  });
};

export const useAgentsInquiries = (agentId: string) => {
  return useQuery({
    queryKey: ["agents-inquiries", agentId],
    queryFn: () => getAgentsInquiries(agentId),
    enabled: !!agentId,
  });
};