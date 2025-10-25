import logo from "@/assets/logo.svg";
import { useGetMe } from "@/hooks/auth/useGetMe";
import { useLogout } from "@/hooks/auth/useLogout";
import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";
import clsx from "clsx";
import { CircleUserRound, Lock, LogOut, Menu, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

interface SearchResult {
  type: "lesson" | "activity";
  id: number;
  name: string;
  moduleName: string;
  courseId: number;
  isAvailable: boolean;
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

  const progressData = me?.current_progress_data;
  const nextAvailableLessonId = progressData?.next_available_lesson_id;
  const isFinalExamAvailable = progressData?.is_final_exam_available;
  const courseCompleted = progressData?.course_completed;

  const getNextAvailableModuleId = () => {
    if (!courseDetails || typeof nextAvailableLessonId != "number") return null;

    for (const module of courseDetails.modules) {
      // Check if this module contains the next available lesson
      const hasNextLesson = module.lessons.some(
        (lesson) => lesson.id === nextAvailableLessonId,
      );
      if (hasNextLesson) {
        return module.id;
      }

      // Check if this module has any lessons that come after the next available lesson
      // This handles the case where we need to find which module should be unlocked next
      const hasFutureLessons = module.lessons.some(
        (lesson) => lesson.id >= nextAvailableLessonId,
      );
      if (hasFutureLessons) {
        return module.id;
      }
    }

    return null;
  };

  const nextAvailableModuleId = getNextAvailableModuleId();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const searchResults = useMemo((): SearchResult[] => {
    if (!search.trim() || !courseDetails) return [];

    const results: SearchResult[] = [];
    const searchTerm = search.toLowerCase();

    courseDetails.modules.forEach((module) => {
      const isModuleAvailable =
        isFinalExamAvailable ||
        courseCompleted ||
        (typeof nextAvailableModuleId === "number" &&
          module.id <= nextAvailableModuleId);

      module.lessons.forEach((lesson) => {
        const isLessonAvailable =
          (isModuleAvailable && isFinalExamAvailable) ||
          courseCompleted ||
          (typeof nextAvailableLessonId === "number" &&
            lesson.id <= nextAvailableLessonId);

        const isActivityAvailable =
          me?.current_progress_data?.next_available_activity_id &&
          lesson.activity_id &&
          me?.current_progress_data?.next_available_activity_id <=
            lesson.activity_id;
        if (lesson.name.toLowerCase().includes(searchTerm)) {
          results.push({
            type: "lesson",
            id: lesson.id,
            name: lesson.name,
            moduleName: module.name,
            courseId: courseDetails.id,
            isAvailable: isLessonAvailable,
          });
        }
        if (lesson.activity?.name.toLowerCase().includes(searchTerm)) {
          results.push({
            type: "activity",
            id: lesson.activity_id!,
            name: lesson.activity.name,
            moduleName: module.name,
            courseId: courseDetails.id,
            isAvailable: !!isActivityAvailable,
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
        <div className="w-34">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>

        {/* NAVIGATIONS */}
        <div className="dark:text-dark-text text-text-small hidden items-center justify-center gap-6 font-bold text-white lg:flex">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "text-text flex items-center" : "flex items-center"
            }
          >
            <span>الرئيسية</span>
          </NavLink>
          <NavLink
            to="/instructions"
            className={({ isActive }) =>
              isActive ? "text-text flex items-center" : "flex items-center"
            }
          >
            <span>التعليمات</span>
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
            <span>المحتوى</span>
          </NavLink>
          <NavLink
            to="/course/1"
            className={({ isActive }) =>
              isActive ? "text-text flex items-center" : "flex items-center"
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

          {/* search results */}
          {showResults && search.trim() && (
            <div className="search-results absolute top-full mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-slate-800">
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((result) => {
                    return (
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
                              navigate(
                                `/course/${result.courseId}?lessonId=${String(result.id)}`,
                              );
                              setSearch("");
                              setShowResults(false);
                            }
                          }}
                        >
                          <div>
                            <p className="font-semibold">{result.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {result.type === "lesson" ? "درس" : "نشاط"} في{" "}
                              {result.moduleName}
                            </p>
                          </div>
                          {!result.isAvailable && (
                            <Lock size={16} className="text-primary" />
                          )}
                        </button>
                      </li>
                    );
                  })}
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
