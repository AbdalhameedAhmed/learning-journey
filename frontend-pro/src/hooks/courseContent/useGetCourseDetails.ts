import { useQuery } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { Course } from "@schemas/course";

export const useGetCourseDetails = (courseId: string | undefined) => {
  const {
    data: courseDetails,
    isPending,
    error,
  } = useQuery<Course>({
    queryKey: ["courseDetails", courseId],
    queryFn: async () => {
      return await apiReq("GET", `/courses/${courseId}`);
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { courseDetails, isPending, error };
};
