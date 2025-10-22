import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateProfile,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: FormData) =>
      await apiReq("PATCH", "/auth/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) => {
      console.log(error);
      toast("حدث خطأ أثناء تحديث الملف الشخصي", {
        type: "error",
      });
    },
  });

  return { updateProfile, isPending, error };
};
