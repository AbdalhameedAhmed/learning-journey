import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetMe } from "../auth/useGetMe";

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { me } = useGetMe();

  const {
    mutate: toggleFavorite,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (lessonId: number) =>
      await apiReq("POST", `/favorites/${lessonId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", me?.id] });
    },
  });

  return { toggleFavorite, isPending, error };
};
