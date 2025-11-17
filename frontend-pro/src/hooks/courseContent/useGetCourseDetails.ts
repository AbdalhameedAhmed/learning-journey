import apiReq from "@/services/apiReq";
import type { Course } from "@schemas/course";
import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "../auth/useGetMe";

export const useGetCourseDetails = (courseId: string | undefined) => {
  const { me } = useGetMe();
  const {
    data: courseDetails,
    isPending,
    error,
  } = useQuery<Course>({
    queryKey: ["courseDetails", courseId, me?.id],
    queryFn: async () => {
      return await apiReq("GET", `/courses/${courseId}`);
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { courseDetails, isPending, error };
};
