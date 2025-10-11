import apiReq from "@/services/apiReq";
import type { Note } from "@schemas/course";
import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "../auth/useGetMe";

export const useGetNotes = (lessonId: number | undefined) => {
  const { me } = useGetMe();

  const {
    data: notes,
    isPending,
    error,
  } = useQuery<Note[]>({
    queryKey: ["notes", lessonId, me?.id],
    queryFn: async () => {
      return await apiReq("GET", `/notes/${lessonId}`);
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { notes, isPending, error };
};
