import publicApiReq from "@/services/publicApiReq";
import type { UserRole } from "@schemas/User";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface IRegisterValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: UserRole;
}

export function useRegister() {
  const navigate = useNavigate();

  const { mutate: register, isPending } = useMutation({
    mutationFn: async (values: IRegisterValues) => {
      return await publicApiReq("POST", "/auth/register", values);
    },
    onSuccess: () => {
      toast("تم التسجيل بنجاح", { type: "success" });
      navigate("/login");
    },
    onError: (err) => {
      toast("حدث خطأ أثناء التسجيل", { type: "error" });
      console.log("error in useRegister", err);
    },
  });

  return { register, isPending };
}
