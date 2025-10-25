import { useGetMe } from "@/hooks/auth/useGetMe";
import type { Course, ExamHeader, LessonHeader } from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import { X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import HeaderButton from "./HeaderButton";
import ModuleTab from "./ModuleTab";

interface ModuleMenuProps {
  openedModule: number | undefined;
  courseDetails: Course | undefined;
  activeLesson: LessonHeader | undefined;
  setActiveLessonHandler: (lesson: LessonHeader) => void;
  activeExam: ExamHeader | undefined;
  setActiveExamHandler: (exam: ExamHeader, examType: ExamType) => void;
  setOpendModule: Dispatch<SetStateAction<number | undefined>>;
  isOpen?: boolean;
  onClose?: () => void;
}

const ModuleMenu = ({
  openedModule,
  courseDetails,
  activeLesson,
  setActiveLessonHandler,
  activeExam,
  setActiveExamHandler,
  setOpendModule,
  isOpen = true,
  onClose,
}: ModuleMenuProps) => {
  const { me } = useGetMe();
  const progressData = me?.current_progress_data;
  const nextAvailableLessonId = progressData?.next_available_lesson_id;
  const nextAvailableExamId = progressData?.next_available_exam_id;
  const isFinalExamAvailable = progressData?.is_final_exam_available;
  const courseCompleted = progressData?.course_completed;

  // Calculate next available module ID based on next available lesson
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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-700 opacity-50 blur-lg lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Menu Container */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 transform cursor-pointer transition-transform duration-300 ease-in-out lg:static lg:right-auto lg:h-auto lg:w-[300px] ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"} flex flex-col items-center gap-2 self-stretch overflow-auto bg-[#E9E9E9] p-4 shadow-lg lg:shadow-none dark:bg-slate-800`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-lg bg-gray-200 p-2 hover:bg-gray-300 lg:hidden dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex w-full flex-col gap-4 pt-10 text-center lg:pt-10">
          {courseDetails?.modules?.map((module) => {
            return (
              <ModuleTab
                key={module.id}
                module={module}
                activeLesson={activeLesson}
                setActiveLessonHandler={setActiveLessonHandler}
                activeExam={activeExam}
                setActiveExamHandler={setActiveExamHandler}
                openedModule={openedModule}
                setOpendModule={setOpendModule}
                nextAvailableLessonId={nextAvailableLessonId}
                nextAvailableModuleId={nextAvailableModuleId}
                nextAvailableExamId={nextAvailableExamId}
                isFinalExamAvailable={isFinalExamAvailable}
                courseCompleted={courseCompleted}
              />
            );
          })}
          {/* Final-exam */}
          <HeaderButton
            title="الامتحان البعدي"
            disabled={!isFinalExamAvailable && !courseCompleted}
            onClick={() => {
              setActiveExamHandler(
                courseDetails!.exams[0],
                ExamType.FINAL_EXAM,
              );
              onClose?.();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ModuleMenu;
