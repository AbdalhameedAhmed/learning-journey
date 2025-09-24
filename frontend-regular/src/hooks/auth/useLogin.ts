import publicApiReq from "@/services/publicApiReq";
import { getHomePath } from "@/utils/getHomePath";
import { setAccessToken, setRefreshToken } from "@/utils/helpers";
import type { UserRole } from "@schemas/User";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ILoginValues {
  email: string;
  password: string;
  role: UserRole;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (values: ILoginValues) => {
      return await publicApiReq("POST", "/auth/login", values);
    },
    onSuccess: (res) => {
      const user = res.user;
      const tokens = res.tokens;

      queryClient.setQueryData(["me"], user);
      setAccessToken(tokens.access_token);
      setRefreshToken(tokens.refresh_token);

      navigate(getHomePath(user.role), { replace: true });
    },
    onError: (err) => {
      console.log("error in useLogin", err);
      toast("خطأ في تسجيل الدخول", { type: "error" });
    },
  });

  return { login, isPending };
}
