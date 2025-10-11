import type { ExamHeader, LessonHeader, Module } from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import clsx from "clsx";
import { Heart, Lock } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import HeaderButton from "./HeaderButton";
import { useGetFavorites } from "@/hooks/courseContent/useGetFavorites";

type ModuleMenuProps = {
  module: Module;
  activeLesson: LessonHeader | undefined;
  setActiveLessonHandler: (lesson: LessonHeader) => void;
  activeExam: ExamHeader | undefined;
  setActiveExamHandler: (exam: ExamHeader, examType: ExamType) => void;
  openedModule: number | undefined;
  setOpendModule: Dispatch<SetStateAction<number | undefined>>;
  nextAvailableModuleId?: number | null;
  nextAvailableExamId?: number | null;
};

export default function ModuleMenu({
  module,
  activeLesson,
  setActiveLessonHandler,
  activeExam,
  setActiveExamHandler,
  openedModule,
  setOpendModule,
  nextAvailableModuleId,
}: ModuleMenuProps) {
  const { favorites } = useGetFavorites();
  const isModuleLocked =
    nextAvailableModuleId === null ||
    (typeof nextAvailableModuleId === "number" &&
      module.id > nextAvailableModuleId);

  const isLessonFavorited = (lessonId: number) => {
    return favorites?.some((fav) => fav.lesson_id === lessonId) || false;
  };

  // Handler for the module title button
  const handleHeaderClick = () => {
    if (!isModuleLocked) {
      setOpendModule(module.id);
    }
  };

  return (
    <div>
      <HeaderButton
        onClick={handleHeaderClick}
        title={module.name}
        disabled={isModuleLocked}
      ></HeaderButton>
      <div
        className={clsx(
          "flex max-h-[0px] w-full flex-col gap-2 overflow-hidden px-6 transition-all duration-300",
          {
            "mt-2 max-h-[1000px]":
              !isModuleLocked && openedModule === module.id,
          },
        )}
      >
        {module.lessons.map((lesson) => {
          const isLessonLocked = isModuleLocked;
          const isFavorited = isLessonFavorited(lesson.id);

          const handleLessonClick = () => {
            if (!isLessonLocked) {
              setActiveLessonHandler(lesson);
            }
          };

          return (
            <div key={lesson.id} className="relative">
              <p
                className={clsx(
                  "border-primary dark:border-dark-primary text-text-tiny text-text dark:text-dark-text flex items-center justify-between rounded-2xl border px-4 py-1",
                  {
                    "cursor-pointer": !isLessonLocked,
                    "cursor-not-allowed opacity-50": isLessonLocked,
                    "bg-primary dark:bg-dark-primary text-white":
                      activeLesson?.id === lesson.id && !isLessonLocked,
                  },
                )}
                onClick={handleLessonClick}
              >
                <span className="flex-1 text-center">{lesson.name}</span>
                {isLessonLocked && <Lock size={14} className="text-gray-400" />}
              </p>

              {isFavorited && (
                <div className="absolute top-1/2 left-2 -translate-y-1/2">
                  <Heart
                    size={14}
                    className="fill-red-500 text-red-500 drop-shadow-sm"
                  />
                </div>
              )}
            </div>
          );
        })}

        {module.quizzes.map((quiz) => {
          const isQuizLocked = isModuleLocked;

          const handleQuizClick = () => {
            if (!isQuizLocked) {
              setActiveExamHandler(quiz, ExamType.QUIZ);
            }
          };

          return (
            <p
              key={quiz.id}
              className={clsx(
                "border-primary dark:border-dark-primary text-textdark:text-dark-text text-text-tiny dark:text-dark-text flex items-center justify-between rounded-2xl border px-4 py-1",
                {
                  "cursor-pointer": !isQuizLocked,
                  "cursor-not-allowed opacity-50": isQuizLocked,
                  "bg-primary dark:bg-dark-primary text-white":
                    activeExam?.id === quiz.id && !isQuizLocked,
                },
              )}
              onClick={handleQuizClick}
            >
              <span className="flex-1 text-center">اختبار</span>
              {isQuizLocked && <Lock size={14} className="text-gray-400" />}
            </p>
          );
        })}
      </div>
    </div>
  );
}
