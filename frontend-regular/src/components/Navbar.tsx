import logo from "@/assets/logo.svg";
import { courseContentWithModules } from "@/constants/courseContent";
import { useGetMe } from "@/hooks/auth/useGetMe";
import { useLogout } from "@/hooks/auth/useLogout";
import clsx from "clsx";
import { CircleUserRound, Lock, LogOut, Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

interface SearchResult {
  type: "lesson" | "activity" | "exam";
  id: number;
  name: string;
  moduleName: string;
  courseId: number;
  isAvailable: boolean;
}

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { me, isPending } = useGetMe();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);
  const searchMenu = useRef<HTMLDivElement>(null);

  const currentProgress = me?.current_progress_data?.current_progress;

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const searchResults = useMemo((): SearchResult[] => {
    if (!search.trim() || !courseContentWithModules) return [];

    const results: SearchResult[] = [];
    const searchTerm = search.toLowerCase();

    const modulesToSearch = courseContentWithModules;

    modulesToSearch.forEach((module) => {
      module.items.forEach((item) => {
        if (
          item.name.toLowerCase().includes(searchTerm) &&
          (item.type === "lesson" || item.type === "activity")
        ) {
          results.push({
            type: item.type,
            id: item.id,
            name: item.name,
            moduleName: module.name,
            courseId: 1,
            isAvailable: !!(currentProgress && item.order <= currentProgress),
          });
        }
        if (
          item.name.toLowerCase().includes(searchTerm) &&
          item.type === "exam"
        ) {
          results.push({
            type: "exam",
            id: item.id,
            name: item.name,
            moduleName: module.name,
            courseId: 1,
            isAvailable: !!(currentProgress && item.order <= currentProgress),
          });
        }
      });
    });
    return results;
  }, [search, currentProgress]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchMenu.current &&
        !searchMenu.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) return <Spinner />;

  return (
    <>
      <nav className="bg-primary dark:bg-dark-primary relative flex w-full items-center justify-between px-6 py-3 text-white">
        {/* LOGO */}
        <div className="w-34">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>

        {/* NAVIGATIONS */}
        <div className="dark:text-dark-text text-text-tiny hidden items-center justify-center gap-6 font-bold whitespace-nowrap text-white lg:flex">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "text-text flex items-center" : "flex items-center"
            }
          >
            <span>الصفحة الرئيسية</span>
          </NavLink>
          <NavLink
            to="/instructions"
            className={({ isActive }) =>
              isActive ? "text-text flex items-center" : "flex items-center"
            }
          >
            <span>الإرشادات</span>
          </NavLink>
          <NavLink
            to="/goals"
            className={({ isActive }) =>
              isActive ? "text-text flex items-center" : "flex items-center"
            }
          >
            <span>الأهداف</span>
          </NavLink>

          <NavLink
            to="/content-map"
            className={({ isActive }) =>
              isActive ? "text-text flex items-center" : "flex items-center"
            }
          >
            <span>الخريطة الدراسية</span>
          </NavLink>
          <NavLink
            to="/course/1"
            className={({ isActive }) =>
              isActive ? "text-text flex items-center" : "flex items-center"
            }
          >
            <span>المقرر</span>
          </NavLink>
          <NavLink
            to="/contact-us"
            className={({ isActive }) =>
              isActive ? "text-text flex items-center" : "flex items-center"
            }
          >
            <span>تواصل معنا</span>
          </NavLink>
        </div>

        <div
          ref={searchContainerRef}
          className="relative z-20 flex items-center"
        >
          <div
            ref={searchMenu}
            className="relative flex transform items-center rounded-2xl border-2 border-white bg-white shadow-xl"
          >
            <div className="flex transform items-center rounded-2xl border-2 border-white bg-white shadow-xl">
              <input
                type="text"
                placeholder="بحث"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (!showResults) setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="w-40 px-3 py-1 text-black outline-none"
              />
            </div>

            {/* search results menu */}
            {showResults && search.trim() && (
              <div className="search-results absolute top-full mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-slate-800">
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((result) => (
                      <li
                        key={`${result.type}-${result.id}`}
                        className={clsx("text-text dark:text-dark-text", {
                          "hover:bg-gray-100 dark:hover:bg-slate-700":
                            result.isAvailable,
                        })}
                      >
                        <button
                          className="flex w-full items-center justify-between gap-2 px-4 py-2 text-right"
                          onClick={() => {
                            if (result.isAvailable) {
                              if (
                                result.type === "lesson" ||
                                result.type === "activity"
                              ) {
                                navigate(
                                  `/course/${result.courseId}?lessonId=${String(result.id)}`,
                                );
                              } else if (result.type === "exam") {
                                navigate(
                                  `/course/${result.courseId}?examId=${String(result.id)}`,
                                );
                              }
                              setSearch("");
                              setShowResults(false);
                            }
                          }}
                        >
                          <div>
                            <p className="font-semibold">{result.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {result.type === "lesson"
                                ? "درس "
                                : result.type === "activity"
                                  ? "نشاط "
                                  : "اختبار "}
                              في {result.moduleName}
                            </p>
                          </div>
                          {!result.isAvailable && (
                            <Lock size={16} className="text-primary" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                    لا توجد نتائج
                  </p>
                )}
              </div>
            )}
          </div>
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
              <p className="text-text-tiny">{me?.first_name}</p>
            </div>
          </Link>

          <button
            className="hidden cursor-pointer lg:flex"
            onClick={() => logout()}
          >
            <LogOut className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Hamburger Button */}
        <button className="cursor-pointer p-2 lg:hidden" onClick={toggleDrawer}>
          {isDrawerOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </nav>

      {/* Top Drawer for mobile screens */}
      <div
        className={`bg-primary/90 fixed top-0 right-0 left-0 z-50 transform shadow-lg transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-y-0" : "-translate-y-full"} lg:hidden`}
      >
        <div className="px-6 pt-16 pb-6">
          {/* Close Button */}
          <button
            className="absolute top-4 left-4 cursor-pointer p-2 text-white"
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
                  ? "text-primary rounded-md bg-white px-3 py-3 font-bold"
                  : "hover:text-primary flex items-center gap-1 rounded-md px-3 py-3 font-bold text-white transition-colors hover:bg-white"
              }
            >
              <span>الصفحة الرئيسية</span>
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
              <span>الإرشادات</span>
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
              <span>الخريطة الدراسية</span>
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
              <span>المقرر</span>
            </NavLink>
            <NavLink
              to="/contact-us"
              onClick={closeDrawer}
              className={({ isActive }) =>
                isActive
                  ? "text-primary rounded-md bg-white px-3 py-3 font-bold"
                  : "hover:text-primary rounded-md px-3 py-3 font-bold text-white transition-colors hover:bg-white"
              }
            >
              <span>تواصل معنا</span>
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
