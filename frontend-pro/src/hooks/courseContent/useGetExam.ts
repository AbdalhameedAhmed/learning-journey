import apiReq from "@/services/apiReq";
import type { ErrorResponse } from "@schemas/course";
import type { Exam, ExamType } from "@schemas/Exam";
import { useQuery } from "@tanstack/react-query";

export const useGetExam = (examId: number, exam_type: ExamType) => {
  const {
    data: exam,
    isPending,
    error,
  } = useQuery<Exam | ErrorResponse>({
    queryKey: ["exam", examId],
    queryFn: async () => {
      return await apiReq("GET", `/exam/${examId}?exam_type=${exam_type}`);
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { exam, isPending, error };
};
