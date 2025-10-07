import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "../auth/useGetMe";
import apiReq from "@/services/apiReq";
import { type Favorite } from "@schemas/course";

export const useGetFavorites = () => {
  const { me } = useGetMe();

  const {
    data: favorites,
    isPending,
    error,
  } = useQuery<Favorite[]>({
    queryKey: ["favorites", me?.id],
    queryFn: async () => {
      return await apiReq("GET", "/favorites");
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return { favorites, isPending, error };
};
