import apiReq from "@/services/apiReq";
import { getTokens, removeTokens } from "@/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { refreshToken } = getTokens();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      return await apiReq("POST", "/auth/logout", {
        refresh_token: refreshToken,
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      removeTokens();
      navigate("/", { replace: true });
    },
    onError: (err) => {
      console.log(err);
      toast(err.message, { type: "error" });
    },
  });

  return { logout };
}
