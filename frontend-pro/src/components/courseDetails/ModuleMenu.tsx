import { useGetMe } from "@/hooks/auth/useGetMe";
import ModuleTab from "./ModuleTab";
import type { Course, ExamHeader } from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import type { Dispatch, SetStateAction } from "react";
import HeaderButton from "./HeaderButton";
import { X } from "lucide-react";
import { courseContent } from "@/constants/courseContent";

interface ModuleMenuProps {
  openedModule: number | undefined;
  courseDetails: Course | undefined;
  activeLessonId: number | undefined;
  setActiveLessonHandler: (lessonId: number) => void;
  activeExam: ExamHeader | undefined;
  setActiveExamHandler: (exam: ExamHeader, examType: ExamType) => void;
  setOpendModule: Dispatch<SetStateAction<number | undefined>>;
  isOpen?: boolean;
  onClose?: () => void;
}

const ModuleMenu = ({
  openedModule,
  courseDetails,
  activeLessonId,
  setActiveLessonHandler,
  activeExam,
  setActiveExamHandler,
  setOpendModule,
  isOpen = true,
  onClose,
}: ModuleMenuProps) => {
  const { me } = useGetMe();
  const progressData = me?.current_progress_data;
  const nextAvailableModuleId = progressData?.next_available_module_id;
  const nextAvailableExamId = progressData?.next_available_exam_id;
  const isFinalExamAvailable = progressData?.is_final_exam_available;
  const courseCompleted = progressData?.course_completed;

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
          {courseContent.map((content, index) => {
            if (content.type === "module") {
              return (
                <ModuleTab
                  key={content.id}
                  module={content}
                  moduleIndex={index}
                  activeLessonId={activeLessonId}
                  setActiveLessonHandler={setActiveLessonHandler}
                  activeExam={activeExam}
                  setActiveExamHandler={setActiveExamHandler}
                  openedModule={openedModule}
                  setOpendModule={setOpendModule}
                  nextAvailableModuleId={nextAvailableModuleId}
                  nextAvailableExamId={nextAvailableExamId}
                />
              );
            }
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
