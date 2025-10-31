import AssetResource from "@/components/courseDetails/AssetsRresource";
import ModuleMenu from "@/components/courseDetails/ModuleMenu";
import ExamArea from "@/components/Exam/ExamArea";
import Spinner from "@/components/Spinner";
import { useGetMe } from "@/hooks/auth/useGetMe";
import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";
import type { ExamHeader, LessonHeader } from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import AssetsViewerFooter from "../../components/courseDetails/AssetsViewerFooter";

export default function CourseDetails() {
  const courseId = useParams().courseId;
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeLesson, setActiveLesson] = useState<LessonHeader>();
  const [activeExam, setActiveExam] = useState<ExamHeader>();
  const [openedModule, setOpendModule] = useState<number>();
  const [examType, setExamType] = useState<ExamType>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { courseDetails, isPending } = useGetCourseDetails(courseId);
  const { me } = useGetMe();

  const didNotSubmitPreExam =
    me?.current_progress_data.completed_modules &&
    me.current_progress_data.completed_modules.length === 0 &&
    !me?.current_progress_data.is_final_exam_available &&
    me.current_progress_data.next_available_module_id === null &&
    me.current_progress_data.next_available_exam_id === null;

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

      /* Handling final-exam */
      const exam = courseDetails.exams.find((exam) => exam.id === examIdNum);
      if (exam) {
        setActiveExam(exam);
        setExamType(ExamType.FINAL_EXAM);
        setActiveLesson(undefined);

        if (exam.module_id) {
          setOpendModule(exam.module_id);
        } else {
          setOpendModule(undefined);
        }
      }

      /* Handling Quizzes */
      for (const module of courseDetails.modules) {
        const quiz = module.quizzes.find((q) => q.id === examIdNum);
        if (quiz) {
          setActiveExam(quiz);
          setExamType(ExamType.QUIZ);
          setActiveLesson(undefined);
          setOpendModule(module.id);
          break;
        }
      }

      /* Handling Activity */
      for (const module of courseDetails.modules) {
        const lesson = module.lessons.find((l) => l.activity_id === examIdNum);
        if (lesson?.activity) {
          setActiveExam(lesson.activity);
          setExamType(ExamType.ACTIVITY);
          setActiveLesson(undefined);
          setOpendModule(module.id);
          break;
        }
      }
    }
  }, [courseDetails, searchParams]);

  function setActiveLessonHandler(lesson: LessonHeader) {
    setActiveLesson(lesson);
    setActiveExam(undefined);
    setSearchParams({ lessonId: String(lesson.id) }, { replace: true });
    setIsMenuOpen(false);
  }

  function setActiveExamHandler(exam: ExamHeader, examType: ExamType) {
    setActiveExam(exam);
    setActiveLesson(undefined);
    setExamType(examType);
    setSearchParams({ examId: String(exam.id) }, { replace: true });
    setIsMenuOpen(false);

    if (exam.module_id) {
      setOpendModule(exam.module_id);
    } else {
      setOpendModule(undefined);
    }
  }

  if (isPending) return <Spinner />;

  return (
    <div className="relative flex w-full flex-1 justify-center overflow-auto">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-20 right-4 z-30 cursor-pointer rounded-lg bg-[#E9E9E9] p-2 shadow-lg lg:hidden dark:bg-slate-800"
      >
        <Menu size={20} />
      </button>

      <ModuleMenu
        openedModule={openedModule}
        courseDetails={courseDetails}
        activeLesson={activeLesson}
        setActiveLessonHandler={setActiveLessonHandler}
        activeExam={activeExam}
        setActiveExamHandler={setActiveExamHandler}
        setOpendModule={setOpendModule}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <div className="flex h-full flex-1 flex-col items-center justify-center gap-12 overflow-auto p-4">
        <div className="mt-16 flex w-full flex-1 items-center justify-center lg:mt-0">
          {activeLesson && <AssetResource lessonId={activeLesson.id} />}
          {activeExam && examType && (
            <ExamArea
              examId={activeExam?.id}
              examType={examType}
              setActiveLessonHandler={setActiveLessonHandler}
              setActiveExamHandler={setActiveExamHandler}
            />
          )}
          {didNotSubmitPreExam ? (
            <div className="flex h-screen flex-col items-center justify-center gap-6">
              <p className="text-text dark:text-dark-text text-text-large font-semibold">
                يرجى إكمال الإمتحان القبلي قبل البدء في المقرر
              </p>
              <Link
                to="/pre-exam?courseId=1"
                className="font-inherit border-primary dark:border-dark-primary bg-primary dark:bg-dark-primary dark:hover:bg-dark-primary/90 hover:bg-primary/90 text-text-small cursor-pointer rounded-full border-2 px-6 py-2 text-white transition-all duration-300 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300"
              >
                الذهاب للإمتحان القبلي
              </Link>
            </div>
          ) : (
            !activeLesson &&
            !activeExam && (
              <div className="flex h-screen items-center justify-center">
                <p className="text-text dark:text-dark-text text-text-large font-semibold">
                  برجاء اختيار الدرس
                </p>
              </div>
            )
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
