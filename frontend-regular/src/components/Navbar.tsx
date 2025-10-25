import { useGetMe } from "@/hooks/auth/useGetMe";
import { useLogout } from "@/hooks/auth/useLogout";
import { CircleUserRound, LogOut, Menu, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";

interface SearchResult {
  type: "lesson" | "activity";
  id: number;
  name: string;
  moduleName: string;
  courseId: number;
}

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { courseDetails, isPending: isCourseDetailsPending } =
    useGetCourseDetails("1");
  const { me, isPending } = useGetMe();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const searchResults = useMemo((): SearchResult[] => {
    if (!search.trim() || !courseDetails) return [];

    const results: SearchResult[] = [];
    const searchTerm = search.toLowerCase();

    courseDetails.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        if (lesson.name.toLowerCase().includes(searchTerm)) {
          results.push({
            type: "lesson",
            id: lesson.id,
            name: lesson.name,
            moduleName: module.name,
            courseId: courseDetails.id,
          });
        }
        if (lesson.activity?.name.toLowerCase().includes(searchTerm)) {
          results.push({
            type: "activity",
            id: lesson.activity_id!,
            name: lesson.activity.name,
            moduleName: module.name,
            courseId: courseDetails.id,
          });
        }
      });
    });
    console.log(results, "search start");
    return results;
  }, [search, courseDetails]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  if (isPending) return <Spinner />;

  return (
    <>
      <nav className="bg-primary dark:bg-dark-primary relative flex w-full items-center justify-between px-8 py-3 text-white">
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
            <span>المحتوى</span>
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

        <div ref={searchContainerRef} className="relative z-20">
          <div className="flex transform items-center overflow-hidden rounded-2xl border-2 border-white bg-white shadow-xl">
            <input
              type="text"
              placeholder="بحث"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              className="px-3 py-1 text-black outline-none"
            />
            <div className="bg-primary dark:bg-dark-primary p-2">
              {isCourseDetailsPending ? (
                <Spinner size="small" />
              ) : (
                <Search className="h-4 w-4 text-white" />
              )}
            </div>
          </div>

          {showResults && search.trim() && (
            <div className="search-results absolute top-full mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-slate-800">
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((result) => (
                    <li
                      key={`${result.type}-${result.id}`}
                      className="text-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      <button
                        className="w-full px-4 py-2 text-right"
                        onClick={() => {
                          const params =
                            result.type === "lesson"
                              ? { lessonId: String(result.id) }
                              : { examId: String(result.id) };
                          navigate(`/course/${result.courseId}`, {
                            state: params,
                          });
                          setSearch("");
                          setShowResults(false);
                        }}
                      >
                        <p className="font-semibold">{result.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {result.type === "lesson" ? "درس" : "نشاط"} في{" "}
                          {result.moduleName}
                        </p>
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
