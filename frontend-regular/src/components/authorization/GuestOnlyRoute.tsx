import { useGetMe } from "@/hooks/auth/useGetMe";
import { getHomePath } from "@/utils/getHomePath";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../Spinner";

export default function GuestOnlyRoute() {
  const { me, isPending } = useGetMe();

  if (isPending) return <Spinner />;

  if (me) return <Navigate to={getHomePath(me.role)} replace />;

  return <Outlet />;
}
