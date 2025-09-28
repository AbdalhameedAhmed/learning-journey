import type { ExamHeader, LessonHeader, Module } from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import clsx from "clsx";
import { Lock } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import HeaderButton from "./HeaderButton";

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
  const isModuleLocked =
    nextAvailableModuleId === null ||
    (typeof nextAvailableModuleId === "number" &&
      module.id > nextAvailableModuleId);

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
      >
      </HeaderButton>
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

          const handleLessonClick = () => {
            if (!isLessonLocked) {
              setActiveLessonHandler(lesson);
            }
          };

          return (
            <p
              key={lesson.id}
              className={clsx(
                "border-primary flex items-center justify-between rounded-2xl border px-4 py-1",
                {
                  "cursor-pointer": !isLessonLocked,
                  "cursor-not-allowed opacity-50": isLessonLocked,
                  "bg-primary text-white":
                    activeLesson?.id === lesson.id && !isLessonLocked,
                },
              )}
              onClick={handleLessonClick}
            >
              <span className="flex-1 text-center">{lesson.name}</span>
              {isLessonLocked && <Lock size={14} className="text-gray-400" />}
            </p>
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
                "border-primary flex items-center justify-between rounded-2xl border px-4 py-1",
                {
                  "cursor-pointer": !isQuizLocked,
                  "cursor-not-allowed opacity-50": isQuizLocked,
                  "bg-primary text-white":
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
