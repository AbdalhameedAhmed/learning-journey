import apiReq from "@/services/apiReq";
import type { ErrorResponse, LessonResponse } from "@schemas/course";
import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "../auth/useGetMe";

export const useGetLesson = (lesson_id: number) => {
  const { me } = useGetMe();
  
  const {
    data: lesson,
    isPending,
    error,
  } = useQuery<LessonResponse | ErrorResponse>({
    queryKey: ["lesson", lesson_id, me?.id],
    queryFn: async () => {
      return await apiReq("GET", `/courses/lesson/${lesson_id}`);
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { lesson, isPending, error };
};
