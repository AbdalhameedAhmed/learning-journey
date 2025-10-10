import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useDeleteNote(lessonId: number) {
  const queryClient = useQueryClient();

  const { mutate: deleteNote, isPending } = useMutation({
    mutationFn: async (noteId: number) => {
      return await apiReq("DELETE", `/notes/${noteId}`);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["notes", lessonId] });
      toast("تم حذف الملاحظة بنجاح", { type: "success" });
      console.log(res);
    },
  });

  return { deleteNote, isPending };
}
