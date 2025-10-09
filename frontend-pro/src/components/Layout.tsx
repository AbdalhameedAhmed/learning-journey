import { Outlet } from "react-router";
import Navbar from "./navbar";

const Layout = () => {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center gap-4 dark:bg-slate-900">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
