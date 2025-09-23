import type { AddNote } from "@schemas/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiReq from "../../services/apiReq";

export const useAddNote = (lessonId: number) => {
  const queryClient = useQueryClient();
  const { mutate: addNote, isPending } = useMutation({
    mutationFn: async (values: AddNote) => {
      return await apiReq("POST", `/notes`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", lessonId] });
    },
    onError: (err) => {
      console.log(err);
      toast(err.message, { type: "error" });
    },
  });

  return { addNote, isPending };
};
