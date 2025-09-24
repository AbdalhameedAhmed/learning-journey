import apiReq from "@/services/apiReq";
import type { Note } from "@schemas/course";
import { useQuery } from "@tanstack/react-query";

export const useGetNotes = (lessonId: number | undefined) => {
  const {
    data: notes,
    isPending,
    error,
  } = useQuery<Note[]>({
    queryKey: ["notes", lessonId],
    queryFn: async () => {
      return await apiReq("GET", `/notes/${lessonId}`);
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { notes, isPending, error };
};
