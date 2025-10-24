import type { ExamHeader, LessonHeader, Module } from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import clsx from "clsx";
import { Lock } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import HeaderButton from "./HeaderButton";

type ModulTabProps = {
  module: Module;
  activeLesson: LessonHeader | undefined;
  setActiveLessonHandler: (lesson: LessonHeader) => void;
  activeExam: ExamHeader | undefined;
  setActiveExamHandler: (exam: ExamHeader, examType: ExamType) => void;
  openedModule: number | undefined;
  setOpendModule: Dispatch<SetStateAction<number | undefined>>;
  nextAvailableLessonId?: number | null;
  nextAvailableModuleId?: number | null;
  nextAvailableExamId?: number | null;
  isFinalExamAvailable?: boolean;
  courseCompleted?: boolean;
};

export default function ModuleTab({
  module,
  activeLesson,
  setActiveLessonHandler,
  activeExam,
  setActiveExamHandler,
  openedModule,
  setOpendModule,
  nextAvailableLessonId,
  nextAvailableModuleId,
  nextAvailableExamId,
  isFinalExamAvailable,
  courseCompleted,
}: ModulTabProps) {
  // Module is locked if it comes after the next available module
  const isModuleAvailable =
    isFinalExamAvailable ||
    courseCompleted ||
    (typeof nextAvailableModuleId === "number" &&
      module.id <= nextAvailableModuleId);

  // Handler for the module title button
  console.log(nextAvailableModuleId, "⛰️⛰️⛰️⛰️");

  const handleHeaderClick = () => {
    if (isModuleAvailable) {
      setOpendModule(module.id);
    }
  };

  return (
    <div>
      <HeaderButton
        onClick={handleHeaderClick}
        title={module.name}
        disabled={!isModuleAvailable}
      ></HeaderButton>
      <div
        className={clsx(
          "flex max-h-[0px] w-full flex-col gap-2 overflow-hidden px-6 transition-all duration-300",
          {
            "mt-2 max-h-[1000px]":
              isModuleAvailable && openedModule === module.id,
          },
        )}
      >
        {module.lessons.map((lesson) => {
          // Lesson is locked if it comes after the next available lesson
          // OR if the module itself is locked
          const isLessonAvailable =
            (isModuleAvailable && isFinalExamAvailable) ||
            courseCompleted ||
            (typeof nextAvailableLessonId === "number" &&
              lesson.id <= nextAvailableLessonId);

          const handleLessonClick = () => {
            if (isLessonAvailable) {
              setActiveLessonHandler(lesson);
            }
          };

          return (
            <div key={lesson.id} className="relative">
              <p
                className={clsx(
                  "border-primary dark:border-dark-primary text-text-tiny text-text dark:text-dark-text flex items-center justify-between rounded-2xl border px-4 py-1",
                  {
                    "cursor-pointer": isLessonAvailable,
                    "cursor-not-allowed opacity-50": !isLessonAvailable,
                    "bg-primary dark:bg-dark-primary text-white":
                      activeLesson?.id === lesson.id && isLessonAvailable,
                  },
                )}
                onClick={handleLessonClick}
              >
                <span className="flex-1 text-center">{lesson.name}</span>
                {!isLessonAvailable && (
                  <Lock size={14} className="text-gray-400" />
                )}
              </p>
            </div>
          );
        })}

        {module.quizzes.map((quiz) => {
          const isQuizAvailable =
            (nextAvailableExamId ?? 0) >= quiz.id ||
            isFinalExamAvailable ||
            courseCompleted;

          const handleQuizClick = () => {
            if (isQuizAvailable) {
              setActiveExamHandler(quiz, ExamType.QUIZ);
            }
          };

          return (
            <p
              key={quiz.id}
              className={clsx(
                "border-primary dark:border-dark-primary text-text text-text-tiny dark:text-dark-text flex items-center justify-between rounded-2xl border px-4 py-1",
                {
                  "cursor-pointer": isQuizAvailable,
                  "cursor-not-allowed opacity-50": !isQuizAvailable,
                  "bg-primary dark:bg-dark-primary text-white":
                    activeExam?.id === quiz.id && isQuizAvailable,
                },
              )}
              onClick={handleQuizClick}
            >
              <span className="flex-1 text-center">اختبار</span>
              {!isQuizAvailable && <Lock size={14} className="text-gray-400" />}
            </p>
          );
        })}
      </div>
    </div>
  );
}
