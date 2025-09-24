import apiReq from "@/services/apiReq";
import type { IUser } from "@schemas/User";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = () => {
  const {
    data: me,
    isPending,
    error,
  } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: async () => {
      return await apiReq("GET", "/auth/me");
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { me, isPending, error };
};
