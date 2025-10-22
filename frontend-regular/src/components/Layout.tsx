import { Outlet } from "react-router";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center dark:bg-slate-900">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
