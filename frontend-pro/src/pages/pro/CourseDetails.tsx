import AssetResource from "@/components/courseDetails/AssetsRresource";
import ModuleMenu from "@/components/courseDetails/ModuleMenu";
import ExamArea from "@/components/Exam/ExamArea";
import Spinner from "@/components/Spinner";
import { useGetMe } from "@/hooks/auth/useGetMe";
import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";
import type { ExamHeader } from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import AssetsViewerFooter from "../../components/courseDetails/AssetsViewerFooter";

export default function CourseDetails() {
  const courseId = useParams().courseId;
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeLessonId, setActiveLessonId] = useState<number>();
  const [activeExam, setActiveExam] = useState<ExamHeader>();
  const [openedModule, setOpendModule] = useState<number>();
  const [examType, setExamType] = useState<ExamType>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { courseDetails, isPending } = useGetCourseDetails(courseId);
  const { me } = useGetMe();

  const didNotSubmitPreExam =
    me?.current_progress_data.current_progress == null;

  useEffect(() => {
    if (!courseDetails) return;

    console.log("useEffect in course details page ✌️");

    const lessonId = searchParams.get("lessonId");
    const examId = searchParams.get("examId");

    console.log({ lessonId, examId });

    if (lessonId) {
      for (const module of courseDetails.modules) {
        const lesson = module.lessons.find((l) => l.id === parseInt(lessonId));
        if (lesson) {
          setActiveLessonId(lesson.id);
          setActiveExam(undefined);
          break;
        }
      }
    } else if (examId) {
      console.log("found examId", { examId });
      const examIdNum = parseInt(examId);

      console.log({ courseDetails });

      /* Handling final-exam */
      const exam = courseDetails.exams.find((exam) => exam.id === examIdNum);
      console.log({ exam });
      if (exam) {
        console.log("is exma");
        console.log(exam.module_id);
        setActiveExam(exam);
        setExamType(ExamType.FINAL_EXAM);
        setActiveLessonId(undefined);

        if (exam.module_id) {
          setOpendModule(exam.module_id);
        } else {
          setOpendModule(undefined);
        }
      }

      /* Handling Quizzes */
      for (const module of courseDetails.modules) {
        const quiz = module.quizzes.find((q) => q.id === examIdNum);
        console.log({ quiz });
        if (quiz) {
          console.log("found quiz");
          console.log({ module });
          setActiveExam(quiz);
          setExamType(ExamType.QUIZ);
          setActiveLessonId(undefined);
          setOpendModule(module.id);
          break;
        }
      }

      /* Handling Activity */
      // console.log("trying to find activity..")
      // for (const module of courseDetails.modules) {
      //   const lesson = module.lessons.find((l) => l.activity_id === examIdNum);
      //   if (lesson?.activity) {
      //     console.log('found activity',lesson.activity)
      //     setActiveExam(lesson.activity);
      //     setExamType(ExamType.ACTIVITY);
      //     setActiveLessonId(undefined);
      //     setOpendModule(module.id);
      //     break;
      //   }
      // }
    }
  }, [courseDetails, searchParams]);

  function setActiveLessonHandler(lessonId: number) {
    setActiveLessonId(lessonId);
    setActiveExam(undefined);
    setSearchParams({ lessonId: String(lessonId) }, { replace: true });
    setIsMenuOpen(false);
  }

  function setActiveExamHandler(exam: ExamHeader, examType: ExamType) {
    setActiveExam(exam);
    setActiveLessonId(undefined);
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
        activeLessonId={activeLessonId}
        setActiveLessonHandler={setActiveLessonHandler}
        activeExam={activeExam}
        setActiveExamHandler={setActiveExamHandler}
        setOpendModule={setOpendModule}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <div className="flex h-full flex-1 flex-col items-center justify-center gap-12 overflow-auto p-4">
        <div className="mt-16 flex w-full flex-1 items-center justify-center lg:mt-0">
          {activeLessonId && <AssetResource lessonId={activeLessonId} />}
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
            !activeLessonId &&
            !activeExam && (
              <div className="flex h-screen items-center justify-center">
                <p className="text-text dark:text-dark-text text-text-large font-semibold">
                  برجاء اختيار الدرس
                </p>
              </div>
            )
          )}
        </div>
        {activeLessonId && (
          <AssetsViewerFooter
            lessonId={activeLessonId}
            setActiveLessonHandler={setActiveLessonHandler}
            setActiveExamHandler={setActiveExamHandler}
            courseDetails={courseDetails}
          />
        )}
      </div>
    </div>
  );
}
