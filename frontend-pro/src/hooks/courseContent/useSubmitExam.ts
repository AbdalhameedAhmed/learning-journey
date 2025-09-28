import apiReq from "@/services/apiReq";
import type {
  ExamSubmissionRequestBody,
  ExamSubmissionResult,
} from "@schemas/Exam";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSubmitExam = (
  onSuccessCallback: (data: ExamSubmissionResult) => void,
) => {
  const queryClient = useQueryClient();

  const { mutate: submit, isPending } = useMutation({
    mutationFn: async (values: ExamSubmissionRequestBody) =>
      await apiReq("POST", "/exam/submit", values),
    onSuccess: (res) => {
      onSuccessCallback(res);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) => {
      console.error("Error submitting exam:", error);
    },
  });

  return { submit, isPending };
};
