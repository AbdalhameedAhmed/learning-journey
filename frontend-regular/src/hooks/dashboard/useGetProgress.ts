import apiReq from "@/services/apiReq";
import type { ProgressData } from "@schemas/progress";
import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "../auth/useGetMe";

export const useGetProgress = () => {
  const { me } = useGetMe();
  const {
    data: progress,
    isPending,
    error,
  } = useQuery<ProgressData>({
    queryKey: ["progress", me?.id],
    queryFn: async () => {
      return await apiReq("GET", "/admin/progress");
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { progress, isPending, error };
};
