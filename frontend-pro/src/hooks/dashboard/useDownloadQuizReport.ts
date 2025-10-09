import apiReq from "@/services/apiReq";

import { useMutation } from "@tanstack/react-query";

export const useDownloadQuizReport = () => {
  const { mutate: downloadQuizReport, isPending } = useMutation({
    mutationFn: async (quizId: number) =>
      await apiReq("GET", `/admin/quiz-report/${quizId}`),
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (error) => {
      console.error("Error submitting exam:", error);
    },
  });

  return { downloadQuizReport, isPending };
};
