import apiReq from "@/services/apiReq";
import type { ErrorResponse } from "@schemas/course";
import type { Exam, ExamType } from "@schemas/Exam";
import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "../auth/useGetMe";

export const useGetExam = (examId: number, exam_type: ExamType) => {
  const { me } = useGetMe();
  const {
    data: exam,
    isPending,
    error,
  } = useQuery<Exam | ErrorResponse>({
    queryKey: ["exam", examId, exam_type, me?.id],
    queryFn: async () => {
      return await apiReq("GET", `/exam/${examId}?exam_type=${exam_type}`);
    },
    retry: false,
    refetchOnMount: "always",
  });

  return { exam, isPending, error };
};
