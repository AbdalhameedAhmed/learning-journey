import AssetResource from "@/components/courseDetails/AssetsRresource";
import HeaderButton from "@/components/courseDetails/HeaderButton";
import ModuleMenu from "@/components/courseDetails/ModuleMenu";
import ExamArea from "@/components/Exam/ExamArea";
import Spinner from "@/components/Spinner";
import { useGetMe } from "@/hooks/auth/useGetMe";
import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";
import type { ExamHeader, LessonHeader } from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AssetsViewerFooter from "../../components/courseDetails/AssetsViewerFooter";

export default function CourseDetails() {
  const courseId = useParams().courseId;
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeLesson, setActiveLesson] = useState<LessonHeader>();
  const [activeExam, setActiveExam] = useState<ExamHeader>();
  const [openedModule, setOpendModule] = useState<number>();
  const [examType, setExamType] = useState<ExamType>();
  const { courseDetails, isPending } = useGetCourseDetails(courseId);
  const { me, isPending: isUserPending } = useGetMe();

  useEffect(() => {
    if (!courseDetails) return;

    const lessonId = searchParams.get("lessonId");
    const examId = searchParams.get("examId");

    if (lessonId) {
      for (const module of courseDetails.modules) {
        const lesson = module.lessons.find((l) => l.id === parseInt(lessonId));
        if (lesson) {
          setActiveLesson(lesson);
          setOpendModule(module.id);
          setActiveExam(undefined);
          break;
        }
      }
    } else if (examId) {
      const examIdNum = parseInt(examId);
      const exam = courseDetails.exams.find((exam) => exam.id === examIdNum);
      if (exam) {
        setActiveExam(exam);
        setActiveLesson(undefined);

        if (exam.module_id) {
          setOpendModule(exam.module_id);
        } else {
          setOpendModule(undefined);
        }
      }
    }
  }, [courseDetails, searchParams]);

  function setActiveLessonHandler(lesson: LessonHeader) {
    setActiveLesson(lesson);
    setActiveExam(undefined);
    setSearchParams({ lessonId: String(lesson.id) }, { replace: true });
  }

  function setActiveExamHandler(exam: ExamHeader, examType: ExamType) {
    setActiveExam(exam);
    setActiveLesson(undefined);
    setExamType(examType);
    setSearchParams({ examId: String(exam.id) }, { replace: true });

    if (exam.module_id) {
      setOpendModule(exam.module_id);
    } else {
      setOpendModule(undefined);
    }
  }

  if (isPending || isUserPending) return <Spinner />;

  const progressData = me?.current_progress_data;
  const nextAvailableModuleId = progressData?.next_available_module_id;
  const nextAvailableExamId = progressData?.next_available_exam_id;
  const isFinalExamAvailable = progressData?.is_final_exam_available;
  const courseCompleted = progressData?.course_completed;

  return (
    <div className="-mt-24 flex w-full flex-1 items-center justify-center overflow-auto">
      <div className="flex w-[300px] flex-col items-center gap-2 self-stretch overflow-auto rounded-tl-lg rounded-bl-lg bg-[#E9E9E9] p-4 dark:bg-slate-800">
        <div className="flex w-full flex-col gap-4 pt-10 text-center">
          {courseDetails?.modules?.map((module) => {
            return (
              <ModuleMenu
                key={module.id}
                module={module}
                activeLesson={activeLesson}
                setActiveLessonHandler={setActiveLessonHandler}
                activeExam={activeExam}
                setActiveExamHandler={setActiveExamHandler}
                openedModule={openedModule}
                setOpendModule={setOpendModule}
                nextAvailableModuleId={nextAvailableModuleId}
                nextAvailableExamId={nextAvailableExamId}
              />
            );
          })}
          {/* Final-exam */}
          <HeaderButton
            title="الامتحان البعدي"
            disabled={!isFinalExamAvailable && !courseCompleted}
            onClick={() =>
              setActiveExamHandler(courseDetails!.exams[0], ExamType.FINAL_EXAM)
            }
          />
        </div>
      </div>
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-12 overflow-auto p-12">
        <div className="flex w-full flex-1 items-center justify-center">
          {activeLesson && <AssetResource lessonId={activeLesson.id} />}
          {activeExam && examType && (
            <ExamArea examId={activeExam?.id} examType={examType} />
          )}
          {!activeLesson && !activeExam && (
            <p className="text-text dark:text-dark-text text-text-normal">
              برجاء اختيار الدرس
            </p>
          )}
        </div>
        {activeLesson && (
          <AssetsViewerFooter
            lessonId={activeLesson.id}
            setActiveLessonHandler={setActiveLessonHandler}
            setActiveExamHandler={setActiveExamHandler}
            courseDetails={courseDetails}
          />
        )}
      </div>
    </div>
  );
}
