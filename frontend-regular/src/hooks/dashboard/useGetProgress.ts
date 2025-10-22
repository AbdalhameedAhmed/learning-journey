import apiReq from "@/services/apiReq";
import type { ProgressData } from "@schemas/progress";
import { useQuery } from "@tanstack/react-query";

export const useGetProgress = () => {
  const {
    data: progress,
    isPending,
    error,
  } = useQuery<ProgressData>({
    queryKey: ["progress"],
    queryFn: async () => {
      return await apiReq("GET", "/admin/progress");
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { progress, isPending, error };
};
