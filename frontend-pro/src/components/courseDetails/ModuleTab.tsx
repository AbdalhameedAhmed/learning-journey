import { courseContent } from "@/constants/courseContent";
import { useGetMe } from "@/hooks/auth/useGetMe";
import { useGetFavorites } from "@/hooks/courseContent/useGetFavorites";
import type { ExamHeader } from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import clsx from "clsx";
import { Heart, Lock } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import HeaderButton from "./HeaderButton";

interface Module {
  id: number;
  type: string;
  name: string;
  firstOrder?: number;
}

type ModuleTabProps = {
  module: Module;
  moduleIndex: number;
  activeLessonId: number | undefined;
  setActiveLessonHandler: (lesson: number) => void;
  activeExam: ExamHeader | undefined;
  setActiveExamHandler: (exam: ExamHeader, examType: ExamType) => void;
  openedModule: number | undefined;
  setOpendModule: Dispatch<SetStateAction<number | undefined>>;
  nextAvailableModuleId?: number | null;
  nextAvailableExamId?: number | null;
};

export default function ModuleTab({
  module,
  moduleIndex,
  activeLessonId,
  setActiveLessonHandler,
  activeExam,
  setActiveExamHandler,
  openedModule,
  setOpendModule,
}: ModuleTabProps) {
  const { favorites } = useGetFavorites();
  const { me } = useGetMe();

  const isModuleLocked =
    me?.current_progress_data.current_progress === null ||
    (module.firstOrder &&
      me!.current_progress_data.current_progress < module.firstOrder);

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
        disabled={!!isModuleLocked}
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
        {(() => {
          const elements = [];

          for (let i = moduleIndex + 1; i < courseContent.length; i++) {
            const content = courseContent[i];

            if (content.type === "module") {
              break;
            }

            if (content.type === "lesson" || content.type === "activity") {
              const isLessonLocked = isModuleLocked;
              const isFavorited = isLessonFavorited(content.id);

              const handleLessonClick = () => {
                if (!isLessonLocked) {
                  setActiveLessonHandler(content.id);
                }
              };

              elements.push(
                <div className="relative" key={i}>
                  <p
                    className={clsx(
                      "border-primary dark:border-dark-primary text-text-tiny text-text dark:text-dark-text flex items-center justify-between rounded-2xl border px-4 py-1",
                      {
                        "cursor-pointer": !isLessonLocked,
                        "cursor-not-allowed opacity-50": isLessonLocked,
                        "bg-primary dark:bg-dark-primary text-white":
                          activeLessonId === content.id && !isLessonLocked,
                      },
                    )}
                    onClick={handleLessonClick}
                  >
                    <span className="flex-1 text-center">{content.name}</span>
                    {isLessonLocked && (
                      <Lock size={14} className="text-gray-400" />
                    )}
                  </p>

                    {isFavorited && content.type === "lesson" ? (
                    <div className="absolute top-1/2 left-2 -translate-y-1/2">
                      <Heart
                        size={14}
                        className="fill-red-500 text-red-500 drop-shadow-sm"
                      />
                    </div>
                  ):null}
                </div>,
              );
            } else if (content.type === "exam") {
              const isQuizLocked = isModuleLocked;

              const handleQuizClick = () => {
                if (!isQuizLocked) {
                  setActiveExamHandler(
                    { id: content.id, module_id: content.module_id },
                    ExamType.QUIZ,
                  );
                }
              };

              elements.push(
                <p
                  key={content.id}
                  className={clsx(
                    "border-primary dark:border-dark-primary text-text text-text-tiny dark:text-dark-text flex items-center justify-between rounded-2xl border px-4 py-1",
                    {
                      "cursor-pointer": !isQuizLocked,
                      "cursor-not-allowed opacity-50": isQuizLocked,
                      "bg-primary dark:bg-dark-primary text-white":
                        activeExam?.id === content.id && !isQuizLocked,
                    },
                  )}
                  onClick={handleQuizClick}
                >
                  <span className="flex-1 text-center">{content.name}</span>
                  {isQuizLocked && <Lock size={14} className="text-gray-400" />}
                </p>,
              );
            }
          }

          return elements;
        })()}
      </div>
    </div>
  );
}
