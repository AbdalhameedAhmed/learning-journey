import { useGetMe } from "@/hooks/auth/useGetMe";
import { useLogout } from "@/hooks/auth/useLogout";
import { CircleUserRound, LogOut, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Spinner from "./Spinner";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { me, isPending } = useGetMe();
  const { logout } = useLogout();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  if (isPending) return <Spinner />;

  return (
    <>
      <nav className="bg-primary relative flex w-full items-center justify-between px-8 py-3 text-white">
        {/* LOGO */}
        <div className="text-right">
          <h1 className="text-lg font-bold">رحلة تعلّم</h1>
          <p className="text-xs">Learn Journey</p>
        </div>

        {/* NAVIGATIONS */}
        <div className="text-text dark:text-dark-text text-text-small hidden items-center justify-center gap-6 font-bold lg:flex">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "flex items-center text-white" : "flex items-center"
            }
          >
            <span>الرئيسية</span>
          </NavLink>
          <NavLink
            to="/instructions"
            className={({ isActive }) =>
              isActive ? "flex items-center text-white" : "flex items-center"
            }
          >
            <span>التعليمات</span>
          </NavLink>
          <NavLink
            to="/goals"
            className={({ isActive }) =>
              isActive ? "flex items-center text-white" : "flex items-center"
            }
          >
            <span>الأهداف</span>
          </NavLink>

          <NavLink
            to="/content-map"
            className={({ isActive }) =>
              isActive ? "flex items-center text-white" : "flex items-center"
            }
          >
            <span>خريطة المحتوى</span>
          </NavLink>
          <NavLink
            to="/course/1"
            className={({ isActive }) =>
              isActive ? "flex items-center text-white" : "flex items-center"
            }
          >
            <span>الكورس</span>
          </NavLink>
        </div>

        <div className="flex transform items-center overflow-hidden rounded-2xl border-2 border-white bg-white shadow-xl">
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
        </div>

        {/* USER */}
        <div className="hidden items-center gap-4 lg:flex">
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
              <p className="text-text-small">{me?.first_name}</p>
            </div>
          </Link>

          <button
            className="hidden cursor-pointer lg:flex"
            onClick={() => logout()}
          >
            <LogOut className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Hamburger Button - Hidden on md screens and up */}
        <button className="p-2 lg:hidden" onClick={toggleDrawer}>
          {isDrawerOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </nav>

      {/* Top Drawer for mobile screens */}
      <div
        className={`bg-primary fixed top-0 right-0 left-0 z-50 transform shadow-lg transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-y-0" : "-translate-y-full"} lg:hidden`}
      >
        <div className="px-6 pt-16 pb-6">
          {/* Close Button */}
          <button
            className="absolute top-4 left-4 p-2 text-white"
            onClick={closeDrawer}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Links */}
          <div className="mb-6 flex flex-col space-y-4">
            <NavLink
              to="/home"
              onClick={closeDrawer}
              className={({ isActive }) =>
                isActive
                  ? "text-primary flex items-center justify-center gap-2 rounded-md bg-white px-3 py-3 font-bold"
                  : "hover:text-primary flex items-center gap-1 rounded-md px-3 py-3 font-bold text-white transition-colors hover:bg-white"
              }
            >
              <span>الرئيسية</span>
            </NavLink>
            <NavLink
              to="/instructions"
              onClick={closeDrawer}
              className={({ isActive }) =>
                isActive
                  ? "text-primary rounded-md bg-white px-3 py-3 font-bold"
                  : "hover:text-primary rounded-md px-3 py-3 font-bold text-white transition-colors hover:bg-white"
              }
            >
              <span>التعليمات</span>
            </NavLink>
            <NavLink
              to="/goals"
              onClick={closeDrawer}
              className={({ isActive }) =>
                isActive
                  ? "text-primary rounded-md bg-white px-3 py-3 font-bold"
                  : "hover:text-primary rounded-md px-3 py-3 font-bold text-white transition-colors hover:bg-white"
              }
            >
              <span>الأهداف</span>
            </NavLink>
            <NavLink
              to="/content-map"
              onClick={closeDrawer}
              className={({ isActive }) =>
                isActive
                  ? "text-primary rounded-md bg-white px-3 py-3 font-bold"
                  : "hover:text-primary rounded-md px-3 py-3 font-bold text-white transition-colors hover:bg-white"
              }
            >
              <span>خريطة المحتوى</span>
            </NavLink>
            <NavLink
              to="/course/1"
              onClick={closeDrawer}
              className={({ isActive }) =>
                isActive
                  ? "text-primary rounded-md bg-white px-3 py-3 font-bold"
                  : "hover:text-primary rounded-md px-3 py-3 font-bold text-white transition-colors hover:bg-white"
              }
            >
              <span>الكورس</span>
            </NavLink>
          </div>

          {/* User Info and Logout */}
          <div className="border-t border-white pt-4">
            <div className="flex items-center justify-between">
              <Link
                to="/profile"
                onClick={closeDrawer}
                className="flex items-center gap-2 text-white"
              >
                {me?.profile_picture ? (
                  <img
                    src={me?.profile_picture}
                    alt="profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <CircleUserRound className="h-8 w-8 text-white" />
                )}
                <p className="text-text-small font-bold">{me?.first_name}</p>
              </Link>

              <button
                className="hover:text-primary flex cursor-pointer items-center gap-2 rounded-md p-2 font-bold text-white transition-colors hover:bg-white"
                onClick={() => {
                  closeDrawer();
                  logout();
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-700 opacity-50 blur-lg lg:hidden"
          onClick={closeDrawer}
        />
      )}
    </>
  );
}
