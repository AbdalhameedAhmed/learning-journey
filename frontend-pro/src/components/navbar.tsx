import { useGetMe } from "@/hooks/auth/useGetMe";
import { useLogout } from "@/hooks/auth/useLogout";
import { CircleUserRound, Home, LogOut, Search } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Spinner from "./Spinner";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const { me, isPending } = useGetMe();
  const { logout } = useLogout();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", search);
  };

  if (isPending) return <Spinner />;

  return (
    <div className="w-full">
      <header className="bg-primary relative flex items-center justify-between px-8 py-2 text-white">
        <form
          onSubmit={handleSearch}
          className="absolute left-1/2 flex -translate-x-1/2 transform items-center overflow-hidden rounded-2xl border-2 border-white bg-white"
        >
          <input
            type="text"
            placeholder="بحث"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 text-black outline-none"
          />
          <button type="submit" className="bg-primary p-2">
            <Search className="h-4 w-4 text-white" />
          </button>
        </form>
        <div className="text-right">
          <h1 className="text-lg font-bold">رحلة تعلّم</h1>
          <p className="text-xs">Learn Journey</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile">
            <div className="flex items-center gap-2">
              {me?.profile_picture ? (
                <img
                  src={me?.profile_picture}
                  alt="profile"
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <CircleUserRound className="h-8 w-8 text-white" />
              )}
              <p>{me?.first_name}</p>
            </div>
          </Link>

          <button className="cursor-pointer" onClick={() => logout()}>
            <LogOut className="h-6 w-6 text-white" />
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="text-text dark:text-dark-text mt-8 flex items-center justify-center gap-12 text-sm font-bold">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? "bg-primary flex items-center gap-1 rounded-md px-3 py-1"
              : "flex items-center gap-1 px-3 py-1 hover:text-orange-600"
          }
        >
          <Home className="text-text dark:text-dark-text h-5 w-5" />
          الصفحة الرئيسية
        </NavLink>
        <NavLink
          to="/instructions"
          className={({ isActive }) =>
            isActive
              ? "bg-primary rounded-md px-3 py-1 text-white"
              : "hover:text-orange-600"
          }
        >
          التعليمات
        </NavLink>
        <NavLink
          to="/goals"
          className={({ isActive }) =>
            isActive
              ? "bg-primary rounded-md px-3 py-1 text-white"
              : "hover:text-orange-600"
          }
        >
          الأهداف
        </NavLink>

        <NavLink
          to="/content-map"
          className={({ isActive }) =>
            isActive
              ? "bg-primary rounded-md px-3 py-1 text-white"
              : "hover:text-orange-600"
          }
        >
          خريطة المحتوى
        </NavLink>
        <NavLink
          to="/course/1"
          className={({ isActive }) =>
            isActive
              ? "bg-primary rounded-md px-3 py-1 text-white"
              : "hover:text-orange-600"
          }
        >
          الكورس
        </NavLink>
      </nav>
    </div>
  );
}
